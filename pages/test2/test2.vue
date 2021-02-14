<template>
	<view>
			<video :src="url" style="width: 100vw;height: 400rpx;" :autoplay="true" controls></video>
		</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	export default {
			computed: mapState(['accessToken']),
			data() {
				return {
					url: 'rtmp://39.105.78.171:7777/rtmplive/f9a5ae91a27e4efcb47b960f5705b42e',
					enableCamera: false,
					context: null
				};
			},
			onReady() {
				this.url = this.url + this.accessToken;
				console.log(this.url)
			}
	}
</script> 

<style>
</style>
