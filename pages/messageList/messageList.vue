<template>
	<view>
		<!-- 	<view><u-action-sheet :list="list" v-model="show"></u-action-sheet></view> -->
		<view>
			<view><search /></view>
			<u-cell-group v-for="item in msgList">
				<u-cell-item @tap="cellClick(item.optionId,item.isGroupMsg)" :arrow="false" :use-label-slot="true" hover-class="cell-hover-class">
					<view slot="icon" style="position:relative;top: 10rpx;width: 100rpx;"><avatar size="80" mode="square"></avatar></view>
					<template>
						<view slot="title" style="font-size: 35rpx;">{{ item.optionName }}</view>
						<view slot="label" style="font-size: 26rpx;">{{ item.optionMsg|strSub }}</view>
					</template>
					<view slot="right-icon" v-if="item.waitReadMsgNum > 0||true">
						<template>
							<view v-show="item.msgTime">
								{{ item.msgTime |formatDate}}
							</view>
							<u-badge :count="item.waitReadMsgNum"></u-badge>
						</template>
					</view>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import avatar from '../../components/avatar/avatar.vue';
import search from '../../components/search/search.vue';
import { mapState, mapMutations } from 'vuex';
import commonUtil from '../../util/commonUtil.js'
export default {
	data() {
		return {
			// msgList: [
			// 	{ optionId: 'yqz', optionName: 'yqz', optionMsg: 'hello pjm', waitReadMsgNum: 60, msgTime: '15:30' },
			// 	{ optionId: 'zyj', optionName: 'zyj', optionMsg: 'hello pjm', waitReadMsgNum: 50, msgTime: '15:29' },
			// 	{ optionId: 'lx', optionName: 'lx', optionMsg: 'hello pjm', waitReadMsgNum: 0, msgTime: '15:28' },
			// 	{ optionId: 'cz', optionName: 'cz', optionMsg: 'hello pjm', waitReadMsgNum: 30, msgTime: '15:27' },
			// 	{ optionId: 'why', optionName: 'why', optionMsg: 'hello pjm', waitReadMsgNum: 10, msgTime: '15:26' }
			// ],
			show: true,
			titleStyle: { fontSize: '40rpx' },
			labelStyle: { fontSize: '24rpx' },
			iconStyle: { width: '48rpx', height: '48rpx' }
		};
	},
	components: {
		avatar: avatar,
		search: search
	},
	computed: {
		...mapState(['userName','isOnLine', 'msgList'])
	},
	created() {
		var that=this
		let userInfo=JSON.parse(uni.getStorageSync('userInfo'))
		console.log('?????'+userInfo.userName)
		//加载消息列表msgList
		uni.getStorage({
			key: userInfo.userName+'_msgList'
		}).then(resdata => {
			resdata=resdata.filter(item=>{
				return item!=null
			})
			let msglist=resdata[0].data
			console.log(resdata[0].data)
			if(msglist==''){
				msglist='[]'
			}
			//加载
			that.setMsgList(JSON.parse(msglist))
			console.log(that.msgList)
		});
	},
	methods: {
		...mapMutations(['login','setMsgList']),
		cellClick(index,isGroupMsg) {
			console.log(this.msgList)
			console.log(isGroupMsg);
			if(isGroupMsg){
				console.log("从消息列表跳转到对话详情---群聊")
				// uni.navigateTo({
				// 	url: '../message/message?id=' + index+'&type=3'
				// });
				commonUtil.navigateTo('../message/message?id=' + index+'&type=3')
				
			}else{
				console.log("从消息列表跳转到对话详情---一对一")
				// uni.navigateTo({
				// 	url: '../message/message?id=' + index+'&type=2'
				// });
				commonUtil.navigateTo('../message/message?id=' + index+'&type=2')
			}
			// alert('hello');
		}
	}
};
</script>

<style>
/**点击反馈**/
.cell-hover-class {
	opacity: 0.5;
}
</style>
