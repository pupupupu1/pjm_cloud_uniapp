<template>
	<view class="content" v-bind:style="{ top: positionTop + 'px' }">
		
		<view class="cul-wrapper" style="position: relative" v-bind:style="{ 'margin-bottom': '120rpx' }">
			<block v-for="(item, index) in msgs" :key="index">
				<view :class="item.isme ? 'msg-me' : 'msg-service'" :id="'msg-' + index">
					<view class="msg-text">
						<u-row class="msg-row">
							<u-col v-if="!item.isme" span="2"><avatar size="80" mode="square" /></u-col>
							<u-col :span="item.isme ? '20' : '8'" class="msg-col">
								<view v-show="!item.isme && item.type == 'text'">
									<view v-if="action == 2">
										<text style="font-size:20rpx;position:relative; top: 30rpx;color: #8F8F94;margin-left: 30rpx;">{{ optionName }}</text>
									</view>
									<view v-else>
										<text style="font-size:20rpx;position:relative; top: 30rpx;color: #8F8F94;margin-left: 30rpx;">{{ item.sourceName }}</text>
									</view>
								</view>
								<view v-show="!item.isme && item.type == 'img'">
									<view v-if="action == 2">
										<text style="font-size:20rpx;position:relative; top: 90rpx;color: #8F8F94;margin-left: 30rpx;">{{ optionName }}</text>
									</view>
									<view v-else>
										<text style="font-size:20rpx;position:relative; top: 90rpx;color: #8F8F94;margin-left: 30rpx;">{{ item.sourceName }}</text>
									</view>
								</view>
								<!-- <view v-if="item.type =='text'" class="msg-text-content"><u-parse :html="item.msg"></u-parse></view>
								<view v-else-if="item.type == 'img'" class="msg-image-content"><image style="width: 250rpx;height: 250rpx;" :src="item.msg"></image></view> -->
							</u-col>
						</u-row>
					</view>
				</view>
			</block>
		</view>
		<view class="operation" :class="{ conversion: !conversion }" v-bind:style="{ bottom: inputPosition + 'rpx' }">
			<!-- <view style="width: 50rpx;height: 50rpx;background-image:url(../../static/img/麦.png);" :src="require('../../static/img/麦.png')"></view> -->
			<image style="width: 50rpx;height: 50rpx;" src="@/static/img/makPhone.png" @click="textInput=!textInput"></image>
			<!-- <img  :src="require('@/static/img/makPhone.png')"/> -->
			<!-- <view v-if="textInput"> -->
				<input v-if="textInput" class="uni-input" type="text" v-model="msgInput.msg1" :class="[true ? 'msg-input1' : 'msg-input2']" @click="sub1(msgInput.msg2)" />
				<!-- <view style="width: 50rpx;height: 50rpx;margin-left: 20rpx;background-image:url(../../static/img/加号.png);" :src="require('../../static/img/加号.png')" @click="openMore"></view> -->
				<image style="width: 50rpx;height: 50rpx;margin-left: 20rpx;" :src="require('@/static/img/add.png')" @click="openMore"></image>
				<input v-if="textInput" type="text" v-model="msgInput.msg2" :class="[true ? 'msg-input2' : 'msg-input1']" @click="sub2(msgInput.msg1)" />
			<!-- </view> -->

		</view>
		<view v-show="moreIsOpen">
			<template>
				<image style="width: 300rpx;height: 180rpx;" :src="require('../../static/img/uploadImg.png')" @click="img"></image>
			</template>
		</view>
	</view>
</template>

