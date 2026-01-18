import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const evaluteList = ref([]);

	// 保存配置
	const worksheetInfo = ref({});

	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'cswj',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		console.log('满意度调查getWorksheet', res);
		worksheetInfo.value = res.data;
		return res.data;
	};
	const getData = async ({ pageIndex, pageSize, refresh = false }) => {
		const userInfo = uni.getStorageSync('b2cAuth');
		const b2cUserInfo = uni.getStorageSync('b2cUserInfo');
		if (isEmpty(userInfo) || isEmpty(b2cUserInfo)) {
			return;
		}
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
		const control = controls.find((item) => item.alias === 'rywh');
		if (isEmpty(view)) {
			return;
		}
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'cswj',
			viewId: view.viewId,
			pageSize,
			pageIndex,
			listType: 0,
			filters: [
				{
					spliceType: 1,
					isGroup: true,
					groupFilters: [
						{
							controlId: control.controlId,
							dataType: 29,
							spliceType: 1,
							filterType: 51,
							dynamicSource: [],
							values: [b2cUserInfo.rowid],
						},
					],
				},
			],
		};
		const [err, res] = await to(getWorksheetDetail(params));
		// console.log('获取用户填写的问卷', res);
		if (err || !res.success || isEmpty(res.data)) {
			return;
		}
		if (refresh) {
			evaluteList.value = res.data.rows;
		} else {
			evaluteList.value = evaluteList.value.concat(res.data.rows);
		}
		return res.data;
	};
	return {
		evaluteList,
		getData,
	};
};
