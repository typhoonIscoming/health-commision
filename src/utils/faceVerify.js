const faceVerify = (params) => {
	return new Promise((resolve, reject) => {
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.camera']) {
					wx.authorize({
						scope: 'scope.camera',
						success() {
							// 用户已授权，可以进行人脸识别
							wx.startFacialRecognitionVerify({
								// 参数配置
								...params,
								success: resolve,
								fail: reject,
							});
						},
						fail() {
							// 用户未授权，引导用户授权
							wx.showModal({
								title: '提示',
								content: '请授权使用摄像头进行人脸识别',
								success(res) {
									if (res.confirm) {
										wx.openSetting({
											success(settingData) {
												if (
													settingData.authSetting[
														'scope.camera'
													]
												) {
													// 用户授权成功
												}
											},
										});
									}
								},
							});
						},
					});
				} else {
					// 用户已授权，可以进行人脸识别
					wx.startFacialRecognitionVerify({
						// 参数配置
						...params,
						success: resolve,
						fail: reject,
					});
				}
			},
		});
	});
};

export default faceVerify;
