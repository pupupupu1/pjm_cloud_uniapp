<template>
	<view style="background-color: #EFEFEF;">
		<u-cell-group>
			<u-cell-item @click="toMyInfo" :use-label-slot="true" hover-class="cell-hover-class">
				<view style="padding: 20rpx;" @click="toMyInfo">
					<u-row gutter="10" show-head="false" show-foot="false" @click="toMyInfo">
						<u-col span="4" @click="toMyInfo">
							<view><avatar :src="'http://39.105.78.171:1250' + groupInfo.userGroupAvatarPath" size="160" mode="square"></avatar></view>
						</u-col>
						<u-col span="6" @click="toMyInfo">
							<view>名称:{{ groupInfo.userGroupName }}</view>
							<view>号码:{{ groupInfo.userGroupNumber }}</view>
						</u-col>
					</u-row>
				</view>
			</u-cell-item>
			<u-cell-item @tap="toBeFriend(groupInfo.id)" v-show="joinType == 0" :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
				<view slot="title">申请入群</view>
			</u-cell-item>
			<u-cell-item @tap="message(groupInfo.id)" v-show="joinType == 1" :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
				<view slot="title">进入聊天</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
import avatar from '../../components/avatar/avatar.vue';
import { mapState, mapMutations } from 'vuex';
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js';
export default {
	components: {
		avatar: avatar
	},
	computed: {
		...mapState(['hasLogin', 'forcedLogin', 'socketTask', 'groupList', 'userDetailedInfo'])
	},
	data() {
		return {
			groupInfo: {},
			joinType: 0
		};
	},
	mounted() {
		var routes = getCurrentPages();
		var params = routes[routes.length - 1].options;
		let id = params.id;
		this.groupInfo = this.groupList.find(item => {
			return item.id == id;
		});
		if (this.groupInfo == undefined) {
			this.joinType = 0;
			service.detailsGroup(id).then(res => {
				this.groupInfo = res.data;
			});
		} else {
			this.joinType = 1;
		}
		//从friendList中对比是否存在这个用户，如果不存在则是陌生人
	},
	methods: {
		...mapMutations(['logout']),
		toMyInfo() {},
		toBeFriend(id) {
			if (id) {
				service.applicationJoinGroup(id).then(res => {
					uni.showToast({
						title: '申请成功，请等待消息'
					});
				});
			} else {
			}
		},
		message(id) {
			uni.navigateTo({
				url: '../message/message?id=' + id + '&type=3'
			});
		}
	}
};
</script>

<style>
/**点击反馈**/
.cell-hover-class {
	opacity: 0.5;
}
</style>
