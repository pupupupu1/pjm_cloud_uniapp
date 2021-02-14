<template>
	<view>
		<u-cell-group>
			
			<u-cell-item @tap="toCircleOfFriend()" :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
				<view slot="title">朋友圈</view>
			</u-cell-item>
			<u-cell-item @tap="toMyNearby()" :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
				<view slot="title">附近的人</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import commonUtil from '../../util/commonUtil.js';
export default {
	data() {
		return {
			
		};
	},
	computed: {
		...mapState(['userName', 'socketTask', 'friendList'])
	},
	methods: {
		toMyNearby(){
			console.log("跳转到附近的人")
			// commonUtil.navigateTo('../myNearBy/myNearBy')
			// uni.navigateTo({
			// 	url:'../myNearby/myNearby'
			// })
			commonUtil.navigateTo('../myNearby/myNearby')
		},
		sectionChange(index) {
			console.log('当前位置：' + index);
			this.current = index;
		},
		toCircleOfFriend() {
			let friendAccountArray = [];
			this.friendList.forEach(friend => {
				friendAccountArray.push(friend.user.userAccount);
			});
			friendAccountArray.push(this.userName);
			commonUtil.navigateTo('../circle_of_firend/circle_of_firend');
		}
	}
};
</script>

<style></style>
