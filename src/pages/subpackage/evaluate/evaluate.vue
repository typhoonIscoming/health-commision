<template>
	<view class="evaluate">
		<view v-if="list.length" class="evaluate-list">
			<view
				class="evaluate-item"
				v-for="(item, index) in list"
				:key="index"
				@click="handleRoute(item)"
			>
				<EvaluateItem :item="item" />
			</view>
		</view>
		<view v-else style="padding-top: 60px">
			<uv-empty
				mode="data"
				text="暂无评价内容"
				textColor="#333333"
			></uv-empty>
		</view>
		<!-- <uv-load-more
			:status="status"
			:loading-text="loadingText"
			:loadmore-text="loadmoreText"
			:nomore-text="nomoreText"
		/> -->
	</view>
</template>
<script setup>
import { ref } from 'vue';
import EvaluateItem from '@/components/EvaluateItem.vue';
import { onPullDownRefresh } from '@dcloudio/uni-app';

const list = ref([{ name: '123', id: 1 }]);
const status = ref('loadmore');
const loadingText = ref('努力加载中');
const loadmoreText = ref('轻轻上拉');
const nomoreText = ref('没有更多了');

const handleRoute = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/questionnaire/questionnaire?id=${item.id}&type=evaluate`,
	});
};

onPullDownRefresh(() => {
	// 模拟下拉刷新
	setTimeout(() => {
		console.log('刷新');
		uni.stopPullDownRefresh();
	}, 2000);
});
</script>
<style lang="scss">
.evaluate {
	&-list {
		padding: 20px;
	}
}
</style>
