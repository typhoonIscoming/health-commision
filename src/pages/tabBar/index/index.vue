<template>
	<view
		class="home"
		:style="{ width: '100%', paddingBottom: `${paddingBottom}px` }"
	>
		<NavBar title="自治区二次补偿信息服务" :opacity="1" />
		<UserInfoCard @onClick="handleDetail" />
		<view
			v-if="noticeItem"
			style="margin-bottom: 30rpx; position: relative"
		>
			<uv-notice-bar :text="noticeItem.biaoti" @click="handleNotice" />
		</view>
		<HomeHealthRecord type="tj" />
		<NoticeBar v-if="newsRestList.length" :list="newsRestList" />
		<UserCard ref="userCardModel" />
		<view style="margin-top: 20px"></view>
		<Psychological />
		<view style="margin-top: 20px"></view>
		<Satisfaction />
		<view style="margin-top: 20px"></view>
		<Questionnaire />
		<view style="margin-top: 20px" />
		<HomeHealthRecord title="其他服务记录" type="other" />
		<Tabbar />
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import NavBar from '@/components/NavBar.vue';
import HomeHealthRecord from '@/components/HomeHealthRecord';
import Satisfaction from '@/components/Satisfaction';
import Questionnaire from '@/components/Questionnaire.vue';
import Tabbar from '@/components/Tabbar.vue';
import UserCard from '@/components/UserCard.vue';
import NoticeBar from '@/components/NoticeBar.vue';
import Psychological from '@/components/Psychological.vue';
import UserInfoCard from '@/components/UserInfoCard.vue';
import { isEmpty } from '@/utils';
import homeNoticebar from '@/hooks/home-noticebar';

const { noticeList, getList } = homeNoticebar();

const noticeItem = computed(() => {
	if (isEmpty(noticeList.value)) {
		return null;
	}
	return noticeList.value[0];
});
// 获取剩余的新闻列表
const newsRestList = computed(() => {
	if (isEmpty(noticeList.value)) {
		return [];
	}
	return noticeList.value.slice(1);
});

const opacity = ref(0);
const paddingBottom = ref(60);
const userCardModel = ref();

const getNews = () => {
	getList({
		pageIndex: 1,
		pageSize: 5,
	});
};

const handleNotice = (i) => {
	if (isEmpty(noticeItem.value)) {
		return;
	}
	uni.navigateTo({
		url: `/pages/subpackage/newsDetail/newsDetail?id=${noticeItem.value.rowid}`,
	});
};

onMounted(() => {
	getNews();
	const sysInfo = uni.getWindowInfo();
	const { safeAreaInsets } = sysInfo;
	if (isEmpty(safeAreaInsets)) return;
	paddingBottom.value = paddingBottom.value + safeAreaInsets.bottom;
});

onPageScroll((e) => {
	const { scrollTop } = e;
	const result = Math.min(40, scrollTop);
	opacity.value = (result / 40).toFixed(1);
});

const handleDetail = () => {
	userCardModel.value?.open();
};
</script>

<style lang="scss">
.home {
	padding-bottom: 16px;
	.satisfaction-wrapper {
		margin-bottom: 40rpx;
		padding: 20rpx;
		background: white;
		position: relative;
		z-index: 1;
		.content {
			flex: 1;
		}
		.fill-btn {
			color: #2a82e4;
			margin-left: 20rpx;
		}
	}
}
</style>
