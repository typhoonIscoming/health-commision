<template>
	<view class="evaluate">
		<view v-if="loading || evaluteList.length" class="evaluate-list">
			<view
				class="evaluate-item"
				v-for="(item, index) in evaluteList"
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
		<uv-load-more :status="loadStatus" @loadmore="getList()" />
		<!-- <uv-load-more
			:status="status"
			:loading-text="loadingText"
			:loadmore-text="loadmoreText"
			:nomore-text="nomoreText"
		/> -->
	</view>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue';
import EvaluateItem from '@/components/EvaluateItem.vue';
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';
import evaluteHook from '@/hooks/evaluteHook';
import { isEmpty, to } from '@/utils';

const { evaluteList, getData } = evaluteHook();

const loadStatus = ref('');
const pageIndex = ref(1);
const pageSize = ref(10);
const loading = ref(false);

const getList = async (fresh) => {
	if (loading.value || loadStatus.value === 'noMore') {
		return
	}
	const params = {
		pageIndex: pageIndex.value,
		pageSize: pageSize.value,
		refresh: !!fresh,
	}
	loading.value = true;
	loadStatus.value = 'loading';
	const [_, res] = await to(getData(params));
	loading.value = false;
	console.log('evalute res', res)
	if (!isEmpty(_) || isEmpty(res)) {
		return
	}
	const { total } = res;
	if (pageIndex.value * pageSize.value < total) {
		loadStatus.value = 'loadmore'
	} else {
		loadStatus.value = 'noMore';
	}
}

onBeforeMount(() => {
	getList()
})

onReachBottom(() => {
	getList()
})

onPullDownRefresh(async() => {
	// 模拟下拉刷新
	getList(true).then(() => {
		uni.stopPullDownRefresh();
	});
	
});

const handleRoute = (item) => {
	uni.navigateTo({
		url: `/pages/subpackage/questionnaire/questionnaire?id=${item.rowid}&type=detail`,
	});
};
</script>
<style lang="scss">
.evaluate {
	&-list {
		padding: 20px;
	}
}
</style>
