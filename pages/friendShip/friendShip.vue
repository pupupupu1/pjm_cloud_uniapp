<template>
	<view>
		<u-navbar :is-back="false" title="通讯录" title-bold="true" title-size="40" title-color="#FFFFFF" :background="{ backgroundColor: '#0FAEFF' }">
			<template slot="right">
				<u-icon name="plus" @click="addGroup" style="margin-right: 20rpx;" color="white" size="45"></u-icon>
			</template>
		</u-navbar>
		<view><search /></view>

		<u-cell-group>
			<u-cell-item @tap="toPeopleApplyList" :use-label-slot="true" hover-class="cell-hover-class"><view slot="title">新朋友</view></u-cell-item>
			<u-cell-item @tap="toGroupApplyList" :use-label-slot="true" hover-class="cell-hover-class"><view slot="title">群通知</view></u-cell-item>
		</u-cell-group>

		<u-subsection mode="button" :list="list" :current="current" active-color="#000000" bgColor="#ffffff" buttonColor="#ffffff" @change="sectionChange"></u-subsection>
		<view v-show="current == 0">
			<u-cell-group v-for="item in friendList" :key="item.user.userAccount">
				<u-cell-item @tap="cellClick(item.user.userAccount, 2)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.user.userAccount }}</view>
					</template>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view v-show="current == 1">
			<u-cell-group v-for="item in groupList" :key="item.id">
				<u-cell-item @tap="cellClick(item.id, 3)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.userGroupName }}</view>
					</template>
				</u-cell-item>
			</u-cell-group>
		</view>
		<!-- <u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" /> -->
	</view>
</template>

<script>
import common from '../../util/commonUtil.js';
import api from '../../service.js';
import { mapState, mapMutations } from 'vuex';
export default {
	computed: {
		...mapState(['userName', 'friendList', 'groupList'])
	},
	created() {
		// if (!this.fetchData()) {
		// 	this.status = 'nomore';
		// }
	},
	// onReachBottom() {
	// 	this.status = 'loading';
	// 	if (!this.fetchData()) {
	// 		this.status = 'nomore';
	// 	} else {
	// 		this.status = 'loadMore';
	// 	}
	// 	this.pageNum = this.pageNum + 1;
	// },
	data() {
		return {
			status: 'loadmore',
			iconType: 'flower',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			list: [
				{
					name: '好友'
				},
				{
					name: '群聊'
				}
			],
			pageNum: 0,
			subFriendList: [],
			//交给vuex
			// friendList: [],
			// groupList: [],
			current: 0
		};
	},
	methods: {
		...mapMutations(['setFriendList', 'setGroupList']),
		sectionChange(index) {
			console.log('当前位置：' + index);
			this.current = index;
		},
		addGroup(){
			//跳转到新建群组页面
			console.log("跳转到新建群组页面")
			common.navigateTo('../group/addGroup')
		},
		fetchData() {
			if ((this.pageNum + 1) * 10 > this.friendList.length) {
				let that = this;
				let list = this.friendList.slice(this.pageNum * 10, this.friendList.length);
				list.forEach(item => {
					this.subFriendList.push(item);
				});
				return true;
			}
			return false;
		},
		cellClick(optionId, type) {
			if (type == 2) {
				// uni.navigateTo({
				// 	// url: '../message/message?id=' + optionId+"&type="+type
				// 	url: '../otherInfoCard/otherInfoCard?userAccount=' + optionId
					
				// });
				common.navigateTo('../otherInfoCard/otherInfoCard?userAccount=' + optionId)
			} else if (type == 3) {
				// uni.navigateTo({
				// 	url: '../message/message?id=' + optionId + '&type=' + type
				// });
				common.navigateTo('../message/message?id=' + optionId + '&type=' + type)
			}
		},
		toPeopleApplyList() {
			// alert("???")
			// uni.navigateTo({
			// 	url: '../applyPeopleList/applyPeopleList'
			// });
			common.navigateTo('../applyPeopleList/applyPeopleList');
		},
		toGroupApplyList() {}
	}
};
</script>

<style>
/**点击反馈**/
.cell-hover-class {
	opacity: 0.5;
}
</style>
