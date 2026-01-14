import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRelationSheet } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const noticeList = ref([]);
	// 保存配置
	const worksheetInfo = ref({});

	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ggxxgl',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};
	const getList = async ({ pageIndex, pageSize, refresh = false }) => {
		const userInfo = uni.getStorageSync('b2cAuth');
		if (isEmpty(userInfo)) {
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
		const sortControl = controls.find((item) => item.alias === 'fbrq');
		if (isEmpty(view)) {
			return;
		}
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ggxxgl',
			viewId: view.viewId,
			pageSize,
			pageIndex,
			listType: 1,
			sortId: sortControl.controlId,
			isAsc: false,
		};
		const [e, response] = await to(getWorksheetDetail(params));
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		if (refresh) {
			noticeList.value = response.data.rows;
		} else {
			noticeList.value = noticeList.value.concat(response.data.rows);
		}
		return response.data;
	};

	return {
		noticeList,
		getList,
	};
};
