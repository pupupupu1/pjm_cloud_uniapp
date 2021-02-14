<template>
	<view>
		<!-- <image @click="addNewCircle" :src="'http://120.26.60.109/static/img/err.dc5810c9.png'"></image> -->
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value, key) in listData" :key="key" @click="goDetail(value)">
				<view class="uni-media-list">
					<image v-if="value.picArray" class="uni-media-list-logo" :src="'http://39.105.78.171:1250' + value.picArray[0]"></image>
					<view class="uni-media-list-body">
						<view style="display: flex;flex-direction:row;">
							<avatar size="80" mode="circle" />
							<view class="uni-media-list-text-top" style="margin-left: 25rpx;">
								<text>{{ value.userAccount }}</text>
								<br />
								<text>{{ value.createTime | formatDate }}</text>
							</view>
						</view>
						<view class="uni-media-list-text-bottom">
							<!-- <text>{{ value.createTime | formatDate }}</text> -->
							<text>{{ value.textContent | strSub }}</text>
							<text>{{ value.likesNum }}人赞了</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore v-show="showLoadMore" :status="status" />
		<dragball :x="50" :y="50" image="../../static/img/black_add.jpg"></dragball>
	</view>
</template>

<script>
import avatar from '../../components/avatar/avatar.vue';
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js';
import dragball from '../../components/drag-ball/drag-ball.vue';
import { mapState, mapMutations } from 'vuex';
export default {
	components: {
		avatar,
		dragball
	},
	computed: {
		...mapState(['userName', 'socketTask', 'friendList'])
	},
	data() {
		return {
			showLoadMore: false,
			listData: [],
			total: 0,
			searchModel: {
				pageNum: 1,
				pageSize: 10,
				textContent: '',
				userAccount: '',
				userAccounts: []
			},
			status: 'loadmore'
		};
	},
	onPullDownRefresh() {
		console.log('refresh');
		this.listData = [];
		this.searchModel.pageNum = 1;
		this.fetchData();
	},
	onReachBottom() {
		console.log(this.total / this.searchModel.pageSize)
		this.showLoadMore = true;
		if (this.total / this.searchModel.pageSize < this.searchModel.pageNum) {
			this.status='nomore'
		}else{
			this.searchModel.pageNum = ++this.searchModel.pageNum;
			this.fetchData();
		}
	},
	methods: {
		fetchData() {
			service.my_circle_of_firend_list(this.searchModel).then(res => {
				console.log(res.data.list);
				if (res.data.list.length == 0) this.status = 'nomore';
				else {
					this.total=res.data.total
					this.status = 'loading';
					res.data.list.forEach(item => {
						console.log(item);
						if (item.picPath) {
							item.picArray = item.picPath.split(';');
						}
					});
					this.listData = this.listData.concat(res.data.list);

					this.showLoadMore = false;
				}
				uni.stopPullDownRefresh();
				console.log(this.listData);
			});
		},
		goDetail(data) {
			console.log(data.id);
			commonUtil.navigateTo('../circle_of_firend/detail_circle_of_friend?id=' + data.id);
		},
		addNewCircle() {
			//添加新朋友圈
			commonUtil.navigateTo('../circle_of_firend/addCircleOfFriend');
		}
	},
	onLoad() {
		var routes = getCurrentPages();
		var params = routes[routes.length - 1].options;
		if (params.userAccount) {
			if (params.userAccount != this.userName) {
				uni.setNavigationBarTitle({
					title: params.userAccount + 'の日常'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '我の日常'
				});
			}
			this.searchModel.userAccount = params.userAccount;
		} else {
			uni.setNavigationBarTitle({
				title: '大家の日常'
			});
			let friendAccountArray = [];
			this.friendList.forEach(friend => {
				friendAccountArray.push(friend.user.userAccount);
			});
			friendAccountArray.push(this.userName);
			this.searchModel.userAccount = '';
			this.searchModel.userAccounts = friendAccountArray;
		}
		this.fetchData();
	}
};
</script>

<style>
.banner {
	height: 360upx;
	overflow: hidden;
	position: relative;
	background-color: #ccc;
}

.banner-img {
	width: 100%;
}

.banner-title {
	max-height: 84upx;
	overflow: hidden;
	position: absolute;
	left: 30upx;
	bottom: 30upx;
	width: 90%;
	font-size: 32upx;
	font-weight: 400;
	line-height: 42upx;
	color: white;
	z-index: 11;
}

.uni-list {
	background-color: #ffffff;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
}

.uni-list:after {
	position: absolute;
	z-index: 10;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.uni-list::before {
	position: absolute;
	z-index: 10;
	right: 0;
	top: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.uni-list-cell {
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

.uni-list-cell-hover {
	background-color: #eee;
}

.uni-list-cell::after {
	position: absolute;
	z-index: 3;
	right: 0;
	bottom: 0;
	left: 30upx;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	background-color: #c8c7cc;
}

.uni-list .uni-list-cell:last-child::after {
	height: 0upx;
}

/* 图文列表 */
.uni-media-list {
	padding: 22upx 30upx;
	box-sizing: border-box;
	display: flex;
	width: 100%;
	flex-direction: row;
}

.uni-navigate-right.uni-media-list {
	padding-right: 74upx;
}

.uni-pull-right {
	flex-direction: row-reverse;
}

.uni-pull-right > .uni-media-list-logo {
	margin-right: 0upx;
	margin-left: 20upx;
}

.uni-media-list-logo image {
	height: 100%;
	width: 100%;
}

.uni-media-list-text-bottom {
	width: 100%;
	line-height: 30upx;
	font-size: 26upx;
	color: #8f8f94;
}

.uni-media-list-logo {
	width: 180upx;
	height: 140upx;
	margin-right: 20upx;
}

.uni-media-list-body {
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	overflow: hidden;
	height: auto;
}

.uni-media-list-text-top {
	width: 100%;
	line-height: 36upx;
	font-size: 30upx;
	height: 74upx;
	font-size: 28upx;
	overflow: hidden;
}

.uni-media-list-text-bottom {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
</style>
