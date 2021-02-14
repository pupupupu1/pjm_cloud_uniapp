<template>
	<view>
		<u-cell-group>
			<u-cell-item  :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="width: 100rpx;" @click="updateHeader">头像</view>
				<view slot="label" @click="updateHeader"></view>
				<view slot="right-icon" @click="seeHeader"><avatar :src="'http://39.105.78.171:1250' + userDetailedInfo.userHeader" size="160" mode="square"></avatar></view>
				<!-- <view slot="title">头像</view> -->
			</u-cell-item>
			<u-cell-item :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="width: 100rpx;">姓名</view>
				<view slot="right-icon">{{ userDetailedInfo.userName }}</view>
			</u-cell-item>
			<u-cell-item :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="width: 100rpx;">账号</view>
				<view slot="right-icon">{{ userDetailedInfo.userAccount }}</view>
			</u-cell-item>
			<u-cell-item :use-label-slot="true" hover-class="cell-hover-class">
				<view slot="icon" style="width: 100rpx;">电话</view>
				<view slot="right-icon">{{ userDetailedInfo.userTel }}</view>
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js';
import { mapState, mapMutations } from 'vuex';
export default {
	computed: mapState(['userDetailedInfo']),
	data() {
		return {};
	},
	methods: {
		...mapMutations(['setUserDetailedInfo']),
		updateHeader() {
			let that = this;
			uni.chooseImage({
				success: res => {
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						uni.getImageInfo({
							src: res.tempFilePaths[i],
							success: image => {
								console.log(image.width);
								console.log(image.height);
								console.log(image);
								that.userDetailedInfo.userHeader = image.path;
								service.uploadPhoneFile(image.path).then(res => {
									res = res.filter(item => item != null)[0];
									res = JSON.parse(res.data);
									console.log(res);
									if (res.code == 200) {
										that.userDetailedInfo.userHeader = res.data.filePath;
										service.updateMyself({
											userHeader: res.data.filePath
										}).then(res2=>{
											that.userDetailedInfo.userHeader=res2.data.userHeader
											this.setUserDetailedInfo(that.userDetailedInfo)
										});
									}
									console.log(that.userDetailedInfo);
								});
							}
						});
					}
				}
			});
		},
		seeHeader() {
			var imgArr = [];
			imgArr.push('http://39.105.78.171:1250'+this.userDetailedInfo.userHeader);
			//预览图片
			uni.previewImage({
				urls: imgArr,
				current: imgArr[0]
			});
		}
	},
	onLoad() {}
};
</script>

<style>
/**点击反馈**/
.cell-hover-class {
	opacity: 0.5;
}
</style>