<script>
import avatar from '../../components/avatar/avatar.vue';
import commonUtil from '../../util/commonUtil.js';
import { mapState, mapMutations } from 'vuex';
import { pathToBase64, base64ToPath } from '../../js_sdk/gsq-image-tools/image-tools/index.js';
export default {
	computed: {
		...mapState(['userName', 'isOnLine', 'msgList', 'socketTask', 'friendList', 'groupList'])
	},
	created() {
		let that = this;
		let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		//从本地json资源加载自己的所有聊天相关记录
		// console.log(allMsgs)
		let routes = getCurrentPages();
		let params = routes[routes.length - 1].options;
		var friendInfo;
		var groupInfo;
		that.action = params.type;
		that.msgBody.action = that.action;
		console.log(routes);
		// console.log(params.id);
		if (that.action == 2) {
			console.log('一对一聊天');
			console.log(that.friendList);
			//从friendList过滤获取此人姓名
			friendInfo = that.friendList.find(item => item.user.userAccount == params.id);
			console.log(friendInfo);
			uni.setNavigationBarTitle({
				title: friendInfo.user.userName != null ? friendInfo.user.userName : friendInfo.user.userAccount
			});
			this.optionName = friendInfo.user.userName != null ? friendInfo.user.userName : friendInfo.user.userAccount;
			this.msgBody.receiveAccount = friendInfo.user.userAccount;
		} else {
			console.log('群聊天');
			//从groupList过滤获取群聊名称
			groupInfo = that.groupList.find(item => item.id == params.id);
			uni.setNavigationBarTitle({
				title: groupInfo.userGroupName
			});
			this.optionName = groupInfo.userGroupName;
			this.msgBody.receiveAccount = groupInfo.id;
		}

		//开启socket监听
		that.socketTask.onMessage(res => {
			console.log('收到了一条消息！');
			let data = JSON.parse(res.data);
			console.log(that.optionName);
			// console.log(data);
			if (data.action == 2) {
				if (friendInfo.user.userAccount == data.sourceAccount) {
					console.log(data.sourceAccount + '发来了新消息');
					that.msgs.push({
						isme: false,
						msg: data.msgBody,
						type:data.header.type
					});
					that.jumpScroll();
				}
			} else if (data.action == 3) {
				if (that.userName != data.sourceAccount) {
					that.msgs.push({
						isme: false,
						msg: data.msgBody,
						sourceName: data.sourceAccount,
						type:data.header.type
					});
				}
				that.jumpScroll();
			}
		});
		//将此次会话缓存进vuex
		this.setTalkSession(userInfo.userName + '_talkSession_' + this.optionName);
		//将这条msglist消息待阅读数目改为0
		if (that.msgList == null || that.msgList == '') {
			that.msgList = [];
		}
		that.msgList.forEach(item => {
			if (item.optionId == this.optionName) {
				item.waitReadMsgNum = 0;
			}
		});
		console.log(that.msgList);
		that.setMsgList(that.msgList);
		//加载缓存中的消息记录
		uni.getStorage({
			key: userInfo.userName + '_allMsg_' + params.id
		}).then(resdata => {
			// console.log(resdata);
			resdata = resdata.filter(item => {
				return item != null;
			});
			if (resdata[0].data == '') {
				resdata[0].data = '[]';
			}
			resdata = JSON.parse(resdata[0].data);
			console.log(resdata);
			if (that.action == 2) {
				resdata.forEach(item => {
					if (item.type == 'text') {
						item.msgBody = '<p>' + that.subStrMsg(item.msgBody, 25) + '</p>';
					}
					// console.log(item.msgBody);
					if (item.sourceAccount == userInfo.userName) {
						that.msgs.push({
							isme: true,
							msg: item.msgBody,
							type:item.header.type
						});
					} else {
						that.msgs.push({
							isme: false,
							msg: item.msgBody,
							type:item.header.type
						});
					}
				});
			} else {
				resdata.forEach(item => {
					if (item.type == 'text') {
						item.msgBody = '<p>' + that.subStrMsg(item.msgBody, 25) + '</p>';
					}
					// console.log(item.msgBody);
					if (item.sourceAccount == userInfo.userName) {
						that.msgs.push({
							isme: true,
							msg: item.msgBody,
							type:item.header.type
						});
					} else {
						that.msgs.push({
							isme: false,
							msg: item.msgBody,
							sourceName: item.sourceAccount,
							type:item.header.type
						});
					}
				});
			}
			console.log(that.msgs);
		});
		//延迟50毫秒执行，太快有bug
		setTimeout(() => {
			uni.pageScrollTo({ scrollTop: 99999, duration: 0 });
		}, 50);
	},
	data() {
		return {
			textInput:true,
			imgData: '',
			inputPosition: 0,
			positionTop: 0,
			action: 2,
			indexRegion: '',
			listPage: 0,
			isOver: false,
			curDate: '1588061853944',
			//控制按钮和文本框样式和功能的转换
			conversion: true,
			msgInput: {
				msg1: '',
				msg2: ''
			},
			moreIsOpen: false,
			msgBody: {
				header: {
					length: 10000,
					isImg: false,
					isText: false,
					isVoice: false
				},
				sourceAccount: '',
				receiveAccount: '',
				action: 2,
				time: 0,
				msgBody: ''
			},
			//消息列表
			msgs: [],
			hisMsgs: [],
			optionName: ''
		};
	},
	onReady() {
		this.initPosition();
	},
	onLoad(e) {
		this.indexRegion = uni.getStorageSync('indexReg');
	},
	onBackPress() {
		console.log('移除talkSession');
		this.removeTalkSession(this.userName + '_talkSession_' + this.optionName);
	},
	components: {
		avatar: avatar
	},
	methods: {
		...mapMutations(['login', 'setMsgList', 'setTalkSession', 'removeTalkSession']),
		app_img(num, rem) {
			let that = this;
			let index = rem.tempFiles[num].path.lastIndexOf('.'); //获取图片地址最后一个点的位置
			let img_type = rem.tempFiles[num].path.substring(index + 1, rem.tempFiles[num].path.length); //截取图片类型如png jpg
			let img_yuanshi = rem.tempFiles[num].path.substring(0, index); //截取图片原始路径
			let d2 = new Date().getTime(); //时间戳
			//压缩图片
			plus.zip.compressImage(
				{
					src: rem.tempFiles[num].path, //你要压缩的图片地址
					dst: img_yuanshi + d2 + '.' + img_type, //压缩之后的图片地址(注意压缩之后的路径最好和原生路径的位置一样，不然真机上报code-5)
					quality: 10 //[10-100]
				},
				function(e) {
					console.log('Compress success!', e.target);
					pathToBase64(e.target).then(base64 => {
						console.log(base64.length);
						// that.imgData=base64
						let msg = {
							isImg: true,
							isme: true,
							msg: base64,
							type:'img'
						};
						that.msgBody.msgBody = base64;
						that.msgBody.sourceAccount = that.userName;
						that.msgBody.header.type='img'
						that.socketTask.send({
							data: JSON.stringify(that.msgBody)
						});
						that.msgs.push(msg);
						// this.conversion = !this.conversion;

						setTimeout(() => {
							that.jumpScroll();
						}, 50);
					});
					//利用递归循环来实现多张图片压缩
					if (num == rem.tempFiles.length - 1) {
						return;
					} else {
						that.app_img(num + 1, rem);
					}
					console.log('end', that.materialList);
				},
				function(error) {
					console.log('Compress error!');
					console.log(JSON.stringify(error));
				}
			);
		},
		img() {
			let that = this;
			uni.chooseImage({
				// count:  允许上传的照片数量
				count: 9,
				// sizeType:  original 原图，compressed 压缩图，默认二者都有
				sizeType: 'original',
				success(res) {
					//递归发送图片
					that.app_img(0, res);
				}
			});
		},
		openMore() {
			this.moreIsOpen = !this.moreIsOpen;
			if(this.moreIsOpen){
				this.inputPosition = 180;
			}else{
				this.inputPosition = 0;
			}
			this.jumpScroll();
		},
		initPosition() {
			/**
			 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
			 * 反向使用 top 进行定位，可以避免此问题。
			 */
			this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
		},
		endOver() {
			//设置禁用下拉加载
			const pages = getCurrentPages();
			const page = pages[pages.length - 1];
			const currentWebview = page.$getAppWebview();
			currentWebview.setStyle({
				pullToRefresh: {
					support: false,
					style: plus.os.name === 'Android' ? 'circle' : 'default'
				}
			});
			console.log('没有更多数据了，禁用');
		},
		consultClick(id) {
			// console.log(id);
			this.sub(id);
		},
		//滚动到指定位置
		jumpScroll() {
			this.$nextTick(function() {
				console.log('进入最新一行');
				uni.pageScrollTo({
					scrollTop: 99999,
					duration: 0
				});
			});
		},
		sendMsg(obj) {
			// let anotherMsg = {
			// 	isme: false,
			// 	msg: '<p>a1  sad asd a sda a1 <br/> sad asd a sda a1  sad asd<br/>  a sda a1  sad asd a sda a1<br/>   sad asd a sda a1  sad asd a sda </p>'
			// };
			this.msgs.push(anotherMsg);
			this.jumpScroll();
		},
		sub1(val) {
			console.log('this is sub1 func' + val);
			// console.log(val);
			// val = this.subStrMsg(val, 30);
			// val = '<p>' + val + '</p>';
			if (!this.conversion) {
				this.sub(val);
			}
		},
		subStrMsg(val, length) {
			var realLen = val.length;
			// console.log(realLen);
			var times = 0;
			if (realLen % length == 0) {
				times = realLen / length;
			} else {
				times = realLen / length + 1;
			}
			// console.log(times);
			var valList = [];
			for (var i = 0; i < times - 1; i++) {
				var subStr = val.slice(i * length, (i + 1) * length);
				valList.push(subStr);
			}
			// console.log(valList);
			var str = '';
			valList.forEach(item => {
				str += item + '<br/>';
			});
			return str;
		},
		sub2(val) {
			console.log('this is sub2 func' + val);
			// val = this.subStrMsg(val, 30);
			// val = '<p>' + val + '</p>';
			if (this.conversion) {
				//处理输入的消息，到一定长度添加一条<br/>
				this.sub(val);
			}
		},
		sub(val) {
			// console.log(val);
			let _self = this;
			if (val) {
				//清空输入框中的文字
				this.msgInput.msg1 = '';
				this.msgInput.msg2 = '';
				let msg = {
					isme: true,
					msg: val,
					type: 'text'
				};
				this.msgBody.msgBody = val;
				this.msgBody.header.type='text'
				this.msgBody.sourceAccount = this.userName;
				let msgContent = JSON.stringify(this.msgBody);
				console.log(msgContent);
				this.socketTask.send({
					data: msgContent
				});
				this.msgs.push(msg);
				// this.conversion = !this.conversion;
				this.jumpScroll();
				// this.sendMsg();
			} else {
				this.jumpScroll();
			}
		}
	},
	onPullDownRefresh() {
		let _this = this;
		// console.log('refresh2');
		let msgArr = [
			{
				msg: '问题1',
				id: 'm1',
				mark: 'me',
				isme: true,
				time: '2020-10-1'
			},
			{
				msg: '回复1',
				id: 'l1',
				mark: 'service',
				isme: false,
				time: '2020-10-2'
			},
			{
				msg: '问题2',
				id: 'm2',
				mark: 'me',
				isme: true,
				time: '2020-10-1'
			},
			{
				msg: '回复2',
				id: 'l2',
				mark: 'service',
				isme: false,
				time: '2020-10-2'
			}
		];

		this.hisMsgs.push(...msgArr);
		// console.log('this.hisMsgs1');
		// console.log(this.hisMsgs);
		// setTimeout(function() {
		// 	uni.stopPullDownRefresh();
		// }, 100);
	}
};
</script>

