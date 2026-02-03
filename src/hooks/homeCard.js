import { onMounted, ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRowDetail } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default (auto) => {
	const num = ref(0);
	const list = ref([]);

	const personInfo = ref();
	const worksheetInfo = ref();
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
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		const row = response.data.rows[0];
		uni.setStorageSync('b2cUserInfo', row);
		personInfo.value = row;
		return row;
	};
	const onWorksheetInfo = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tjbg',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || isEmpty(res) || !res.success) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};
	const getList = async ({
		pageIndex = 1,
		pageSize = 20,
		isfresh,
		sorts = {},
	}) => {
		let person = personInfo.value;
		let config = worksheetInfo.value;
		if (isEmpty(person)) {
			person = await onPersonList();
			if (isEmpty(person)) {
				return;
			}
		}
		if (isEmpty(config)) {
			config = await onWorksheetInfo();
			if (isEmpty(config)) {
				return;
			}
		}
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
				pageSize,
				pageIndex,
				...sorts, // 排序条件[isAsc是否升序， sortId排序id]
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
		const result = res.data.rows.map((item) => {
			const row = item[urlControl.controlId];
			return { ...item, url: row };
		});
		if (isfresh) {
			list.value = result;
		} else {
			list.value = list.value.concat(result);
		}
		num.value = res.data.total;
		return res.data;
	};
	onMounted(() => {
		if (auto) {
			getList({});
		}
	});
	return {
		tjbgNum: num, // 体检报告数量
		tjbgList: list,
		getList,
	};
};
