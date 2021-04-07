<template>
	<view>
		<view>
			<u-cell-group v-for="item in applyList" :key="item.user.userAccount">
				<u-cell-item @tap="applyInfo(item)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar :src="'http://47.93.112.3:1250'+item.user.userHeader" size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.user.userAccount }}</view>
					</template>
					<view slot="label">申请加入群聊：{{item.userGroupInfo.userGroupName}}</view>
					<view slot="right-icon"><u-button @click="agreeApply(item)">同意</u-button></view>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import service from '../../service.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			applyList: []
		};
	},
	onLoad() {
		this.fetchApplyList();
	},
	methods: {
		...mapMutations(['setGroupList']),
		fetchApplyList() {
			service.applyGroupList().then(res => {
				this.applyList = res.data;
			});
		},
		applyInfo(data) {
			console.log(data);
		},
		agreeApply(data) {
			service.agree2JoinGroup(data.id,data.userGroupMemberId).then(res => {
				this.fetchApplyList();
				service.groupList().then(res1 => {
					this.setGroupList(res1.data.list);
				});
			});
		}
	}
};
</script>

<style></style>
