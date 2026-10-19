import constants from './constants.js';
import male from '../static/user/avatar-male.png';
import female from '../static/user/avatar-female.png';
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

export const isJSON = (str) => {
	if (typeof str !== 'string') return false;
	try {
		const obj = JSON.parse(str);
		const isObj =
			Object.prototype.toString.call(obj) === '[object Object]' ||
			Array.isArray(obj);
		return isObj ? obj : false;
	} catch (e) {
		return false;
	}
};

export const checkLogin = {
	checkAuthInfo: (fn = noop, autoRoute = true) => {
		const tokenInfo = uni.getStorageSync('b2cToken');
		const auth = uni.getStorageSync('b2cAuth');
		const openid = uni.getStorageSync('b2cOpenid');
		if (tokenInfo && auth) {
			fn(auth, tokenInfo);
			return true;
		}
		// 设置登录后的跳转地址
		checkLogin.setRouteUrlAfterLogin();
		// 如果未登录或登录过期，跳转登录页
		if (
			!openid ||
			!tokenInfo ||
			!tokenInfo.token ||
			(tokenInfo.expires &&
				+new Date() - tokenInfo.expires > 7 * 24 * 3600 * 1000)
		) {
			if (autoRoute) {
				uni.navigateTo({
					url: '/pages/subpackage/login/login',
				});
			}
			return false;
		}
		if (!auth) {
			if (autoRoute) {
				uni.navigateTo({
					url: '/pages/subpackage/userAuth/userAuth',
				});
			}
		}

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

// 带 cancel / flush
export const debounce = (fn, delay = 300) => {
	let timer = null;
	let lastArgs = null;
	let lastThis = null;

	function debounced(...args) {
		lastArgs = args;
		lastThis = this;
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			fn.apply(lastThis, lastArgs);
		}, delay);
	}

	debounced.cancel = () => {
		clearTimeout(timer);
		timer = null;
	};

	debounced.flush = () => {
		if (timer) {
			clearTimeout(timer);
			timer = null;
			fn.apply(lastThis, lastArgs);
		}
	};

	return debounced;
};

// 首次立即执行 + 最后一次也执行
export const throttle = (fn, interval = 300, options = {}) => {
	let timer = null;
	let lastTime = 0;
	const { leading = true, trailing = true } = options;

	return function (...args) {
		const now = Date.now();
		if (!lastTime && !leading) lastTime = now;

		const remaining = interval - (now - lastTime);

		if (remaining <= 0 || remaining > interval) {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			lastTime = now;
			fn.apply(this, args);
		} else if (!timer && trailing) {
			timer = setTimeout(() => {
				lastTime = leading ? Date.now() : 0;
				timer = null;
				fn.apply(this, args);
			}, remaining);
		}
	};
};

// 获取用户信息
export const getUserInfo = () => {
	const auth = uni.getStorageSync('b2cAuth');
	const userInfoStorage = uni.getStorageSync('b2cUserInfo');

	if (!isEmpty(auth)) {
		let avatar = auth.base64 || auth.tx;
		if (auth.base64) {
			// 判断字符串是否是data:image/png;base64开头
			if (!auth.base64.startsWith('data:image')) {
				avatar = `data:image/png;base64,${auth.base64}`;
			}
		}
		const photoInfo =
			!isEmpty(userInfoStorage) && isJSON(userInfoStorage.ryzp)
				? JSON.parse(userInfoStorage.ryzp)
				: '';
		const item = Array.isArray(photoInfo) ? photoInfo[0] : {};
		if (!avatar && !isEmpty(item)) {
			avatar = item.large_thumbnail_full_path || item.thumbnail_full_path;
		}
		if (isEmpty(avatar)) {
			avatar = auth.sex === '男' ? male : female;
		}
		// console.log('avatar', avatar, 'auth', auth);
		return { ...auth, avatar: avatar };
	}
	return null;
};
