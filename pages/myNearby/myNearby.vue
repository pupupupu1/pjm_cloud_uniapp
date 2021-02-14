<template>
	<view>
		<!-- {{nearByPeopleList}} -->
		<view>
			<u-cell-group v-for="item in nearByPeopleList" :key="item.content.name">
				<u-cell-item @tap="togoUInfoCard(item.content.name)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.content.name }}</view>
						<view slot="label" style="font-size: 26rpx;">{{ item.content.address | strSub }}</view>
						<view slot="right-icon">
							<template>
								距离{{ item.distance.value }}米
							</template>
						</view>
					</template>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import service from '../../service.js'
import commonUtil from '../../util/commonUtil.js'
export default {
	data() {
		return {
			nearByPeopleList:[]
		}
	},
	methods: {
		getLocationPeopleList(){
			let that=this
			uni.getLocation({
				type: 'wgs84',
				geocode: true, //设置该参数为true可直接获取经纬度及城市信息
				success: function(res) {
					console.log(res)
					let param=[res.longitude,res.latitude]
					service.getNearbyPeopleByLoc(param).then(res=>{
						that.nearByPeopleList=res.data
					})
				},
				fail: function() {
					uni.showToast({
						title: '获取地址失败',
						icon: 'none'
					});
				}
			});
		},
		togoUInfoCard(userAccount) {
			// uni.navigateTo({
			// 	url: '../otherInfoCard/otherInfoCard?userAccount=' + userAccount
			// });
			commonUtil.navigateTo('../otherInfoCard/otherInfoCard?userAccount=' + userAccount)
		},
	},
	onLoad() {
		this.getLocationPeopleList()
	}
}
</script>

<style></style>
