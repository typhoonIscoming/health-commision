import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const list = ref([]);

	// 保存配置
	const worksheetInfo = ref({});

	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'xlcpjwj',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};

	const getData = async (filter = '心理测评') => {
		let config = {};
		if (isEmpty(worksheetInfo.value)) {
			const result = await getWorksheet();
			if (isEmpty(result)) {
				return;
			}
			config = result;
		} else {
			config = worksheetInfo.value;
		}
		const { views, controls } = config;
		const view = views.find((item) => item.name === '全部');
		const control = controls.find((item) => item.alias === 'leixing');
		const option = control.options.find((item) => item.value === filter);
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'xlcpjwj',
			viewId: view.viewId,
			listType: 1,
			isAsc: false,
			filters: [
				{
					controlId: control.controlId,
					// values: ['62224596'],
					values: [option.key],
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(params));
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		list.value = response.data.rows;
	};

	return {
		list,
		getData,
	};
};
