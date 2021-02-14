<template>
	<view>
		<l-file ref="lFile" @up-success="onSuccess"></l-file>
		<view class="padding text-center">
			<view class="padding">
				<button @tap="onOpenDoc">预览</button>
			</view>
			<view class="padding">
				<button @tap="onDown">下载到本地</button>
				<view class="text-center padding-sm">{{localPath}}</view>
			</view>
			<view class="padding">
				<button @tap="onUpload">上传</button>
			</view>
			<view class="padding" style="font-size: 26rpx;text-align: center;">
				<text decode>{{tip}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import lFile from '@/components/l-file/l-file.vue'
	export default {
		components:{lFile},
		data() {
			return {
				localPath: '',
				tip: `
					纯粹是看大家对选择文件多端上传需求比较大\n
					又得不到好的解决\n
					所以只好自己写了一个不需要集成原生插件的上传顺便分享给大家\n
					这里只做了“微信端、android、ios”的上传\n
					h5及其他端自己改改(因为APP使用了plus)\n
					希望能帮到你\n
					不喜勿喷，不要期待更新，我很懒\n
					`,
			}
		},
		methods: {
			onOpenDoc() {
				// let url = 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg';
				// /* 下载返回临时路径（退出应用失效） */
				// this.$refs.lFile.download(url)
				// .then(path=>{
				// 	/* 预览 */
				// 	this.$refs.lFile.open(path);
				// });
				
				this.$refs.lFile.open('file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/apps/HBuilder/www/hybrid/html/callback?fileName=43a420ee0bf9aaa6580734d13fa69476.mp4')
			},
			
			/* 保存 */
			onDown() {
				let url = 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2534506313,1688529724&fm=26&gp=0.jpg';
				this.$refs.lFile.download(url,'local')
				.then(path=>{
					this.localPath = path;
				}); 
			},
			
			/* 上传 */
			onUpload() { 
				this.$refs.lFile.upload({
					// #ifdef APP-PLUS
					// nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
					currentWebview: this.$mp.page.$getAppWebview(),
					// #endif
					//非真实地址，记得更换,调试时ios有跨域，需要后端开启跨域并且接口地址不要使用http://localhost/
					url: 'http://47.94.233.146:1220/pjm-service-nacos/file/uploadFile4FileInfo',
					//默认file,上传文件的key
					name: 'file',
					header: {
						// 'content-type': 'multipart/form-data'
						Authorization:uni.getStorageSync("Authorization")
					}
					//...其他参数
				});
			},
			onSuccess(res) {
				console.log('上传成功回调',JSON.stringify(res));
				uni.showToast({
					title: JSON.stringify(res),
					icon: 'none'
				})
			}
		}
	}
</script>

<style>
.padding-sm {
	padding: 20upx;
}

.padding {
	padding: 30upx;
}
</style>
