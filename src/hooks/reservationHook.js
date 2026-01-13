import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRowDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const reservationList = ref([]);
	// 保存配置
	const worksheetInfo = ref({});

	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tjyyyhmx',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};
	const getList = async ({ pageIndex, pageSize, refresh = false }) => {
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
		const control = controls.find((item) => item.alias === 'ybbh');
		const sortControl = controls.find((item) => item.alias === 'yyrq');
		if (isEmpty(view) || isEmpty(control)) {
			return;
		}
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tjyyyhmx',
			viewId: view.viewId,
			pageSize,
			pageIndex,
			listType: 1,
			sortId: sortControl.controlId,
			isAsc: false,
			filters: [
				{
					controlId: control.controlId,
					// values: ['62224596'],
					values: [userInfo.ybbh],
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
		if (refresh) {
			reservationList.value = response.data.rows;
		} else {
			reservationList.value = reservationList.value.concat(
				response.data.rows,
			);
		}
		return response.data;
	};
	return {
		reservationList,
		getList,
	};
};
