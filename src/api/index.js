import request from './request';

// 登录
export const wxLogin = (data) => {
	return request({
		url: '/api/miniprogram/user/login',
		data,
	});
};

// 上传图片
export const uploadImage = (data) => {
	return request({
		url: '/api/miniprogram/upload/image',
		data,
		method: 'POST',
	});
};

// 获取默认nfcid
export const getDefaultNfcId = () => {
	return request({
		url: '/api/miniprogram/location/default',
	});
};

// 获取首页广告位
export const getAdversive = (nfcId, positionCode) => {
	return request({
		url: `/api/miniprogram/advertisements/nfc/${nfcId}/code/${positionCode}`,
	});
};

// 今日特惠推荐商品
export const todayCoupon = (params) => {
	return request({
		url: '/api/miniprogram/products/location',
		data: params,
	});
};

// 根据nfc获取经纬度信息
export const getLocationInfo = (nfcId) => {
	return request({
		url: `/api/miniprogram/location/${nfcId}`,
	});
};

// 首页--发现好物--饿了么的数据
export const getElemeProducts = (params) => {
	return request({
		url: '/api/miniprogram/shops/search',
		data: params,
	});
};
