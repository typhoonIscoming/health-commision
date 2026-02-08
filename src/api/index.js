import request from './request';
import constants from '../utils/constants';

export const fastLogin = (data) => {
	return request({
		url: `/api/workflow/hooks/${constants.hookLogin}`,
		method: 'POST',
		data,
	});
};

// 判断当前用户是否已经认证
export const checkUserAuth = (data) => {
	return request({
		url: `/api/workflow/hooks/${constants.hookNewAuthCheck}`,
		method: 'GET',
		data,
	});
};

// 绑定用户信息
export const bindUserAuth = (data) => {
	return request({
		url: `/api/workflow/hooks/${constants.hookNewAuthBind}`,
		method: 'post',
		data,
	});
};

// 获取验证码
export const getMobileVerifyCode = (data) => {
	return request({
		url: `/api/workflow/hooks/${constants.mobileVerifyCodeKey}`,
		method: 'POST',
		data,
	});
};

// 获取工作表ID
export const getWorksheetInfo = (data) => {
	return request({
		url: '/api/v2/open/worksheet/getWorksheetInfo',
		method: 'POST',
		data,
	});
};

// 获取工作表详情
export const getWorksheetDetail = (data) => {
	return request({
		url: '/api/v2/open/worksheet/getFilterRows',
		method: 'POST',
		data,
	});
};

// 获取行记录详情
export const getRowDetail = (data) => {
	return request({
		url: '/api/v2/open/worksheet/getRowByIdPost',
		method: 'POST',
		data,
	});
};

// 获取体检报告的下载地址
export const getReportUrl = (data) => {
	return request({
		url: `/api/workflow/hooks/${constants.hookDownloadReport}`,
		method: 'POST',
		data,
	});
};

// 获取关联表
export const getRelationSheet = (data) => {
	return request({
		url: '/api/v2/open/worksheet/getRowRelations',
		method: 'post',
		data,
	});
};

// 预约接口
export const makeAppointment = (data) => {
	return request({
		url: `/api/workflow/hooks2/${constants.hookMakeAppointment}`,
		method: 'post',
		data,
	});
};

// 获取行数据详情
export const getRowById = (data) => {
	return request({
		url: '/api/v2/open/worksheet/getRowById',
		method: 'get',
		data,
	});
};

// 新建行数据
export const addRow = (data) => {
	return request({
		url: '/api/v2/open/worksheet/addRow',
		method: 'post',
		data,
	});
};
// 更新行记录
export const editRow = (data) => {
	return request({
		url: '/api/v2/open/worksheet/editRow',
		method: 'post',
		data,
	});
};

// 获取微信token
export const getWechatToken = () => {
	return request({
		url: `/api/workflow/hooks/${constants.hookGetAccessToken}`,
	});
};
