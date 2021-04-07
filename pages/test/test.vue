<template>
	<view>
			<live-pusher id="livePusher" :url="url" mode="FHD"></live-pusher>
			<button @click="startLive">开始推流（开始直播）</button>
			<button @click="stopLive">结束推流</button>
		</view>
</template>

<script>
export default {
	data() {
		return {
			url: 'rtmp://47.93.112.3:7777/rtmplive',
			enableCamera: false,
			context: null
		};
	},
	onLoad() {
		// this.context = uni.createLivePusherContext('livePusher', this);
	},
	methods: {
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
		}
	}
};
</script>

<style>

</style>
