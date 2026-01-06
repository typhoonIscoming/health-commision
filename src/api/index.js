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
		url: `/api/workflow/hooks/${constants.hookAuthCheck}`,
		method: 'GET',
		data,
	});
};
