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
			// getHospitialDateList(curr);
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
		let list = res.data.rows || [];
		// 先按日期合并（相同日期合并剩余预约数），再排序并取前 9 条
		const mergedMap = {};
		list.forEach((row) => {
			const date = row.yyrq;
			if (!date) return;
			const num = row.dqhsyyys ? Number(row.dqhsyyys) : 0;
			if (!mergedMap[date]) {
				mergedMap[date] = {
					...row,
					dqhsyyys: num,
				};
			} else {
				mergedMap[date].dqhsyyys =
					(mergedMap[date].dqhsyyys || 0) + num;
			}
		});
		// 根据当前时间确定起始日期：
		// - 若当前时间 >= 14:00，则从第二天开始取
		// - 否则包含今天（从今天开始取）
		const now = new Date();
		const baseDate = new Date();
		baseDate.setHours(0, 0, 0, 0);
		if (now.getHours() >= 14) {
			baseDate.setDate(baseDate.getDate() + 1);
		}
		list = Object.keys(mergedMap)
			.filter((key) => {
				const d = new Date(key);
				d.setHours(0, 0, 0, 0);
				return d.getTime() >= baseDate.getTime();
			})
			.sort((a, b) => +new Date(a) - +new Date(b))
			.map((key) => mergedMap[key])
			.slice(0, 9);
		// console.log('merged list', list);
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
