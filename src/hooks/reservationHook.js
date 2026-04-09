import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRowDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const reservationList = ref([]);
	// 保存配置
	const worksheetInfo = ref({});

	const mockList = ref([
		{
			id: '1',
			name: '预约单1',
			status: '预约确认中',
			yyrq: '2024-06-01',
			jgmc: '新疆医科大学第二附属医院（新院址）',
			jgdz: '乌鲁木齐市水磨沟区南湖东路北二巷38号',
		},
	]);

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
		const view = views.find((item) => item.name.indexOf('全部') > -1);
		const dateControl = controls.find((item) => item.alias === 'yyrq');
		const ybbhControl = controls.find((item) => item.alias === 'ybbh');
		const statusControl = controls.find((item) => item.alias === 'yyzt');
		if (isEmpty(view)) {
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
			sortId: dateControl.controlId,
			isAsc: false,
			filters: [
				{
					isGroup: true,
					spliceType: 1,
					groupFilters: [
						{
							controlId: ybbhControl.controlId,
							dataType: 2,
							spliceType: 1,
							filterType: 2,
							dynamicSource: [],
							values: [userInfo.ybbh],
						},
					],
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(params));
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		const list = response.data.rows.map((item) => {
			const v = item[statusControl.controlId];
			return {
				...item,
			};
		});
		if (refresh) {
			reservationList.value = list;
		} else {
			reservationList.value = reservationList.value.concat(list);
		}
		return response.data;
	};
	return {
		reservationList,
		mockList,
		getList,
	};
};
