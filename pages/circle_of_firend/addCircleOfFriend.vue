<template>
	<!-- 组件必须设置高度，否则内部容器填充不起来 -->
	<view class="album-content">
		<r-album ref="rAlbum" v-model="list" @sort="onAlbumSort" @click="onAlbumClick" @add="onAlbumAdd" @delete="onAlbumDelete">
			<template v-slot:before>
				<view class="paddingLR30 paddingT20"><u-input v-model="text" :type="'textarea'" :focus="false" :maxlength="60" :placeholder="'发表新动态...'" /></view>
			</template>
			<template v-slot:after>
				<view class="paddingLR30 paddingB20"><u-button @click="publishCircle">发布</u-button></view>
			</template>
		</r-album>
	</view>
</template>

<script>
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			// id是DB主键，如果id重复会造成在拖拽排序时候，会影响相同ID的元素
			list: [
				// {
				// 	id:1,
				// 	src:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3407686795,968933150&fm=26&gp=0.jpg',
				// 	sortID:1,
				// }
			],
			commentSwitch: true,
			text: '',
			uploadFilePathArray: []
		};
	},
	onLoad() {},
	computed: {
		...mapState(['userName'])
	},
	methods: {
		publishCircle() {
			let fileInfos = this.uploadFilePathArray;
			console.log(fileInfos);
			console.log(this.text);
			let paths = [];
			fileInfos.forEach(item => {
				paths.push(item.src);
			});
			// fileInfos.forEach((item, index) => {
			// 	service.uploadFile(fileInfos, index, paths).then(res => {
			// 		res = JSON.parse(res[1].data);
			// 		if (res.data != 200) {
			// 			uni.showToast({
			// 				title:res.msg
			// 			})
			// 		}

			// 		paths.push(res.msg);

			// 		if (paths.length == fileInfos.length) {
			// 			//调用添加朋友圈接口
			// 			service.addCircleOfFriendInfo(this.text, paths.join(';')).then(res => {
			// 				//添加成功
			// 				uni.navigateBack()
			// 			});
			// 		}
			// 	});
			// });
			if(paths.length==0){
				service.addCircleOfFriendInfo(this.text, '').then(res => {
					// commonUtil.navigateTo('../circle_of_firend/circle_of_firend?userAccount='+this.userName)
					uni.navigateBack();
				});
				return;
			}
			service.batchUploadFile(paths).then(res => {
				console.log(res);
				if (res.length == 1) {
					uni.showToast({
						title: '异常'
					});
					return;
				}
				res = JSON.parse(res[1].data);
				if (res.code != 200) {
					uni.showToast({
						title: res.msg
					});
				} else {
					service.addCircleOfFriendInfo(this.text, res.data).then(res => {
						// commonUtil.navigateTo('../circle_of_firend/circle_of_firend?userAccount='+this.userName)
						uni.navigateBack();
					});
				}
			});
			console.log(paths);
		},
		onAlbumSort(list) {
			// 返回排序后的数组集合
			// 更新后台排序号
			console.info('排序成功');
		},
		onAlbumClick(res) {
			// 图片预览
			uni.previewImage(res.index, res.list);
		},

		onAlbumAdd(res) {
			// 新增图片，会返回图片的排序号和图片路径
			// 需要保存到后台后，然后add到组件中
			console.info('新增成功');
			console.log(res);
			this.uploadFilePathArray.push(res);
			this.$refs.rAlbum.add({
				// id必须不能重复！！！！
				id: Math.floor(Math.random() * 1000 + 1),
				sortID: res.sortID,
				src: res.src
			});
		},
		onAlbumDelete(data) {
			// 返回删除的图片实体
			// 到后台删除
			console.info('删除成功');
			console.log(data);
			console.log(this.list);
			this.uploadFilePathArray.splice(data.sortID, 1);
			console.log(this.uploadFilePathArray);
		}
	}
};
</script>

<style>
.album-content {
	width: 100%;
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	font-size: 13px;
}
.paddingLR30 {
	padding-left: 30rpx;
	padding-right: 30rpx;
}
.paddingT20 {
	padding-top: 20rpx;
}
.paddingB20 {
	padding-bottom: 20rpx;
}
</style>
