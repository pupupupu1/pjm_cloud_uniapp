<template>
	<view>
		<u-search v-model="searchContent" @search="search" :focus="true" placeholder="搜索" action-text="取消" @custom="cancel" margin="20rpx 20rpx"></u-search>
		<u-subsection mode="button" :list="selectList" :current="current" active-color="#000000" bgColor="#ffffff" buttonColor="#ffffff" @change="sectionChange"></u-subsection>
		<view v-show="current == 0">
			<u-cell-group  v-for="item in userList" :key="item.userAccount">
				<u-cell-item @tap="togoUInfoCard(item.userAccount)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar :src="'http://47.93.112.3:1250'+item.userHeader" size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.userAccount }}</view>
					</template>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view v-show="current == 1">
			<u-cell-group  v-for="item in groupList" :key="item.id">
				<u-cell-item @tap="togoGroupInfoCard(item.id)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar :src="'http://47.93.112.3:1250'+item.userGroupAvatarPath" size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.userGroupName }}</view>
					</template>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js'
export default {
	data() {
		return {
			searchContent: '',
			userList: [],
			groupList: [],
			selectList: [
				{
					name: '人员'
				},
				{
					name: '群聊'
				}
			],
			current: 0
		};
	},
	methods: {
		sectionChange(index) {
			console.log('当前位置：' + index);
			this.current = index;
		},
		togoGroupInfoCard(groupId) {
			console.log(groupId);
			commonUtil.navigateTo('../myInfoCard/groupInfoCard?id='+groupId)
		},
		togoUInfoCard(userAccount) {
			// uni.navigateTo({
			// 	url: '../otherInfoCard/otherInfoCard?userAccount=' + userAccount
			// });
			commonUtil.navigateTo('../otherInfoCard/otherInfoCard?userAccount=' + userAccount)
		},
		cancel() {
			uni.navigateBack();
		},
		search() {
			service.userList(this.searchContent).then(res => {
				if (res.data.length == 0) {
					uni.showToast({
						title: '用户搜索空空如也'
					});
				} else {
					this.userList = res.data;
				}
			});
			service.findGroupList(this.searchContent).then(res => {
				if (res.data.length == 0) {
					uni.showToast({
						title: '群聊搜索空空如也'
					});
				} else {
					this.groupList = res.data;
				}
			});
		}
	}
};
</script>

<style></style>
