import { ref, onMounted } from 'vue';
import {
	getWechatToken,
	getWechatArticle,
	getMaterialList,
	getArtical,
	getWorksheetInfo,
	getWorksheetDetail,
	getRowById,
} from '@/api';
import { to, isEmpty, parseTime } from '@/utils';
import constants from '@/utils/constants';
import healthimg from '@/static/main/health1.png';

export default () => {
	const worksheetInfo = ref(null);
	const accessToken = ref();
	const list = ref([]);
	const loading = ref(false);
	const mockList = ref([
		{
			name: '糖尿病骨质疏松导致的骨折',
			updateTime: '2024-06-03',
			type: '图文消息',
			img: healthimg,
		},
		{
			name: '乙肝疫苗接种的“时间”',
			updateTime: '2024-06-02',
			type: '图文消息',
			img: healthimg,
		},
	]);
	// 获取微信token
	const getToken = async () => {
		const [err, res] = await to(
			getWechatToken({ appid: 'wx9fb4cd705642b13d' }),
		);
		if (isEmpty(res) || !res.access_token) {
			return;
		}
		accessToken.value = res.access_token;
		return res.access_token;
	};

	// 获取微信公众号文章列表
	const getWechatList = async (data, isfresh) => {
		if (isEmpty(accessToken.value)) {
			const [err, result] = await to(getToken());
			if (isEmpty(result)) {
				return;
			}
			accessToken.value = result;
		}
		const [err, res] = await to(getWechatArticle(accessToken.value, data));
		console.log('getWechatList', res);
		if (!isEmpty(err)) {
			return;
		}
		const { total_count, item } = res;
		if (isfresh) {
			list.value = item;
		} else {
			list.value = list.value.concat(item);
		}
		return {
			list: list.value,
			total: total_count,
		};
	};
	// 获取微信公众号文章列表
	const getMaterialData = async (data, isfresh) => {
		console.log('=====getMaterialData start=====', data);
		if (isEmpty(accessToken.value)) {
			const [err, result] = await to(getToken());
			console.log('getMaterialData1', err, result);
			if (isEmpty(result)) {
				return;
			}
			accessToken.value = result;
		}
		const [err, res] = await to(
			getMaterialList({ ...data, access_token: accessToken.value }),
		);
		console.log('getMaterialData', res);
		if (!isEmpty(err)) {
			return;
		}
		const { total_count, item } = res;
		const parseItem = item ? JSON.parse(item) : [];
		const result = parseItem.map((o) => ({
			...o,
			name: o.name ? o.name : '未命名公众号文章',
			type: data.type,
			updateTime: o.update_time ? parseTime(o.update_time * 1000) : '',
		}));
		if (isfresh) {
			list.value = result;
		} else {
			list.value = list.value.concat(result);
		}
		console.log('结果', result);
		return {
			list: result,
			total: total_count,
		};
	};

	// 获取群发的文章列表
	const getGroupArtical = async (data, isfresh) => {
		if (isEmpty(accessToken.value)) {
			const [err, result] = await to(getToken());
			if (isEmpty(result)) {
				return;
			}
			accessToken.value = result;
		}
		const [err, res] = await to(getArtical(accessToken.value, data));
		console.log('getArtical', res);
		if (!isEmpty(err)) {
			return;
		}
		const { total_count, item } = res;
		const result = item.map((o) => ({
			...o,
			name: o.name ? o.name : '未命名公众号文章',
			type: data.type,
			updateTime: o.update_time ? parseTime(o.update_time * 1000) : '',
		}));
		if (isfresh) {
			list.value = result;
		} else {
			list.value = list.value.concat(result);
		}
		console.log('结果', result);
		return {
			list: result,
			total: total_count,
		};
	};
	// 获取公众宣教表中的数据
	const getWorksheet = async () => {
		const data = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'gzxjxx',
		};
		const [err, res] = await to(getWorksheetInfo(data));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		worksheetInfo.value = res.data;
		return res.data;
	};
	const getData = async (args) => {
		const { pageIndex = 1, pageSize = 10 } = args || {};
		loading.value = true;
		let config = {};
		if (isEmpty(worksheetInfo.value)) {
			const result = await getWorksheet();
			if (isEmpty(result)) {
				loading.value = false;
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
			worksheetId: 'gzxjxx',
			viewId: view.viewId,
			listType: 1,
			isAsc: false,
			pageSize: pageSize,
			pageIndex: pageIndex,
		};
		const [e, response] = await to(getWorksheetDetail(params));
		loading.value = false;
		if (!isEmpty(e) || isEmpty(response.data.rows)) {
			return;
		}
		list.value = response.data.rows;
		// console.log('获取到的公众宣教表数据', list.value);
		return list.value;
	};

	// 获取详细信息
	const getDetail = async (rowId) => {
		const params = {
			appKey: constants.appKey,
			sign: constants.sign,
			worksheetId: 'gzxjxx',
			rowId: rowId,
		};
		const [err, res] = await to(getRowById(params));
		if (!isEmpty(err) || !res.success || isEmpty(res.data)) {
			return;
		}
		return res.data;
	};

	return {
		loading,
		list,
		mockList,
		getWechatList,
		getMaterialData,
		getGroupArtical,
		getData,
		getDetail,
	};
};
