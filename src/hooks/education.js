import { ref, onMounted } from 'vue';
import {
	getWechatToken,
	getWechatArticle,
	getMaterialList,
	getArtical,
} from '@/api';
import { to, isEmpty, parseTime } from '@/utils';

export default () => {
	const accessToken = ref();
	const list = ref([]);
	// 获取微信token
	const getToken = async () => {
		const [err, res] = await to(getWechatToken());
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
		if (isEmpty(accessToken.value)) {
			const [err, result] = await to(getToken());
			if (isEmpty(result)) {
				return;
			}
			accessToken.value = result;
		}
		const [err, res] = await to(getMaterialList(accessToken.value, data));
		console.log('getMaterialData', res);
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
	// onMounted(() => {
	// 	getToken();
	// });
	return {
		list,
		getWechatList,
		getMaterialData,
		getGroupArtical,
	};
};
