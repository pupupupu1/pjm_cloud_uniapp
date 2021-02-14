<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>
		</view>
		<view class="btn-row"><button type="primary" class="primary" @tap="bindLogin">登录</button></view>
		<view class="action-row">
			<navigator url="../reg/reg">注册账号</navigator>
			<text>|</text>
			<navigator url="../pwd/pwd">忘记密码</navigator>
		</view>
		<view class="oauth-row" v-if="hasProvider" v-bind:style="{ top: positionTop + 'px' }">
			<view class="oauth-image" v-for="provider in providerList" :key="provider.value">
				<image :src="provider.image" @tap="oauth(provider.value)"></image>
				<!-- #ifdef MP-WEIXIN -->
				<button v-if="!isDevtools" open-type="getUserInfo" @getuserinfo="getUserInfo"></button>
				<!-- #endif -->
			</view>
		</view>
	</view>
</template>

<script>
import commonUtil from '../../util/commonUtil.js';
import socket from '../../socket/socket.js';
import service from '../../service.js';
import { mapState, mapMutations } from 'vuex';
import mInput from '../../components/m-input.vue';

export default {
	components: {
		mInput
	},
	data() {
		return {
			providerList: [],
			hasProvider: false,
			account: '',
			password: '',
			positionTop: 0,
			isDevtools: false
		};
	},
	computed: mapState(['userName', 'forcedLogin', 'socketTask', 'msgList', 'talkSession', 'friendList', 'groupList']),
	methods: {
		...mapMutations(['login', 'setSocket', 'setMsgList', 'setFriendList', 'setGroupList']),
		initProvider() {
			const filters = ['weixin', 'qq', 'sinaweibo'];
			uni.getProvider({
				service: 'oauth',
				success: res => {
					if (res.provider && res.provider.length) {
						for (let i = 0; i < res.provider.length; i++) {
							if (~filters.indexOf(res.provider[i])) {
								this.providerList.push({
									value: res.provider[i],
									image: '../../static/img/' + res.provider[i] + '.png'
								});
							}
						}
						this.hasProvider = true;
					}
				},
				fail: err => {
					console.error('获取服务供应商失败：' + JSON.stringify(err));
				}
			});
		},
		initPosition() {
			/**
			 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			 * 反向使用 top 进行定位，可以避免此问题。
			 */
			this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
		},
		bindLogin() {
			var that = this;
			const data = {
				userAccount: this.account,
				userPassword: this.password
			};
			const validUser = service.login(data);
			validUser.then(res => {
				console.log('登录成功！');
				console.log(res);
				if (res) {
					//加载好友列表
					service.friendList().then(res1 => {
						that.setFriendList(res1.data.list);
						console.log('成功加载了friendList');
						console.log(that.friendList);
						service.groupList().then(res2 => {
							console.log(res2);
							// that.groupList=res.data.list;
							that.setGroupList(res2.data.list);
							console.log('成功加载了groupList');
							that.toMain({
								userName: this.account,
								token: res.msg
							});
						});
					});
				}
			});
		},
		oauth(value) {
			uni.login({
				provider: value,
				success: res => {
					uni.getUserInfo({
						provider: value,
						success: infoRes => {
							/**
							 * 实际开发中，获取用户信息后，需要将信息上报至服务端。
							 * 服务端可以用 userInfo.openId 作为用户的唯一标识新增或绑定用户信息。
							 */
							this.toMain(infoRes.userInfo.nickName);
						},
						fail() {
							uni.showToast({
								icon: 'none',
								title: '登陆失败'
							});
						}
					});
				},
				fail: err => {
					console.error('授权登录失败：' + JSON.stringify(err));
				}
			});
		},
		getUserInfo({ detail }) {
			if (detail.userInfo) {
				this.toMain(detail.userInfo.nickName);
			} else {
				uni.showToast({
					icon: 'none',
					title: '登陆失败'
				});
			}
		},
		toMain(userInfo) {
			console.log('调用toMain');
			var that = this;
			this.login(userInfo);
			/**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
			{
			}
			var SocketTask;
			{
				if (this.setSocket.CLOSED) {
					return;
				}
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				console.log(userInfo);
				// let baseUrl = 'ws://127.0.0.1:12345/websocket/';
				let baseUrl = 'ws://www.becomeagoodboy.top:12345/websocket/';
				SocketTask = uni.connectSocket({
					url: baseUrl + userInfo.token,
					complete: () => {}
				});
				if (!SocketTask) {
					return;
				}
				this.setSocket(SocketTask);
				// return SocketTask;
				this.socketTask.onOpen(res => {});
				this.socketTask.onClose(res => {});
				this.socketTask.onMessage(res => {
					let data = JSON.parse(res.data);
					if (data.action == '2') {
						
						let optionname = userInfo.userName != data.sourceAccount ? data.sourceAccount : data.receiveAccount;
						console.log('一对一聊天消息to:'+optionname);
						let friendInfo = that.friendList.find(item => item.user.userAccount == optionname);
						if(friendInfo==undefined){
							return;
						}
						console.log(friendInfo);
						console.log('消息会话来自：' + optionname);
						console.log(userInfo.userName + '_allMsg_' + optionname);
						uni.getStorage({
							key: userInfo.userName + '_allMsg_' + optionname
						}).then(resdata => {
							resdata = resdata.filter(item => {
								return item != null && item.data != '';
							});
							console.log(resdata);
							if (resdata.length == 0) {
								resdata.push({
									data: '[]'
								});
							}
							resdata = resdata[0].data;
							resdata = JSON.parse(resdata);
							resdata.push(data);
							console.log(resdata);
							commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
							uni.getStorage({
								key: userInfo.userName + '_msgList'
							}).then(msgListData => {
								msgListData = msgListData.filter(item => {
									return item != null && item.data != '';
								});
								console.log('当前的msglist是');
								console.log(msgListData);
								if (msgListData.length > 0) {
									msgListData = JSON.parse(msgListData[0].data);
									console.log(msgListData);
									var addNewMsg = false;

									var index = msgListData.find(item => item.optionId == optionname);
									if (index == undefined) {
										addNewMsg = true;
									}
									console.log(index);
									console.log(addNewMsg);
									if (!addNewMsg) {
										console.log('不是新消息');
										//将消息置顶
										var index = msgListData.find(item => item.optionId == optionname);
										msgListData = msgListData.filter(item => {
											console.log(item.optionId != optionname);
											return item.optionId != optionname;
										});
										//移除这个元素，push进去，置顶
										//判断是不是我发出的消息，如果是，则已读设置为0
										//后期设置会话状态列表
										if (data.sourceAccount == userInfo.userName || that.talkSession.indexOf(userInfo.userName + '_talkSession_' + data.sourceAccount) != -1) {
											index.waitReadMsgNum = 0;
										} else {
											index.waitReadMsgNum = index.waitReadMsgNum + 1;
										}
										index.optionMsg = data.msgBody;
										index.isGroupMsg = false;
										msgListData.push(index);
										commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
										// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
										console.log(msgListData);
										console.log('持久化msglist进vuex');
										that.setMsgList(msgListData);
									} else {
										console.log('是新消息');
										var data3 = {
											optionId: optionname,
											optionName: friendInfo.user.userName,
											optionMsg: data.msgBody,
											waitReadMsgNum: 1,
											msgTime: data.header.time,
											isGroupMsg: false
										};
										msgListData.push(data3);
										commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
										console.log('持久化msglist进vuex');
										that.setMsgList(msgListData);
										// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
									}
								} else {
									console.log('消息列表长度为0');
									var data3 = {
										optionId: data.sourceAccount,
										optionName: friendInfo.user.userName,
										optionMsg: data.msgBody,
										waitReadMsgNum: 1,
										msgTime: data.header.time,
										isGroupMsg: false
									};
									msgListData.push(data3);
									console.log('持久化msglist进vuex');
									that.setMsgList(msgListData);
									// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
								}
							});
						});
					} else if (data.action == 3) {
						console.log('这是一条群聊消息,optionName只有receiveAccount');
						let optionname = data.receiveAccount;
						console.log('消息会话来自群id：' + optionname);
						uni.getStorage({
							key: userInfo.userName + '_allMsg_' + optionname
						}).then(resdata => {
							resdata = resdata.filter(item => {
								return item != null && item.data != '';
							});
							console.log(resdata);
							if (resdata.length == 0) {
								resdata.push({
									data: '[]'
								});
							}
							resdata = resdata[0].data;
							resdata = JSON.parse(resdata);
							resdata.push(data);
							console.log(resdata);
							commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
							uni.getStorage({
								key: userInfo.userName + '_msgList'
							}).then(msgListData => {
								msgListData = msgListData.filter(item => {
									return item != null && item.data != '';
								});
								console.log('当前的msglist是');
								console.log(msgListData);
								if (msgListData.length > 0) {
									msgListData = JSON.parse(msgListData[0].data);
									console.log(msgListData);
									var addNewMsg = false;
									var index = msgListData.find(item => item.optionId == optionname);
									if (index == undefined) {
										addNewMsg = true;
									}
									console.log(index);
									console.log(addNewMsg);
									let groupInfo = that.groupList.find(item => item.id == optionname);
									if (!addNewMsg) {
										console.log('不是新的消息记录，把这条消息置顶');
										//将消息置顶
										var index = msgListData.find(item => item.optionId == optionname);
										msgListData = msgListData.filter(item => {
											console.log(item.optionId != optionname);
											return item.optionId != optionname;
										});
										//移除这个元素，push进去，置顶
										//判断是不是我发出的消息，如果是，则已读设置为0
										//后期设置会话状态列表
										if (data.sourceAccount == userInfo.userName || that.talkSession.indexOf(userInfo.userName + '_talkSession_' + data.sourceAccount) != -1) {
											index.waitReadMsgNum = 0;
										} else {
											index.waitReadMsgNum = index.waitReadMsgNum + 1;
										}
										index.optionMsg = data.msgBody;
										index.isGroupMsg = true;
										msgListData.push(index);
										commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
										console.log(msgListData);
										console.log('持久化msglist进vuex');
										that.setMsgList(msgListData);
									} else {
										console.log('是新群聊消息');
										var data3 = {
											optionId: optionname,
											optionName: groupInfo.userGroupName,
											optionMsg: data.msgBody,
											waitReadMsgNum: 1,
											msgTime: data.header.time,
											isGroupMsg: true
										};
										msgListData.push(data3);
										commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
										console.log('持久化msglist进vuex');
										that.setMsgList(msgListData);
										// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
									}
								} else {
									console.log('消息列表长度为0');
									var data3 = {
										optionId: optionname,
										optionName: groupInfo.userGroupName,
										optionMsg: data.msgBody,
										waitReadMsgNum: 1,
										msgTime: data.header.time,
										isGroupMsg: true
									};
									msgListData.push(data3);
									console.log('持久化msglist进vuex');
									that.setMsgList(msgListData);
									// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
								}
							});
						});
					}
				});
				this.socketTask.onError(res => {});
			}
			console.log('判断是否是forcedLogin');
			if (this.forcedLogin) {
				console.log('登录');
				uni.reLaunch({
					url: '../main/main'
				});
			} else {
				console.log(this.forcedLogin);
				uni.reLaunch({
					url: '../messageList/messageList'
				});
				// uni.navigateBack();
			}
		}
	},
	onReady() {
		this.initPosition();
		this.initProvider();
		// #ifdef MP-WEIXIN
		this.isDevtools = uni.getSystemInfoSync().platform === 'devtools';
		// #endif
	}
};
</script>

<style>
.action-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.action-row navigator {
	color: #007aff;
	padding: 0 10px;
}

.oauth-row {
	display: flex;
	flex-direction: row;
	justify-content: center;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}

.oauth-image {
	position: relative;
	width: 50px;
	height: 50px;
	border: 1px solid #dddddd;
	border-radius: 50px;
	margin: 0 20px;
	background-color: #ffffff;
}

.oauth-image image {
	width: 30px;
	height: 30px;
	margin: 10px;
}

.oauth-image button {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}
</style>
