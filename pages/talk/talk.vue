<template>
	<div>
		<view v-if="sponsor">
			<live-pusher id="livePusher" :url="url" mode="FHD"></live-pusher>
			<video :src="optionUrl" style="width: 100vw;height: 700rpx;" :autoplay="true" controls></video>
		</view>
		<view v-else>
			<live-pusher id="livePusher" :url="optionUrl" mode="FHD"></live-pusher>
			<video :src="url" style="width: 100vw;height: 700rpx;" :autoplay="true" controls></video>
		</view>
		<button @click="close">挂断</button>
		<!-- <button @click="startLive">播放</button> -->
	</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			url: 'rtmp://47.93.112.3:7777/rtmplive/',
			optionUrl: 'rtmp://47.93.112.3:7777/rtmplive/',
			enableCamera: false,
			context: null,
			sponsor: true,
			msgBody: {
				header: {
					length: 10000,
					isImg: false,
					isText: false,
					isVoice: false
				},
				sourceAccount: '',
				receiveAccount: '',
				action: 6,
				time: 0,
				msgBody: ''
			}
		};
	},
	computed: mapState(['accessToken', 'socketTask', 'vedioTalkPool', 'userName']),
	created() {
		//---------------------------------
		console.log("准备加载talkMessage监听")
		this.socketTask.onMessage(res => {
			console.log('收到了一条消息！');
			let data = JSON.parse(res.data);
			let that=this
			// if (data.action == 6) {
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '通话 已经 被结束',
			// 		showCancel: false,
			// 		success: function(res) {
			// 			if (res.confirm) {
			// 				that.setVedioTalkPool([]);
			// 				that.stopLive();
			// 				uni.navigateBack();
			// 			}
			// 		}
			// 	});
				
			// }
		});
		
		//---------------------------------
	},
	onReady() {
		

		var userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		var routes = getCurrentPages();
		var params = routes[routes.length - 1].options;
		params.sponsor == userInfo.userName ? (this.sponsor = true) : (this.sponsor = false);
		this.url = this.url + this.accessToken + '?account=' + userInfo.userName + '&token=' + this.accessToken;
		this.optionUrl = this.optionUrl + 'option' + this.accessToken + '?account=' + userInfo.userName + '&token=' + this.accessToken;
		console.log(this.sponsor);
		console.log(this.url);
		this.context = uni.createLivePusherContext('livePusher', this);
		// this.EnableCamera();
		// this.startLive();
		setTimeout(() => {
			this.startLive();
		}, 500);
		
		
	},
	methods: {
		...mapMutations(['setVedioTalkPool']),
		EnableCamera() {
			this.enableCamera = true;
		},
		startLive() {
			this.context.start({
				success: a => {
					console.log('livePusher.start:' + JSON.stringify(a));
				}
			});
		},
		stopLive() {
			this.context.stop({
				success: a => {
					console.log(JSON.stringify(a));
				}
			});
		},
		close() {
			console.log(this.vedioTalkPool)
			this.msgBody.receiveAccount = this.vedioTalkPool[0];
			this.msgBody.sourceAccount=this.userName
			this.socketTask.send({
				data: JSON.stringify(this.msgBody)
			});
			this.setVedioTalkPool([]);
			this.stopLive();
			uni.navigateBack();
		}
	}
};
</script>
<style></style>
