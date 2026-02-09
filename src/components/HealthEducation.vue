<template>
	<view>
		<view class="education page-gap">
			<TitleRow title="健康宣教">
				<view style="display: flex; align-items: center">
					<text style="color: #4a4a4a" @click="handleMore">
						更多
					</text>
					<uv-icon name="arrow-right" size="15"></uv-icon>
				</view>
			</TitleRow>
			<view class="education-wrap"> </view>
		</view>
	</view>
</template>
<script setup>
import TitleRow from './Title.vue';
import educationHook from '../hooks/education';
import { onMounted } from 'vue';
// import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const { list, getWechatList } = educationHook();

const pageIndex = ref(0);
const pageSize = ref(10);

onMounted(() => {
	getWechatList({ offset: pageIndex.value, count: pageSize.value });
});

const handleMore = () => {
	uni.navigateTo({ url: '/pages/subpackage/education/education' });
};
</script>
<style lang="scss">
.education {
	background: white;
	padding: 30rpx 0;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	border-radius: 20rpx;
}
</style>
