import { onMounted, ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail, getRelationSheet } from '@/api';
import { to, isEmpty } from '@/utils';
import constants from '@/utils/constants';

export default () => {
	const hospitial = ref([]);
	const currentIndex = ref(0);

	const tjyyControls = ref([]);
	// 获取机构列表
	const getHospitial = async () => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tyyy',
		};
		// 获取配置
		const [err, res] = await to(getWorksheetInfo(params));
		// console.log('体检预约', res);
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		tjyyControls.value = res.data.controls;
		const view = res.data.views.find((item) => item.name === '全部');
		if (isEmpty(view)) {
			return;
		}
		// 获取视图
		const query = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tyyy',
			viewId: view.viewId,
			pageSize: 20,
			pageIndex: 1,
			listType: 1,
		};
		const [e, response] = await to(getWorksheetDetail(query));
		// console.log('机构列表', response);
		if (!isEmpty(e) || !response.success || isEmpty(response.data.rows)) {
			return;
		}
		hospitial.value = response.data.rows.map((item) => {
			return {
				...item,
				name: item.jgmc,
			};
		});
		const curr = hospitial.value[currentIndex.value];
		if (!isEmpty(curr)) {
			getHospitialDateList(curr);
		}
	};

	// 获取当前医院的预约日期列表
	const getHospitialDateList = async (currHospitial) => {
		// console.log('getHospitialDateList', currHospitial);
		if (isEmpty(currHospitial)) {
			return;
		}
		const config = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tykyysmx',
		};
		const [configErr, configRes] = await to(getWorksheetInfo(config));
		// console.log('configRes', configRes);
		if (
			!isEmpty(configErr) ||
			!configRes.success ||
			isEmpty(configRes.data)
		) {
			return;
		}
		const view = configRes.data.views.find((item) => item.name === '全部');
		if (isEmpty(view)) {
			return;
		}
		// 获取配置
		const query = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tykyysmx',
			pageSize: 500,
			pageIndex: 1,
			viewId: view.viewId,
		};
		const [e, response] = await to(getWorksheetDetail(query));
		// console.log('配置', response);
		const control = tjyyControls.value.find(
			(item) => item.alias === 'tykyyrqmx',
		);
		if (isEmpty(control)) {
			return;
		}
		const paramas = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'tyyy',
			pageSize: 100,
			pageIndex: 1,
			controlId: control.controlId,
			rowId: currHospitial.rowid,
		};
		const [err, res] = await to(getRelationSheet(paramas));
		// console.log('getHospitialDateList', res);
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		let list = res.data.rows;
		// 排序--将当天及以后7天的数据返回
		list = list.sort((a, b) => {
			return +new Date(a.yyrq) - +new Date(b.yyrq);
		});
		// console.log('list', list);
		hospitial.value = hospitial.value.map((item) => {
			if (item.rowid === currHospitial.rowid) {
				return {
					...item,
					children: list.map((oItem) => {
						return {
							...oItem,
							date: oItem.yyrq,
							num: oItem.dqhsyyys ? Number(oItem.dqhsyyys) : 0,
						};
					}),
				};
			}
			return item;
		});
		// console.log('hospitial', hospitial.value);
	};
	return {
		hospitial,
		currentIndex,
		getHospitialDateList,
		getHospitial,
	};
};
