<template>
	<view>
		<view>
			<u-cell-group v-for="item in applyList" :key="item.user.userAccount">
				<u-cell-item @tap="applyInfo(item.user)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.user.userAccount }}</view>
					</template>
					<view slot="right-icon"><u-button @click="agreeApply(item.user.id)">同意</u-button></view>
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
		...mapMutations(['setFriendList']),
		fetchApplyList() {
			service.applyPeopleList().then(res => {
				if (res && res.code == 200) {
					this.applyList = res.data;
				}
			});
		},
		applyInfo(user) {
			console.log(user);
		},
		agreeApply(id) {
			service.request2AddFriends(id).then(res => {
				this.fetchApplyList();
				service.friendList().then(res1 => {
					this.setFriendList(res1.data.list);
				});
			});
		}
	}
};
</script>

<style></style>