<style>
page {
	background-color: #efefef;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex: 1;
	margin-bottom: 120rpx;
}

.msg-over {
	font-size: 24rpx;
	text-align: center;
	color: #999999;
}

.msg-me,
.msg-service {
	display: flex;
	align-items: flex-start;
	width: 680rpx;
	margin: 30rpx 0;
	box-sizing: border-box;
	overflow: hidden;
}

.msg-me {
	justify-content: flex-end;
}

.msg-service {
	justify-content: flex-start;
}

/* .msg-text {
	width: 560rpx;
} */

.msg-me > .msg-text {
	display: block;
	white-space: pre-line;
	justify-content: flex-end;
}

.msg-text-content {
	line-height: 35rpx;
	display: inline-block;
	box-sizing: border-box;
	padding: 30rpx;
	font-size: 28rpx;
}
.msg-image-content {
	top: 100rpx;
	position: relative;
	line-height: 35rpx;
	margin-left: 20rpx;
	display: inline-block;
	box-sizing: border-box;
	/* padding: 30rpx; */
}
.msg-file-content {
	top: 100rpx;
	position: relative;
	line-height: 35rpx;
	margin-left: 20rpx;
	display: inline-block;
	box-sizing: border-box;
	/* padding: 30rpx; */
}
.msg-me > .msg-text > .msg-row > .msg-col > .msg-text-content {
	margin-left: 70rpx;
	background-color: #2b8fff;
	color: #ffffff;
	font-size: 30rpx;
	border-top-right-radius: 44rpx;
	border-bottom-left-radius: 44rpx;
	border-top-left-radius: 44rpx;
	margin-right: 15rpx;
}

