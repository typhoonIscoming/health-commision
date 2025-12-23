import { defineStore } from 'pinia';
import { userInfo as user } from '@/utils';

export default defineStore('login', {
	state: () => ({
		userInfo: null,
	}),
	getters: {
		getLoginState: (state) => state.userInfo,
		getLoginStatus: (state) => !!state.userInfo,
	},
	actions: {
		setLogin(data) {
			const local = { ...(this.userInfo || {}), ...data };
			this.userInfo = local;
			uni.setStorageSync(user, local); // 保存在本地
		},
		clearLogin() {
			this.userInfo = null;
		},
	},
});
