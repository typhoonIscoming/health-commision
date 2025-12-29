import constants from './constants.js';
// 手机号
export const mobileReg = /^1[3456789]\d{9}$/;

export const getTag = (val) => Object.prototype.toString.call(val).slice(8, -1);

export const trim = (val) => val.replace(/\s/g, '');

export const noop = () => {};

// 价格的格式校验
export const priceReg = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 判断是否为空
export const isEmpty = (value) => {
	if (value === null || value === undefined) return true;
	const type = getTag(value);
	if (type === 'String') {
		const s = trim(value);
		return s.length === 0;
	}
	// 函数
	if (type === 'Function' || type === 'Array') {
		return value.length === 0;
	}
	if (type === 'Object' && value) {
		return Object.keys(value).length === 0;
	}
	if (type === 'Map' || type === 'Set') {
		return value.size === 0;
	}
	if (type === 'Number') {
		return Number.isNaN(value);
	}
	return false;
};

export const nextTick = (wait = 16) =>
	new Promise((resolve) => {
		const timer = setTimeout(() => resolve(timer), wait);
	});

export const userInfo = 'USER_INFO';

export const to = (promise, errorExt) => {
	return promise
		.then((data) => [null, data])
		.catch((err) => {
			if (errorExt) {
				const parsedError = Object.assign({}, err, errorExt);
				return [parsedError, undefined];
			}
			return [err, undefined];
		});
};

export const uuid = (len = 6) => {
	let s = [];
	let hexDigits = 'abcdefghijklmnopqrstuvwxyz';
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	let slider = s.join('');
	return slider.slice(0, len);
};

export const parseTime = (v, format = 'yyyy-MM-dd HH:mm:ss') => {
	if (isEmpty(v)) return v;
	const date = new Date(v);
	if (isNaN(date.getTime())) return v;
	const pad = (n) => (n < 10 ? '0' + n : n);
	const map = {
		yyyy: date.getFullYear(),
		MM: pad(date.getMonth() + 1),
		dd: pad(date.getDate()),
		HH: pad(date.getHours()),
		mm: pad(date.getMinutes()),
		ss: pad(date.getSeconds()),
	};
	let result = format;
	Object.keys(map).forEach((key) => {
		result = result.replace(new RegExp(key, 'g'), map[key]);
	});
	return result;
};

export const checkLogin = {
	checkAuthInfo: (fn = noop) => {
		const pages = getCurrentPages();
		if (uni.getStorageSync('b2cToken')) {
			fn();
			return true;
		}
		// 设置登录后的跳转地址
		checkLogin.setRouteUrlAfterLogin();

		uni.navigateTo({
			url: '/pages/subpackage/login/login',
		});
		return false;
	},
	setRouteUrlAfterLogin: () => {
		const pages = getCurrentPages();
		// 登录后的回跳地址
		if (
			pages[pages.length - 1].route.indexOf('register') === -1 &&
			pages[pages.length - 1].route.indexOf('accountLogin') === -1
		) {
			uni.setStorageSync(
				constants.routeUrlAfterLogin,
				pages[pages.length - 1].$page.fullPath,
			);
		}
	},
};