.msg-service > .msg-text > .msg-row > .msg-col > .msg-text-content {
	color: #333333;
	margin-left: 40rpx;
	margin-top: 50rpx;
	background-color: #ffffff;
	/* border: 1rpx solid #d5e0e5; */
	border-bottom-left-radius: 44rpx;
	border-bottom-right-radius: 44rpx;
	border-top-right-radius: 44rpx;
	/* 		margin-right: 70rpx; */
	color: #333333;
}

.operation {
	display: flex;
	position: fixed;
	left: 0;
	bottom: 0;
	align-items: center;
	/* background-color: transparent; */
	background: #efefef;
	padding: 10px 35rpx;
	border-top: 1rpx solid rgba(184, 184, 184, 0.1);
	width: 100vw;
}

.conversion {
	flex-direction: row-reverse;
	justify-content: flex-end;
}

.msg-input1 {
	background: #ffffff;
	height: 40px;
	width: 480rpx;
	border-radius: 10px;
	padding: 0 10rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.1);
}

.msg-input2 {
	display: flex;
	align-items: center;
	width: 140rpx;
	height: 40px;
	background-image: url('data:image/png;base64,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');
	background-repeat: no-repeat;
	background-position: center center;
	background-size: 50rpx 50rpx;
	/*这个颜色是因为组件位置交换的时候，字体会有一瞬间继续留在框内，这里把内容变为透明即可*/
	color: rgba(0, 0, 0, 0);
}
</style>
