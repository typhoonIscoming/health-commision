import { ref } from 'vue';
import { getWorksheetInfo, addRow, getWorksheetDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const tableList = ref([]);

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
		console.log('getWorksheet', res);
		worksheetInfo.value = res.data;
		return res.data;
	};

	const addData = async (data) => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'cswj',
			triggerWorkflow: true,
			controls: data,
		};
		const [err, res] = await to(addRow(params));
		if (err || !res.success) {
			return;
		}
		return res;
	};
	return {
		worksheetInfo,
		getWorksheet,
		addData,
	};
};
