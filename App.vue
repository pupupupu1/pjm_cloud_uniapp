<!-- <template>
	<view>
		
		<u-button @click="open">打开模态框</u-button>
		<u-modal v-model="show" :content="content"></u-modal>
		
	</view>
</template> -->
<script>
import { mapState, mapMutations } from 'vuex';
import common from './util/commonUtil.js';
export default {
	computed: {
		...mapState(['hasLogin', 'forcedLogin', 'socketTask'])
	},
	data() {
		return {
			show: true,
			content: '东临碣石，以观沧海'
		};
	},
	methods: {
		...mapMutations(['login', 'logout','bindLogin']),
		open() {
			this.show = true;
		}
	},
	onLaunch: function() {
		console.log('App Launch');
		
	},
	onShow: function() {
		console.log('App Show');
		uni.getLocation({
			type: 'wgs84',
			geocode: true, //设置该参数为true可直接获取经纬度及城市信息
			success: function(res) {
				console.log("打印坐标")
				console.log(res)
			},
			fail: function() {
				uni.showToast({
					title: '获取地址失败，将导致部分功能不可用',
					icon: 'none'
				});
			}
		});
		let userInfo = uni.getStorageSync('userInfo');
		if(this.socketTask==null){
			this.bindLogin()
		}else if (userInfo) {
			this.login(JSON.parse(userInfo).userDetailedInfo);
			common.reLaunch('messageList/messageList');
		} else {
			this.logout();
			common.reLaunch('login/login');
		}
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/* #ifndef APP-PLUS-NVUE */
/* 头条小程序需要把 iconfont 样式放到组件外 */
@import 'components/m-icon/m-icon.css';
@import 'uview-ui/index.scss';

/*每个页面公共css */
page {
	min-height: 100%;
	display: flex;
	font-size: 16px;
	background-color: #efefef;
}

/* #ifdef MP-BAIDU */
// page {
// 	width: 100%;
// 	height: 100%;
// 	display: block;
// }

// swan-template {
// 	width: 100%;
// 	min-height: 100%;
// 	display: flex;
// }

/* 原生组件模式下需要注意组件外部样式 */
custom-component {
	width: 100%;
	min-height: 100%;
	display: flex;
}

/* #endif */

/* #ifdef MP-ALIPAY */
// page {
// 	min-height: 100vh;
// }

/* #endif */
/* 原生组件模式下需要注意组件外部样式 */
// m-input {
// 	width: 100%;
// 	/* min-height: 100%; */
// 	display: flex;
// 	flex: 1;
// }

// .content {
// 	display: flex;
// 	flex: 1;
// 	flex-direction: column;
// 	background-color: #efeff4;
// 	padding: 10px;
// }

// .input-group {
// 	background-color: #ffffff;
// 	margin-top: 20px;
// 	position: relative;
// }

// .input-group::before {
// 	position: absolute;
// 	right: 0;
// 	top: 0;
// 	left: 0;
// 	height: 1px;
// 	content: '';
// 	-webkit-transform: scaleY(0.5);
// 	transform: scaleY(0.5);
// 	background-color: #c8c7cc;
// }

// .input-group::after {
// 	position: absolute;
// 	right: 0;
// 	bottom: 0;
// 	left: 0;
// 	height: 1px;
// 	content: '';
// 	-webkit-transform: scaleY(0.5);
// 	transform: scaleY(0.5);
// 	background-color: #c8c7cc;
// }

// .input-row {
// 	display: flex;
// 	flex-direction: row;
// 	position: relative;
// 	font-size: 18px;
// 	line-height: 40px;
// }

// .input-row .title {
// 	width: 72px;
// 	padding-left: 15px;
// }

// .input-row.border::after {
// 	position: absolute;
// 	right: 0;
// 	bottom: 0;
// 	left: 8px;
// 	height: 1px;
// 	content: '';
// 	-webkit-transform: scaleY(0.5);
// 	transform: scaleY(0.5);
// 	background-color: #c8c7cc;
// }

// .btn-row {
// 	margin-top: 25px;
// 	padding: 10px;
// }

// button.primary {
// 	background-color: #0faeff;
// }
/* #endif */
</style>
