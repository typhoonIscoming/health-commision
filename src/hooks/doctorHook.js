import { ref } from 'vue';
import { getWorksheetInfo, getWorksheetDetail } from '@/api';
import { to, isEmpty, isJSON } from '@/utils';
import constants from '@/utils/constants';
import parseHtml from '@/utils/html-paser';

// import lvsq from '@/static/doctor/lqs.png';
// import whm from '@/static/doctor/whm.png';
// import zl from '@/static/doctor/zl.png';

export default () => {
	const list = ref([]);
	// 保存配置
	const worksheetInfo = ref({});

	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'myfc',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};

	const getData = async () => {
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
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'myfc',
			viewId: view.viewId,
			listType: 1,
			isAsc: false,
		};
		const [e, response] = await to(getWorksheetDetail(params));
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		list.value = response.data.rows
			.sort((a, b) => {
				// 判断a/b是否有设置排序数字，没有的话就向后排
				const aIndex = Number(a.pxzd) || Number.MAX_SAFE_INTEGER;
				const bIndex = Number(b.pxzd) || Number.MAX_SAFE_INTEGER;
				return aIndex - bIndex > 0 ? 1 : -1;
			})
			.map((item) => {
				const desc = parseHtml(item.zyzl);
				const hasImg =
					item.yszp &&
					isJSON(item.yszp) &&
					JSON.parse(item.yszp).length > 0;
				const img = hasImg
					? JSON.parse(item.yszp)[0]?.large_thumbnail_full_path
					: '';
				return {
					desc: desc,
					avatar: img,
					...item,
					id: item.rowid,
				};
			});
		console.log('名医风采排序后:', response.data.rows, list.value);
	};

	return {
		list,
		getData,
	};
};
