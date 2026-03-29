import { ref } from 'vue';
export default () => {
	const safeInsetBottom = ref(0);
	onBeforeMount(() => {
		const systemInfo = uni.getSystemInfoSync();
		// #ifdef MP-WEIXIN
		safeInsetBottom.value = systemInfo.safeAreaInsets.bottom + 51;
		// #endif
	});
	return {
		safeInsetBottom,
	};
};
