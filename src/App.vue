<script>
import { mapState, mapActions } from 'pinia';
import useLoginStore from './store/login';
export default {
	computed: {
		...mapState(useLoginStore, ['getLoginState']),
	},
	onLaunch: function () {
		// console.log('App Launch');
	},
	onShow: function () {
		// #ifdef MP-WEIXIN
		uni.hideTabBar();
		// #endif
		// console.log('App Show', this.getLoginState);
		if (!this.getLoginState) {
			// this.login();
		}
	},
	onHide: function () {
		// console.log('App Hide');
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
@import './static/iconfont/iconfont.css';

/*每个页面公共css */
view,
text {
	font-family:
		serif, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, 'Trebuchet MS',
		'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
	font-size: 13px;
	box-sizing: border-box;
}
page {
	background: #fafafa;
}

/* h5低版本浏览兼容 */
page {
	--mall4j-safe-area-inset-bottom: env(safe-area-inset-bottom);
	--uni-primary-text-color: #58b383; // 主要文字颜色
}
/* #ifdef H5 */
page {
	--mall4j-safe-area-inset-bottom: 0px;
}
@supports (bottom: constant(safe-area-inset-bottom)) {
	page {
		--mall4j-safe-area-inset-bottom: constant(safe-area-inset-bottom);
	}
}
@supports (bottom: env(safe-area-inset-bottom)) {
	page {
		--mall4j-safe-area-inset-bottom: env(safe-area-inset-bottom);
	}
}
/* #endif */
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
</style>
