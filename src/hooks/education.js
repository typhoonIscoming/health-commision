import { ref, onMounted } from 'vue';
import { getWechatToken, getWechatArticle } from '@/api';
import { to, isEmpty } from '@/utils';

export default () => {
	const accessToken = ref();
	const list = ref([]);
	// 获取微信token
	const getToken = async () => {
		const [err, res] = await to(getWechatToken());
		const temp =
			'100_6tWYCTL_R85UA59PIWaNnKEd5CQxseqY6mzN9ErMy6-yH89xAPCm04bInhssA1VAy0m8HwSJWwNiKphzbN8taRsNb-n1Jg-aL1F48q5mMO-TPok20FYY_oBy4DQGNSjABALSX';

		accessToken.value = temp;
		console.log('getToken res', res, res);
	};

	// 获取微信公众号文章列表
	const getWechatList = async (data, isfresh) => {
		if (isEmpty(accessToken.value)) {
			await to(getToken());
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
	onMounted(() => {
		getToken();
	});
	return {
		list: list.value,
		getWechatList,
	};
};;
