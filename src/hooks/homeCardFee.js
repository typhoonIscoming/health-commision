import { onMounted, ref } from 'vue';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';
import { getWorksheetInfo, getWorksheetDetail } from '@/api';

export default () => {
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
		console.log('retiredData', res);
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
					value: '62166892',
					filterType: 2,
					dataType: 2,
					spliceType: 1,
				},
			],
		};
		const [e, response] = await to(getWorksheetDetail(query));
		console.log('response', response);
	};
	// 获取数据
	const getData = () => {
		// 这里要获取当前用户是否已经离休或在职
		const userInfo = uni.getStorageSync('b2cAuth');
		if (isEmpty(userInfo)) {
			return;
		}
		retiredData();
	};
	onMounted(() => {
		getData();
	});
	return list;
};
