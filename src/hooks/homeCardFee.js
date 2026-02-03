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
	const sheet = ref();
	// 离休人员获取门诊等三个图表的数据
	const retiredData = async ({
		pageIndex = 1,
		pageSize = 20,
		isfresh,
		sorts = {},
	}) => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ltxryjsfy',
		};
		let view = null;
		let control = null;
		if (isEmpty(sheet.value)) {
			// 获取视图配置
			const [err, res] = await to(getWorksheetInfo(params));
			// console.log('离退休人员编号', res);
			if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
				return;
			}
			sheet.value = res.data;
			view = res.data.views.find(
				(item) => item.name.indexOf('二次补偿列表') > -1,
			);
			control = res.data.controls.find((item) => item.alias === 'grbh');
			if (isEmpty(view) || isEmpty(control)) {
				return;
			}
		} else {
			view = sheet.value.views.find(
				(item) => item.name.indexOf('二次补偿列表') > -1,
			);
			control = sheet.value.controls.find(
				(item) => item.alias === 'grbh',
			);
			if (isEmpty(view) || isEmpty(control)) {
				return;
			}
		}

		// 获取列表数据
		const query = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'ltxryjsfy',
			viewId: view.viewId,
			pageSize,
			pageIndex,
			...sorts,
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
		list.value = list.value.map((item) => {
			const { name, list: itemList } = item;
			if (name === 'mz') {
				const result = isfresh ? itemList : itemList.concat(mz);
				return { ...item, count: mz.length, list: result };
			} else if (name === 'zy') {
				const result = isfresh ? itemList : itemList.concat(zy);
				return { ...item, count: zy.length, list: result };
			} else {
				const result = isfresh ? itemList : itemList.concat(mb);
				return { ...item, count: mb.length, list: result };
			}
		});
		return list.value;
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
					// value: '62052661',
					value: userInfo.ybbh,
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(query));
		if (e || isEmpty(response) || !response.success) {
			return;
		}
		const result = response.data.rows.filter((k) => k);
		if (isEmpty(result)) {
			return;
		}
	};
	// 获取数据
	const getData = ({ pageIndex = 1, pageSize = 20, isfresh, sorts }) => {
		return new Promise((resolve) => {
			// 这里要获取当前用户是否已经离休或在职
			if (isEmpty(userInfo)) {
				return resolve();
			}
			const params = {
				pageIndex,
				pageSize,
				isfresh,
				sorts,
			};
			const status = userInfo.ryzt;
			if (['离休', '退休'].includes(status)) {
				retiredData(params).finally(() => {
					resolve();
				});
			} else {
				employedData(params).finally(() => {
					resolve();
				});
			}
		});
	};
	onMounted(() => {
		if (auto) {
			getData({});
		}
	});
	return {
		list,
		getData,
	};
};
