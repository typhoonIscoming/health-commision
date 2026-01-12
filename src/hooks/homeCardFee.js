import { onMounted, ref } from 'vue';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';
import { getWorksheetInfo, getWorksheetDetail } from '@/api';

export default (auto = true) => {
	const userInfo = uni.getStorageSync('b2cAuth');
	const list = ref([
		{ name: 'mz', count: 0, list: [] },
		{ name: 'mzmb', count: 0, list: [] },
		{ name: 'zy', count: 0, list: [] },
	]);
	// 离休人员获取门诊等三个图表的数据
	const retiredData = async () => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ltxryjsfy',
		};
		// 获取视图配置
		const [err, res] = await to(getWorksheetInfo(params));
		// console.log('retiredData', res);
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		const view = res.data.views.find(
			(item) => item.name.indexOf('二次补偿列表') > -1,
		);
		const control = res.data.controls.find((item) => item.alias === 'grbh');
		if (isEmpty(view) || isEmpty(control)) {
			return;
		}

		// 获取列表数据
		const query = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ltxryjsfy',
			viewId: view.viewId,
			pageSize: 20,
			pageIndex: 1,
			listType: 1,
			filters: [
				{
					controlId: control.controlId,
					// value: '62166892',
					value: userInfo.ybbh,
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(query));
		// console.log('response', response);
		if (e || isEmpty(response) || !response.success) {
			return;
		}
		const result = response.data.rows.filter((k) => k);
		if (isEmpty(result)) {
			return;
		}
		const zy = [];
		const mz = [];
		const mb = [];
		result.forEach((item) => {
			const { jzlb } = item;
			if (jzlb.indexOf('住院') > -1) {
				zy.push(item);
			} else if (jzlb.indexOf('一般门诊') > -1) {
				mz.push(item);
			} else {
				mb.push(item);
			}
		});
		console.log('=====', zy);
		list.value = list.value.map((item) => {
			const { name } = item;
			if (name === 'mz') {
				return { ...item, count: mz.length, list: mz };
			} else if (name === 'zy') {
				return { ...item, count: zy.length, list: zy };
			} else {
				return { ...item, count: mb.length, list: mb };
			}
		});
	};
	// 在职人员获取门诊等三个图表的数据
	const employedData = async () => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'zzryjsfy',
		};
		// 获取视图配置
		const [err, res] = await to(getWorksheetInfo(params));
		console.log('====', res);
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		const view = res.data.views.find(
			(item) => item.name.indexOf('二次补偿列表') > -1,
		);
		const control = res.data.controls.find((item) => item.alias === 'grbh');
		console.log('controlcontrol', control);
		if (isEmpty(view) || isEmpty(control)) {
			return;
		}
		// 获取列表数据
		const query = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ltxryjsfy',
			viewId: view.viewId,
			pageSize: 20,
			pageIndex: 1,
			listType: 1,
			filters: [
				{
					controlId: control.controlId,
					value: '62052661',
					// value: userInfo.ybbh,
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(query));
		console.log('response', response);
		if (e || isEmpty(response) || !response.success) {
			return;
		}
		const result = response.data.rows.filter((k) => k);
		if (isEmpty(result)) {
			return;
		}
	};
	// 获取数据
	const getData = () => {
		return new Promise((resolve) => {
			// 这里要获取当前用户是否已经离休或在职
			if (isEmpty(userInfo)) {
				return resolve();
			}
			const status = userInfo.ryzt;
			if (status === '离休') {
				retiredData().finally(() => {
					resolve();
				});
			} else {
				employedData().finally(() => {
					resolve();
				});
			}
		});
	};
	onMounted(() => {
		if (auto) {
			getData();
		}
	});
	return {
		list,
		getData,
	};
};
