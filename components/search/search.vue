<template>
	<view>
		<u-search :focus="false" disabled="true" @click="gotoSearch" placeholder="搜索"  :show-action="false" margin="20rpx 20rpx"></u-search>
	</view>
</template>

<script>
	import commonUtil from '../../util/commonUtil.js'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			gotoSearch(){
				// uni.navigateTo({
				// 	url:'../../pages/search/search'
				// })
				commonUtil.navigateTo('../../pages/search/search')
			}
		}
	}
</script>

<style>

</style>
