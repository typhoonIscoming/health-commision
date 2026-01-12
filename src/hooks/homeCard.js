import { onMounted, ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRowDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const num = ref(0);
	const list = ref([]);
	// 人员维护信息
	const onPersonList = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'rywh',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err)) {
			return;
		}
		const view = res.data.views.find((item) => item.name === '人员列表');
		const control = res.data.controls.find((item) => item.alias === 'ybbh');
		const userInfo = uni.getStorageSync('b2cAuth');
		if (isEmpty(userInfo)) {
			return;
		}
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'rywh',
			viewId: view.viewId,
			pageSize: 20,
			pageIndex: 1,
			listType: 1,
			filters: [
				{
					controlId: control.controlId,
					values: [userInfo.ybbh],
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		// 获取人员详细信息
		const [e, response] = await to(getWorksheetDetail(params));
		// console.log('人员维护详细信息', response);
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		const row = response.data.rows[0];
		onWorksheetInfo(row);
	};
	const onWorksheetInfo = async (person, personParams) => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tjbg',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || isEmpty(res) || !res.success) {
			return;
		}
		onWorkDetail(res.data, person);
	};
	const onWorkDetail = async (config, person) => {
		const view = config.views.find((item) => item.name === '全部');
		const control = config.controls.find(
			(item) => item.controlName === '参保人员',
		);
		const urlControl = config.controls.find(
			(item) => item.controlName.indexOf('附件下载地址') > -1,
		);
		if (isEmpty(view)) {
			return;
		}
		const userInfo = uni.getStorageSync('b2cAuth');
		if (isEmpty(userInfo)) {
			return;
		}
		const [err, res] = await to(
			getWorksheetDetail({
				appKey: constants.appKey,
				sign: constants.sign,
				worksheetId: 'tjbg',
				viewId: view.viewId,
				pageSize: 20,
				pageIndex: 1,
				filters: [
					{
						controlId: control.controlId,
						value: person.rowid,
						filterType: 51,
						dataType: 29,
						spliceType: 1,
					},
				],
			}),
		);
		if (!isEmpty(err) || !res.success) {
			return;
		}
		list.value = res.data.rows.map((item) => {
			const row = item[urlControl.controlId];
			return { ...item, url: row };
		});
		num.value = res.data.total;
		// onRowDetail(person);
		// console.log('获取工作表详情成功', res, num.value);
	};
	// 获取行记录详情
	const onRowDetail = async (config) => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'txrydqrlb',
			rowId: config.rowid,
		};
		const [err, res] = await to(getRowDetail(params));
		if (isEmpty(err)) {
			return;
		}
		// console.log('onRowDetail', res);
	};
	onMounted(() => {
		onPersonList();
	});
	return {
		tjbgNum: num, // 体检报告数量
		tjbgList: list,
	};
};
