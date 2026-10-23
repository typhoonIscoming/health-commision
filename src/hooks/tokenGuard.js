import { checkUserAuth, fastLogin } from '@/api';
import { isEmpty, to, userInfo as USER_INFO_KEY } from '@/utils';
import useLoginStore from '@/store/login';

// 检测间隔：20 分钟
const CHECK_INTERVAL = 20 * 60 * 1000;

let timer = null;
let isHandlingInvalidToken = false;

// 清空本地登录相关数据
const clearLocalUserData = () => {
	uni.removeStorageSync('b2cAuth');
	uni.removeStorageSync('b2cToken');
	uni.removeStorageSync('b2cUserInfo');
	uni.removeStorageSync('b2cOpenid');
	uni.removeStorageSync('b2cWechatCode');
	uni.removeStorageSync(USER_INFO_KEY);
	useLoginStore().clearLogin();
};

// 弹窗提示用户重新登录
const promptRelogin = () => {
	if (isHandlingInvalidToken) {
		return;
	}
	isHandlingInvalidToken = true;
	stopTokenGuard();
	clearLocalUserData();
	uni.showModal({
		title: '提示',
		content: '登录状态已失效，请重新登录',
		showCancel: false,
		confirmText: '去登录',
		success: () => {
			uni.reLaunch({
				url: '/pages/subpackage/login/login',
			});
		},
	});
};

// 向后台请求人员的token，判断是否失效
const checkToken = async () => {
	const openid = uni.getStorageSync('b2cOpenid');
	const tokenInfo = uni.getStorageSync('b2cToken');
	const token = tokenInfo?.token;
	// 本地没有登录态时无需请求
	if (isEmpty(openid) || isEmpty(token)) {
		return;
	}
	const [err, res] = await to(fastLogin({ login_type: 'token', token }));
	// 请求失败，或者返回数据里没有token，视为登录态已失效
	if (!isEmpty(err) || isEmpty(res) || isEmpty(res.token)) {
		promptRelogin();
	}
	// 如果请求成功且返回了token，说明登录态仍然有效，更新本地token的过期时间
	if (!isEmpty(res) && !isEmpty(res.token)) {
		const expires = +new Date() + 2 * 60 * 60 * 1000; // 设置2小时过期
		uni.setStorageSync('b2cToken', { expires, token: res.token });
	}
};

// 启动定时器，周期性获取人员的token
export const startTokenGuard = () => {
	if (timer) {
		return;
	}
	isHandlingInvalidToken = false;
	checkToken();
	timer = setInterval(checkToken, CHECK_INTERVAL);
};

// 停止定时器
export const stopTokenGuard = () => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
};
