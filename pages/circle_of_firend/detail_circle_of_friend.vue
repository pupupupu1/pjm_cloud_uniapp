<template>
	<view style="margin-left: 10rpx;">
		<view><br /></view>
		<view style="height: 80rpx;">
			<u-row gutter="10">
				<u-col span="2"><avatar size="80" mode="circle" /></u-col>
				<u-col span="8">
					<view>{{ circle_of_friend_info.userAccount }}</view>
					<view>{{ circle_of_friend_info.createTime | formatDate }}</view>
				</u-col>
			</u-row>
		</view>
		<br />
		<text>{{ circle_of_friend_info.textContent }}</text>
		<br />
		<view class="pic_list">
			<view v-for="(value, key) in circle_of_friend_info.picPathArray"><image :src="'http://39.105.78.171:1250' + value"></image></view>
		</view>
		<view>
			<u-row>
				<u-col style="margin-left: 60rpx;" span="6">{{ circle_of_friend_info.likesNum }}个赞</u-col>
				<u-col span="4">
					<view style="margin-left: 10rpx;" name="icon">
						<u-icon v-if="!alreadyLiked" @click="alreadyLiked = !alreadyLiked" class="circle_icon" size="50" name="thumb-up"></u-icon>
						<u-icon v-else @click="alreadyLiked = !alreadyLiked" class="circle_icon" size="50" name="thumb-up-fill"></u-icon>
						<u-icon @click="commontThisCircle" class="circle_icon" size="50" name="more-circle"></u-icon>
						<u-icon class="circle_icon" size="50" name="zhuanfa"></u-icon>
					</view>
				</u-col>
			</u-row>
		</view>
		<five-mul-commentlist
			:commentList="commentList"
			@clickPraise="clickPraiseComment"
			@clickDelete="clickDeleteComment"
			@clickDeleteChild="clickDeleteCommentChild"
			@clickRecomment="clickRecomment"
			@clickRecommentChild="clickRecommentChild"
		></five-mul-commentlist>
		<five-comment ref="detailComment" @sendComment="sendComment" :placeholder="'填写评论'"></five-comment>
	</view>
</template>

<script>
import avatar from '../../components/avatar/avatar.vue';
import service from '../../service.js';
import date from '../../common/utils/dateUtils.js';
import { mapState, mapMutations } from 'vuex';
export default {
	components: {
		avatar
	},
	data() {
		return {
			id: '',
			circle_of_friend_info: {},
			commentList: [],
			//点击评论上传服务器需要传的参数
			circleCommontParam: {
				replyId: null,
				replyAccount: null,
				circleId: null,
				content: null
			},
			alreadyLiked: false
		};
	},
	computed: {
		...mapState(['userName', 'socketTask', 'friendList'])
	},
	methods: {
		commontThisCircle() {
			this.$refs.detailComment.open();
		},
		detailThis() {
			service.detailCircleOfFriendInfo(this.id).then(res => {
				console.log(res.data);
				this.circle_of_friend_info = res.data;
				if (this.circle_of_friend_info.picPath) {
					this.circle_of_friend_info.picPathArray = this.circle_of_friend_info.picPath.split(';');
				} else {
					this.circle_of_friend_info.picPathArray = [];
				}

				console.log(this.circle_of_friend_info);
				this.commentList = this.circle_of_friend_info.circleOfFriendsComments;
				this.circleCommontParam.circleId = this.id;
			});
		},
		/**
		 * 点赞多级评论
		 * @param {Object} item
		 */
		clickPraiseComment(item) {
			//只能点赞不能取消
			if (item.IS_PRAISE == '1') {
				return;
			}
			item.IS_PRAISE = '1';
			item.PRAISE_NUM++;
		},
		/**
		 * 删除多级评论
		 */
		clickDeleteComment(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除评论吗？',
				confirmColor: '#12B368',
				success: function(res) {
					/* 调用接口删除 */
					console.log(item);
					service.deleteCircleCommont(item.id).then(res => {
						uni.showToast({
							title: '删除成功'
						});
					});
				}
			});
		},
		/**
		 * 删除多级子评论
		 */
		clickDeleteCommentChild(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除评论吗？',
				confirmColor: '#12B368',
				success: function(res) {
					/* 调用接口删除 */
					console.log(item);
					service.deleteCircleCommont(item.id).then(res => {
						uni.showToast({
							title: '删除成功'
						});
					});
				}
			});
		},

		/**
		 * 回复 评论
		 * @param {Object} item
		 */
		clickRecomment(item) {
			console.log(item);
			this.circleCommontParam.replyId = item.id;
			this.circleCommontParam.replyAccount = item.userAccount;
			this.$refs.detailComment.open();
			// this.placeholder = '回复' + item.FIRSTNICKNAME + ':';
		},
		/**
		 * 回复评论的评论
		 * @param {Object} item
		 */
		clickRecommentChild(item) {
			console.log(item);
			this.circleCommontParam.replyId = item.id;
			this.circleCommontParam.replyAccount = item.userAccount;
			this.$refs.detailComment.open();
			// this.placeholder = '回复' + item.FIRSTNICKNAME + ':';
		},
		/**
		 * 删除单级评论
		 */
		clickDeleteSig(item) {
			uni.showModal({
				title: '提示',
				content: '确定要删除评论吗？',
				confirmColor: '#12B368',
				success: function(res) {
					/* 调用接口删除 */
					console.log(item);
				}
			});
		},
		sendComment(data) {
			console.log('填写的评论是：' + data);
			this.circleCommontParam.content = data;
			service.addCircleCommont(this.circleCommontParam).then(res => {
				uni.showToast({
					title: '评论成功'
				});
				let commont = JSON.parse(JSON.stringify(this.circleCommontParam));
				commont.userAccount = this.userName;
				commont.createTime = new Date().getTime();
				commont.deleteEnable = true;
				commont.children = [];
				commont.id = res.data;
				if (commont.replyId == null) {
					this.commentList.push(commont);
					return;
				}
				this.commentList.forEach(item => {
					if (item.id == this.circleCommontParam.replyId) {
						item.children.push(commont);
						console.log(item);
						console.log(commont);
						return;
					}
					item.children.forEach(item2 => {
						if (item2.id == this.circleCommontParam.replyId) {
							item.children.push(commont);

							console.log('找到了');
							console.log(item2);
							console.log(commont);
							return;
						}
					});
				});
				this.circleCommontParam = {
					replyId: null,
					replyAccount: null,
					circleId: this.id,
					content: null
				};
			});
		}
	},
	onLoad() {
		var routes = getCurrentPages();
		var params = routes[routes.length - 1].options;
		this.id = params.id;
		this.detailThis();
	}
};
</script>

<style lang="scss" scoped>
.pic_list {
	display: flex;
	flex-flow: row wrap;
	> view {
		flex: 0 0 240rpx;
		height: 240rpx;
		margin: 7.5rpx 0 0 7.5rpx;
		> image {
			width: 100%;
			height: 100%;
		}
	}
}
.circle_icon {
	margin-left: 30rpx;
}
</style>
