import { getWorksheetInfo, getWorksheetDetail, fastLogin } from '@/api';
import {
	isEmpty,
	to,
	userInfo as USER_INFO_KEY,
	retryWithDelay,
} from '@/utils';
import useLoginStore from '@/store/login';
import constants from '@/utils/constants';

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

const getUserInfo = async () => {
	const data = {
		appKey: constants.appKey,
		sign: constants.sign,
		worksheetId: 'rywh',
	};
	const [err, res] = await to(getWorksheetInfo(data));
	if (!isEmpty(err)) {
		// 配置retryWithDelay方法，让方法重试
		throw Error('429');
	}
	const view = res.data.views.find((item) => item.name === '人员列表');
	const control = res.data.controls.find((item) => item.alias === 'sfzh');
	const userInfo = uni.getStorageSync('b2cAuth');
	// console.log('userinfo ', userInfo);
	if (isEmpty(userInfo)) {
		return;
	}
	const params = {
		appKey: constants.appKey,
		sign: constants.sign,
		worksheetId: 'rywh',
		viewId: view.viewId,
		pageSize: 20,
		pageIndex: 1,
		listType: 1,
		filters: [
			{
				controlId: control.controlId,
				values: [userInfo.car_id],
				filterType: 2,
				dataType: 2,
				spliceType: 1,
			},
		],
	};
	// 获取人员详细信息
	const [e, response] = await to(getWorksheetDetail(params));
	if (!isEmpty(e)) {
		throw Error('429');
	}
	if (isEmpty(response.data.rows)) {
		return;
	}
	// console.log('get user info', response);
	// 如果人员状态为非正常，就提示重新登录
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
	const [err, res] = await to(getUserInfo());
	// console.log('check token result', err, res);
	// 请求失败，或者返回数据里没有token，视为登录态已失效
	if (!isEmpty(res) && isEmpty(res.jlzt) && res.jlzt !== '正常') {
		promptRelogin();
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
