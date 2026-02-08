import { ref, onMounted } from 'vue';
import { getWechatToken } from '@/api';
import { to, isEmpty } from '@/utils';

export default () => {
	const list = ref();
	// 获取微信token
	const getToken = async () => {
		const [err, res] = await to(getWechatToken());
		console.log('getToken res', res, res);
	};
	onMounted(() => {
		getToken();
	});
	return {
		list: list.value,
	};
};
