import Vue from 'vue'
import Vuex from 'vuex'
import commonUtil from '../util/commonUtil.js'
import service from '../service.js'
import {
	pathToBase64,
	base64ToPath
} from '../js_sdk/gsq-image-tools/image-tools/index.js';
import * as sqllite from '../util/sqllite.js'
// import {
// 	mapState,
// 	map_mutations
// } from 'vuex';
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		abnormalConnection: true,
		forcedLogin: false,
		hasLogin: false,
		userName: "",
		userDetailedInfo: {},
		isOnLine: false,
		isOpen: false,
		talkConfirm: false,
		needStopVedioTalk: "0",
		socketTask: null,
		vedioContext: {},
		accessToken: '',
		vedioTalkPool: [],
		token: '',
		msgList: [],
		talkSession: [],
		talkSessionMsg: [],
		friendList: [],
		groupList: []
	},
	mutations: {
		login(state, userInfo) {
			console.log("login方法同步vuex，{}", userInfo)
			state.userName = userInfo.userAccount || '新用户';
			state.userDetailedInfo = userInfo
			state.hasLogin = true;
			state.isOnLine = true;
			state.abnormalConnection = false
			state.token = userInfo.token
			uni.setStorageSync('userInfo', JSON.stringify(state))
		},
		logout(state) {
			state.userName = "";
			state.hasLogin = false;
			state.userDetailedInfo = {}
			state.abnormalConnection = false
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('Authorization')
		},
		setUserDetailedInfo(state, userDetailedInfo) {
			state.userDetailedInfo = userDetailedInfo
			uni.setStorageSync('userInfo', JSON.stringify(state))
		},
		setSocket(state, socketTask) {
			state.socketTask = socketTask
		},
		setMsgList(state, msgList) {
			state.msgList = msgList
			console.log(msgList)
			console.log('msgList持久化进本地' + state.userName + '_msgList')
			uni.setStorageSync(state.userName + '_msgList', JSON.stringify(msgList))
		},
		setTalkSession(state, talkSession) {
			if (state.talkSession.indexOf(talkSession) == -1) {
				state.talkSession.push(talkSession)
			}
		},
		removeTalkSession(state, talkSession) {
			state.talkSession.filter(item => {
				return item == talkSession
			})
		},
		setFriendList(state, friendList) {
			state.friendList = friendList
		},
		setGroupList(state, groupList) {
			state.groupList = groupList
		},
		setTalkAccessToken(state, accessToken) {
			state.accessToken = accessToken
		},
		setTalkConfirm(state, talkConfirm) {
			state.talkConfirm = talkConfirm
		},
		setVedioTalkPool(state, pool) {
			state.vedioTalkPool = pool
		},
		setNeedStopVedioTalk(state, b) {
			state.needStopVedioTalk = b
		},
		dealMsg(state, para) {
			var data = para[0]
			let userInfo = para[1]
			let that = this;
			if (data.action == "0") {
				let type = data.header.type
				if (type == "quartz_loc_update") {
					console.log("服务端请求客户端同步loc地址")
					uni.getLocation({
						type: 'wgs84',
						geocode: true, //设置该参数为true可直接获取经纬度及城市信息
						success: function(res) {
							let msgBody = JSON.parse(JSON.stringify(data))
							res.address = JSON.stringify(res.address)
							msgBody.header = res
							msgBody.header.type = type
							msgBody.header.token = state.token
							console.log("打印当前地址并且同步给服务端")
							console.log(msgBody)
							state.socketTask.send({
								data: JSON.stringify(msgBody)
							})
						},
						fail: function() {
							uni.showToast({
								title: '获取地址失败，将导致部分功能不可用',
								icon: 'none'
							});
						}
					});
				}
			} else if (data.action == '2') {
				let optionname = userInfo.userName != data.sourceAccount ? data.sourceAccount : data.receiveAccount;
				console.log('一对一聊天消息to:' + optionname);
				let friendInfo = state.friendList.find(item => item.user.userAccount == optionname);
				if (friendInfo == undefined) {
					return;
				}
				console.log(friendInfo);
				console.log('消息会话来自：' + optionname);
				console.log(userInfo.userName + '_allMsg_' + optionname);
				//根据这个获取从sqllite获取
				let resdata = uni.getStorageSync(userInfo.userName + '_allMsg_' + optionname);
				// resdata = resdata.filter(item => {
				// 	return item != null && item.data != '';
				// });
				let messageKey = userInfo.userName + '_allMsg_' + optionname
				// console.log(resdata);
				if (resdata.length == 0) {
					resdata = '[]'
				}
				// resdata = resdata[0].data;
				resdata = JSON.parse(resdata);
				//如果data是base64数据，isImg或者isVoice,转为本地链接后丢弃base64数据，持久化成本地文件链接
				console.log(data.header);
				if (data.header.type == 'img') {
					console.log('开始执行base64topath');
					//base64转本地文件
					// console.log(data.msgBody)
					base64ToPath(data.msgBody).then(path => {
						console.log('获取到本地路径：' + path);
						data.header.imgLocalPath = path;
						data.msgBody = path;
						resdata.push(data);
						//持久化的方式修改为insert
						var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
							"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
							"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
						console.log(sql,data)
						sqllite.executeSql(sql)
						// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					});
				} else if (data.header.type == 'voice') {
					// 
					commonUtil.lzFileWriter(data.msgBody, new Date().getTime() + '.mp3').then((res, rej) => {
						console.log('解析mp3结果：' + JSON.stringify(res));
						data.header.voiceLocalPath = res;
						data.msgBody = res;
						resdata.push(data);
						var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
							"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
							"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
						console.log(sql,data)
						sqllite.executeSql(sql)
						// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					});
					// 
					// #ifndef H5
					// base64ToPath(data.msgBody).then(path => {
					// 	console.log('获取到本地路径：' + path);
					// 	data.imgLocalPath = path;
					// 	data.msgBody = path;
					// 	resdata.push(data);
					// 	commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					// });
					// #endif
				} else if (data.header.type == 'file') {
					resdata.push(data);
					var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
						"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
						"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
					console.log(sql,data)
					sqllite.executeSql(sql)
					// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
				} else if (data.header.type == 'text') {
					resdata.push(data);
					var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
						"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
						"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
					console.log(sql,data)
					sqllite.executeSql(sql)
					// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
				}
				
				
				uni.getStorage({
					key: userInfo.userName + '_msgList'
				}).then(msgListData => {
					msgListData = msgListData.filter(item => {
						return item != null && item.data != '';
					});
					// console.log('当前的msglist是');
					// console.log(msgListData);
					if (msgListData.length > 0) {
						msgListData = JSON.parse(msgListData[0].data);
						// console.log(msgListData);
						var addNewMsg = false;

						var index1 = msgListData.find(item => item.optionId == optionname);
						if (index1 == undefined) {
							addNewMsg = true;
						}

						// console.log(addNewMsg);
						if (!addNewMsg) {
							// console.log('不是新消息');
							//将消息置顶
							let index = msgListData.find(item => item.optionId == optionname);

							msgListData = msgListData.filter(item => {
								console.log(item.optionId != optionname);
								return item.optionId != optionname;
							});
							//移除这个元素，push进去，置顶
							//判断是不是我发出的消息，如果是，则已读设置为0
							//后期设置会话状态列表
							if (data.sourceAccount == userInfo.userName || state.talkSession.indexOf(userInfo.userName + '_talkSession_' +
									data.sourceAccount) != -1) {
								index.waitReadMsgNum = 0;
							} else {
								index.waitReadMsgNum = index.waitReadMsgNum + 1;
							}
							index.optionMsg = data.msgBody;
							index.isGroupMsg = false;
							index.type = data.header.type;
							index.msgTime = data.header.msgTime
							let prefix = '<div style="display: flex;align-items: center;word-wrap:break-word;">';
							let suffix = '</div>';
							index.optionMsg = index.optionMsg.slice(prefix.length, -suffix.length);
							console.log(prefix.length);
							console.log(-suffix.length);
							// console.log(index);
							if (index.type == 'img') {
								index.optionMsg = '[图片]';
							}
							if (index.type == 'voice') {
								index.optionMsg = '[语音]';
							}
							msgListData.push(index);
							commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
							// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
							// console.log(msgListData);
							console.log('持久化msglist进vuex');
							store.commit('setMsgList', msgListData)
							// that.setMsgList(msgListData);
						} else {
							console.log('是新消息');
							var data3 = {
								optionId: optionname,
								optionName: friendInfo.user.userName,
								optionMsg: data.msgBody,
								waitReadMsgNum: 1,

								msgTime: data.header.msgTime,
								type: data.header.type,
								isGroupMsg: false
							};
							let prefix = '<div style="display: flex;align-items: center;word-wrap:break-word;">';
							let suffix = '</div>';
							data3.optionMsg = data3.optionMsg.slice(prefix.length, -suffix.length);
							if (data3.type == 'img') {
								data3.optionMsg = '[图片]';
							}
							if (data3.type == 'voice') {
								data3.optionMsg = '[语音]';
							}
							msgListData.push(data3);
							commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
							console.log('持久化msglist进vuex');
							store.commit('setMsgList', msgListData)
							// that.setMsgList(msgListData);
							// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
						}
					} else {
						console.log('消息列表长度为0');
						var data3 = {
							optionId: data.sourceAccount,
							optionName: friendInfo.user.userName,
							optionMsg: data.msgBody,
							waitReadMsgNum: 1,
							msgTime: data.header.msgTime,
							type: data.header.type,
							isGroupMsg: false
						};
						let prefix = '<div style="display: flex;align-items: center;word-wrap:break-word;">';
						let suffix = '</div>';
						data3.optionMsg = data3.optionMsg.slice(prefix.length, -suffix.length);
						console.log(prefix.length);
						console.log(-suffix.length);
						console.log(data3);
						if (data3.type == 'img') {
							data3.optionMsg = '[图片]';
						}
						if (data3.type == 'voice') {
							data3.optionMsg = '[语音]';
						}
						msgListData.push(data3);
						console.log('持久化msglist进vuex');
						store.commit('setMsgList', msgListData)
						// that.setMsgList(msgListData);
						// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
					}
				});
				// uni.getStorage({
				// 	key: userInfo.userName + '_allMsg_' + optionname
				// }).then(resdata => {

				// });
			} else if (data.action == 3) {
				console.log('这是一条群聊消息,optionName只有receiveAccount');
				let optionname = data.receiveAccount;
				console.log('消息会话来自群id：' + optionname);
				let resdata = uni.getStorageSync(userInfo.userName + '_allMsg_' + optionname)
				// resdata = resdata.filter(item => {
				// 	return item != null && item.data != '';
				// });
				// console.log(resdata);
				let messageKey = userInfo.userName + '_allMsg_' + optionname
				if (resdata.length == 0) {
					resdata = '[]'
				}
				// resdata = resdata[0].data;
				resdata = JSON.parse(resdata);
				//如果data是base64数据，isImg或者isVoice,转为本地链接后丢弃base64数据，持久化成本地文件链接
				console.log(data.header);
				if (data.header.type == 'img') {
					console.log('开始执行base64topath');
					//base64转本地文件
					// console.log(data.msgBody)
					base64ToPath(data.msgBody).then(path => {
						console.log('获取到本地路径：' + path);
						data.header.imgLocalPath = path;
						data.msgBody = path;
						resdata.push(data);
						var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
							"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
							"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
						console.log(sql,data)
						sqllite.executeSql(sql)
						// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					});
				} else if (data.header.type == 'voice') {
					// 
					commonUtil.lzFileWriter(data.msgBody, new Date().getTime() + '.mp3').then((res, rej) => {
						console.log('解析mp3结果：' + JSON.stringify(res));
						data.header.voiceLocalPath = res;
						data.msgBody = res;
						resdata.push(data);
						var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
							"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
							"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
						console.log(sql,data)
						sqllite.executeSql(sql)
						// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					});
					// 
					// #ifndef H5
					// base64ToPath(data.msgBody).then(path => {
					// 	console.log('获取到本地路径：' + path);
					// 	data.imgLocalPath = path;
					// 	data.msgBody = path;
					// 	resdata.push(data);
					// 	commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
					// });
					// #endif
				} else if (data.header.type == 'file') {
					resdata.push(data);
					var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
						"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
						"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
					console.log(sql,data)
					sqllite.executeSql(sql)
					// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
				} else if (data.header.type == 'text') {
					resdata.push(data);
					var sql = 'insert into messageList(messageKey,action,header,msgBody,receiveAccount,sourceAccount)' +
						"values('" + messageKey + "','" + data.action + "','" + JSON.stringify(data.header) + "','" + data.msgBody +
						"','" + data.receiveAccount + "','" + data.sourceAccount + "')"
					console.log(sql,data)
					sqllite.executeSql(sql)
					// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
				}
				// resdata.push(data);
				// // console.log(resdata);
				// commonUtil.setItem(userInfo.userName + '_allMsg_' + optionname, JSON.stringify(resdata));
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
						// console.log(index);
						console.log(addNewMsg);
						let groupInfo = state.groupList.find(item => item.id == optionname);
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
							if (data.sourceAccount == userInfo.userName || state.talkSession.indexOf(userInfo.userName + '_talkSession_' +
									data.sourceAccount) != -1) {
								index.waitReadMsgNum = 0;
							} else {
								index.waitReadMsgNum = index.waitReadMsgNum + 1;
							}
							// index.optionMsg = data.msgBody.slic;
							index.msgTime = data.header.msgTime
							let prefix = '<div style="display: flex;align-items: center;word-wrap:break-word;">';
							let suffix = '</div>';
							console.los
							index.optionMsg = index.optionMsg.slice(prefix.length, -suffix.length);
							console.log(prefix.length);
							console.log(-suffix.length);
							// console.log(index);
							if (index.type == 'img') {
								index.optionMsg = '[图片]';
							}
							if (index.type == 'voice') {
								index.optionMsg = '[语音]';
							}
							index.isGroupMsg = true;
							msgListData.push(index);
							commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
							console.log(msgListData);
							console.log('持久化msglist进vuex');
							store.commit('setMsgList', msgListData)
							// that.setMsgList(msgListData);
						} else {
							console.log('是新群聊消息');
							var data3 = {
								optionId: optionname,
								optionName: groupInfo.userGroupName,
								optionMsg: data.msgBody,
								waitReadMsgNum: 1,
								msgTime: data.header.msgTime,
								type: data.header.type,
								isGroupMsg: true
							};
							let prefix = '<div style="display: flex;align-items: center;word-wrap:break-word;">';
							let suffix = '</div>';
							data3.optionMsg = data3.optionMsg.slice(prefix.length, -suffix.length);
							if (data3.type == 'img') {
								data3.optionMsg = '[图片]';
							}
							if (data3.type == 'voice') {
								data3.optionMsg = '[语音]';
							}
							msgListData.push(data3);
							commonUtil.swapItems(msgListData, msgListData.length - 1, 0);
							console.log('持久化msglist进vuex');
							store.commit('setMsgList', msgListData)
							// that.setMsgList(msgListData);
							// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
						}
					} else {
						console.log('消息列表长度为0');
						var data3 = {
							optionId: optionname,
							optionName: groupInfo.userGroupName,
							optionMsg: data.msgBody,
							waitReadMsgNum: 1,
							msgTime: data.header.msgTime,
							type: data.header.type,
							isGroupMsg: true
						};
						if (data3.type == 'img') {
							data3.optionMsg = '[图片]';
						}
						if (data3.type == 'voice') {
							data3.optionMsg = '[语音]';
						}
						msgListData.push(data3);
						console.log('持久化msglist进vuex');
						store.commit('setMsgList', msgListData)
						// that.setMsgList(msgListData);
						// commonUtil.setItem(userInfo.userName+'_msgList', JSON.stringify(msgListData));
					}
				});

				// uni.getStorage({
				// 	key: userInfo.userName + '_allMsg_' + optionname
				// }).then(resdata => {

				// });
			} else if (data.action == 4) {
				let that = this;
				console.log('这是视频通话请求结果' + JSON.stringify(data));
				// uni.showToast({
				// 	title:'请求返回值'+data.header.waitAccess+data.header.talkAccessToken
				// })
				store.commit('setTalkAccessToken', data.header.talkAccessToken)
				// this.setTalkAccessToken(data.header.talkAccessToken);
				// commonUtil.navigateTo('pages/talk/talk')

				if (data.sourceAccount != userInfo.userName) {
					let msgbody = JSON.parse(JSON.stringify(data));
					msgbody.sourceAccount = data.sourceAccount;
					msgbody.receiveAccount = data.receiveAccount;
					msgbody.header.talkAccessToken = state.accessToken;
					msgbody.action = '5';
					// this.setTalkConfirm(true)
					uni.showModal({
						content: '好友来电嘀嘀嘀',
						confirmText: '接听',
						cancelText: '挂断',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定' + userInfo.userName);
								msgbody.header.isAccess = 0;
								state.socketTask.send({
									data: JSON.stringify(msgbody)
								});
								// uni.navigateTo({
								// 	url: '../talk/talk?sponsor=' + data.sourceAccount
								// });
								commonUtil.navigateTo('../talk/talk?sponsor=' + data.sourceAccount)
							} else if (res.cancel) {
								console.log('用户点击取消' + userInfo.userName);
								msgbody.header.isAccess = 1;
								state.socketTask.send({
									data: JSON.stringify(msgbody)
								});
							}
						}
					});
					console.log('接收talkReq结束');
				} else if (data.header.waitAccess == 0) {
					uni.showModal({
						content: '邀请失败,好友不在线，请稍后再拨。',
						confirmText: '确定',
						showCancel: false,
						success: function(res) {

						}
					});
				} else {
					uni.showModal({
						content: '对方在线，已经开启摄像头，准备邀请对方通话',
						confirmText: '确定',
						showCancel: false,
						success: function(res) {
							uni.navigateTo({
								url: '../talk/talk?sponsor=' + data.sourceAccount
							});
						}
					});

				}
			} else if (data.action == 5) {
				if (data.header.isAccess == 1) {
					//对方拒绝通话
					uni.showModal({
						title: '提示',
						content: '对方拒绝通话',
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								uni.navigateBack();
							}
						}
					});
				} else {
					//对方接收了会话，将会话人存入vuex,存入对方的账号
					store.commit('setVedioTalkPool', [data.sourceAccount == userInfo.userName ? data.receiveAccount : data.sourceAccount])
					// this.setVedioTalkPool([data.sourceAccount == userInfo.userName ? data.receiveAccount : data.sourceAccount]);
				}
			} else if (data.action == 6) {
				console.log('这是关闭报文');
				uni.showModal({
					title: '提示',
					content: '通话 已经 被结束',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							store.commit('setVedioTalkPool', [])
							// that.setVedioTalkPool([]);
							console.log(state.needStopVedioTalk);
							store.commit('setNeedStopVedioTalk', '1')
							// that.setNeedStopVedioTalk('1');
							console.log(state.needStopVedioTalk);
							uni.navigateBack();
						}
					}
				});
			}
		},
		connWebsocket(state, userInfo) {
			// let baseUrl = 'ws://localhost:1234/websocket/';
			// let baseUrl = 'ws://172.20.10.2:1234/websocket/'
			// let baseUrl = 'ws://www.becomeagoodboy.top:12345/websocket/';
			let baseUrl = 'ws://47.93.112.3:1234/websocket/';
			let SocketTask = uni.connectSocket({
				url: baseUrl + userInfo.token,
				complete: () => {}
			});
			if (!SocketTask) {
				return;
			}
			state.socketTask = SocketTask
			state.socketTask.onOpen(res => {});
			state.socketTask.onClose(res => {
				console.log('连接已经断开')
				console.log('重新登录')
				if (state.abnormalConnection) {
					store.commit('bindLogin')
				}
				// this.bindLogin()
			});

			state.socketTask.onError(res => {
				console.log('websocket出现异常')
				state.socketTask.close()
			});
			state.socketTask.onMessage(res => {
				let data = JSON.parse(res.data);
				store.commit('dealMsg', [data, userInfo])
				// this.dealMsg(data, userInfo);
			});
		},
		toMain(state, userInfo) {
			console.log('调用toMain');
			var that = this;
			console.log('toMain打印userInfo ：{}', userInfo)
			store.commit('login', userInfo)
			console.log(userInfo)
			// this._mutations.login(userInfo);
			/**
			 * 强制登录时使用reLaunch方式跳转过来
			 * 返回首页也使用reLaunch方式
			 */
			{}
			var SocketTask; {
				// if (this.setSocket.CLOSED) {
				// 	return;
				// }
				let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
				console.log(userInfo);
				service.getOfflineMsgList().then(res => {
					console.error(res.data);
					if (res != undefined) {
						console.log(res.data);
						res.data.forEach(item => {
							console.log(item);
							store.commit('dealMsg', [JSON.parse(item), userInfo])
							// this._mutations.dealMsg(JSON.parse(item), userInfo);
						});
					}
				});
				store.commit('connWebsocket', userInfo)
				// this._mutations.connWebsocket(userInfo)
				// return SocketTask;

			}
			console.log('判断是否是forcedLogin');
			if (state.forcedLogin) {
				console.log('登录');
				uni.reLaunch({
					url: '../main/main'
				});
			} else {
				console.log(state.forcedLogin);
				uni.reLaunch({
					url: '../messageList/messageList'
				});
				// uni.navigateBack();
			}
		},
		bindLogin(state) {
			var that = this;
			const data = {
				userAccount: uni.getStorageSync('userAccount'),
				userPassword: uni.getStorageSync('userPwd')
			};
			const validUser = service.login(data);
			validUser.then(res => {
				console.log('登录成功！');
				console.log(res);
				if (res) {
					//加载好友列表
					console.log('准备加载好友列表')
					service.friendList().then(res1 => {
						state.friendList = res1.data.list
						// that.setFriendList(res1.data.list);
						console.log(state.friendList);
						service.groupList().then(res2 => {
							console.log(res2);
							state.groupList = res2.data.list
							// that.setGroupList(res2.data.list);
							console.log('成功加载了groupList');
							console.log(store)
							res.data.token = res.msg
							store.commit('toMain', res.data)
						});
					});
				}
			});
		},
	}
})


export default
// methods: {
// 	...map_mutations(['bindLogin', 'toMain', 'setNeedStopVedioTalk', 'setVedioTalkPool', 'setTalkConfirm', 'login', 'setSocket',
// 		'setMsgList', 'setFriendList', 'setGroupList', 'setTalkAccessToken'
// 	])
// },
store
