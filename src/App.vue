<template>
	<view class="app-root" :style="fontStyle">
		<slot />
	</view>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import useLoginStore from './store/login';
import useFontSizeStore from './store/fontSize';
import { startTokenGuard, stopTokenGuard } from './hooks/tokenGuard';
export default {
	computed: {
		...mapState(useLoginStore, ['getLoginState']),
		...mapState(useFontSizeStore, ['fontStyle']),
	},
	onLaunch: function () {
		console.log('App Launch');
		const fontStore = useFontSizeStore();
		fontStore.initFromStorage();
		startTokenGuard();
	},
	onShow: function () {
		// #ifdef MP-WEIXIN
		uni.hideTabBar();
		// #endif
		const fontStore = useFontSizeStore();
		fontStore.initFromStorage();
		if (!this.getLoginState) {
			// this.login();
		}
		console.log('App Show');
		startTokenGuard();
	},
	onHide: function () {
		console.log('App Hide');
		stopTokenGuard();
	},
	methods: {
		...mapActions(useLoginStore, ['setLogin']),
		login() {
			wx.login({
				success: (response) => {
					const { code } = response;
					wxLogin({ jsCode: code }).then((res) => {
						const { data } = res;
						this.setLogin(data);
					});
				},
				fail: function (error) {
					console.log('login fail', error);
				},
			});
		},
	},
};
</script>

<style lang="scss">
/*每个页面公共css */
view,
text {
	font-family:
		serif, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Trebuchet MS',
		'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
	font-size: var(--app-font-size-text, 13px);
	box-sizing: border-box;
}
page {
	--app-font-size-title: 15px;
	--app-font-size-subtitle: 14px;
	--app-font-size-text: 13px;
	--app-font-size-tip: 12px;
	--mall4j-safe-area-inset-bottom: 0px;
	--uni-primary-text-color: #58b383; // 主要文字颜色
	background: #fafafa;
}
.uni-tabbar-bottom {
	display: none;
}
.flex {
	display: flex;
}
.flex-col {
	display: flex;
	flex-direction: column;
}
.flex-center {
	display: flex;
	align-items: center;
}
.flex-between {
	display: flex;
	justify-content: space-between;
}
.page-gap {
	margin-left: 16px;
	margin-right: 16px;
}
.card-radius {
	border-radius: 5px;
	overflow: hidden;
}
.align-center {
	align-items: center;
}
.justify-between {
	justify-content: space-between;
}
</style>
