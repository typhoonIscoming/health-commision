import useLoginStore from '@/store/login.js';
import { isEmpty } from '@/utils';

const http = /^(http[s]?)/;

// const BASE_URL = 'http://192.168.3.182:9080';
const BASE_URL = 'https://www.2g2b.cn';

export default function request(options) {
	const {
		url,
		data = {},
		method = 'GET',
		header = {},
		showLoading,
		loadingText,
		timeout = 10000,
	} = options;
	return new Promise((resolve, reject) => {
		if (showLoading) {
			uni.showLoading({ title: loadingText || '加载中...' });
		}
		const loginState = useLoginStore().getLoginState;
		let initHeader = {
			'content-type': 'application/json', // 默认JSON格式
			...header,
		};
		if (!isEmpty(loginState)) {
			initHeader = {
				...initHeader,
				userid: loginState.userid,
				// 'Authorization': `Bearer ${loginState.accessToken}`,
			};
		}
		const isWexin = uni.getAccountInfoSync;
		wx.request({
			url: isWexin ? (url && http.test(url) ? url : BASE_URL + url) : url,
			data,
			method,
			timeout: timeout,
			header: initHeader,
			success: (res) => {
				if (showLoading) {
					uni.hideLoading();
				}
				if (res.statusCode === 200) {
					if (res.data.code === 401) {
						// 当前token已经失效
						reject(res);
						return;
					}
					resolve(res.data); // 假设后端返回的数据在data字段中
				} else if (res.statusCode === 401) {
					// 当前token已经失效
					reject(res);
				} else {
					reject(res);
				}
			},
			fail: (error) => {
				if (showLoading) {
					uni.hideLoading();
				}
				reject(error); // 请求失败时调用reject
			},
		});
	});
}
