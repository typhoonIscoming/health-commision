<template>
	<view class="login-wrapper">
		<!-- #ifdef MP-WEIXIN -->
		<!-- <button
			v-if="!isLogin"
			open-type="getPhoneNumber"
			@getphonenumber="getPhoneNumber"
			class="get-phone-btn"
		>
			<slot></slot>
		</button> -->
		<view v-if="!isLogin" @click.stop="handleLogin"><slot /></view>
		<template v-else>
			<!-- #endif -->
			<view @click.stop="handleClick"><slot /></view>
			<!-- #ifdef MP-WEIXIN -->
		</template>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import useLoginStore from '../store/login';
import { isEmpty, nextTick, userInfo as user } from '@/utils';
import { wxLogin } from '@/api';

export default {
	data() {
		return {};
	},
	computed: {
		...mapState(useLoginStore, ['getLoginState']),
		isLogin() {
			return !isEmpty(this.getLoginState);
		},
	},
	created() {
		if (!this.isLogin) {
			// 如果当前用户没有登录，就去判断本地存储的数据是否存在
			const local = uni.getStorageSync(user);
			// console.log('useLoginStore', local)
			if (local && local.accessToken) {
				// 如果本地存在数据，就去判断本地的数据是否已经失效
				const { expiresTime } = local;
				const now = +new Date();
				if (now >= expiresTime) {
					// 如果当前时间大于失效时间，就清空本地数据
					this.clearLogin();
				} else {
					// 否则就将本地的数据更新到内存中
					this.setLogin(local);
				}
			} else {
				this.clearLogin();
			}
		}
	},
	methods: {
		...mapActions(useLoginStore, ['setLogin', 'clearLogin']),
		getPhoneNumber(e) {
			console.log('methods', e);
			const { detail = {} } = e;
			const { errMsg, code, encryptedData, iv } = detail;
			// if (errMsg === 'getPhoneNumber:ok') {
			// 	this.handleCheckLogin(code);
			// }
		},
		handleCheckLogin(phoneCode) {
			const that = this;
			uni.getUserInfo({
				desc: '您登录注册、签约认证',
				success(res) {
					const { encryptedData, iv, userInfo } = res;
					console.log('getUserProfile', userInfo);
					uni.login({
						success: (response) => {
							const { code } = response;
							const params = {
								phoneCode,
								code,
								encryptedData,
								iv,
							};
							wxLogin(params)
								.then(async (res) => {
									const { avatarUrl } = userInfo;
									const { data } = res;
									// console.log('登录信息', data)
									that.setLogin({ avatarUrl, ...data });
									await nextTick();
									that.$emit('loginClick', {
										encryptedData,
										iv,
										code,
										...data,
									});
								})
								.catch((err) => {
									// console.log('eerr', err)
									uni.showToast({
										title: '登录失败',
										icon: 'error',
									});
								});
						},
						fail: function (error) {
							console.log('login fial', error);
						},
					});
				},
				fail(err) {
					console.log('fiial', err);
				},
			});
		},
		handleClick(e) {
			// console.log('eeeee', this.getLoginState);
			this.$emit('loginClick', e);
		},
		// 不需要用户手机号码的流程
		handleLogin() {
			wx.login({
				success: (response) => {
					const { code } = response;
					console.log('code', code);
					wxLogin({ jsCode: code }).then((res) => {
						const { data } = res;
						this.setLogin(data);
						this.$emit('loginClick', data);
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
.login-wrapper {
	width: 100%;
	.get-phone-btn {
		background-color: transparent;
		color: initial;
		padding: 0;
		line-height: 1;
		border-radius: 0;
		&::after {
			border: none;
		}
	}
}
</style>
