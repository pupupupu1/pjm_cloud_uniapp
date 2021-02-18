<template>
	<view>
		<view class="content" @touchstart="hideDrawer">
			<scroll-view
				class="msg-list"
				scroll-y="true"
				:scroll-with-animation="scrollAnimation"
				:scroll-top="scrollTop"
				:scroll-into-view="scrollToView"
				@scrolltoupper="loadHistory"
				upper-threshold="50"
			>
				<!-- 加载历史数据waitingUI -->
				<view class="loading">
					<view class="spinner">
						<view class="rect1"></view>
						<view class="rect2"></view>
						<view class="rect3"></view>
						<view class="rect4"></view>
						<view class="rect5"></view>
					</view>
				</view>
				<view class="row" v-for="(row, index) in msgs" :key="index" :id="'msg' + row.id">
					<!-- 系统消息 -->
					<block v-if="row.isSys">
						<view class="system">
							<!-- 文字消息 -->
							<view v-if="row.type == 'text'" class="text">{{ row.msg }}</view>
							<!-- 领取红包消息 -->
							<view v-if="row.type == 'redEnvelope'" class="red-envelope">
								<image src="/static/img/red-envelope-chat.png"></image>
								{{ row.msg }}
							</view>
						</view>
					</block>
					<!-- 用户消息 -->
					<block v-if="!row.isSys">
						<!-- 自己发出的消息 -->
						<view class="my" v-if="row.isme">
							<!-- 左-消息 -->
							<view class="left">
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble"><rich-text :nodes="row.msg"></rich-text></view>
								<!-- 语言消息 -->
								<view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id ? 'play' : ''">
									<view class="length">{{ row.voiceLength }}</view>
									<view class="icon my-voice"></view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row)">
									<image :src="row.msg" :style="{ width: row.img.w + 'px', height: row.img.h + 'px' }"></image>
								</view>
								<view v-if="row.type == 'file'" class="bubble" @tap="fileClick(row)">
									<u-card
										:body-style="{ 'background-color': '#F06C7A' }"
										margin="0rpx"
										border-radius="0"
										padding="0"
										:border="false"
										:show-foot="false"
										:show-head="false"
										@body-click="fileClick(row)"
									>
										<view class="" slot="body">
											<u-row>
												<u-col span="8" @click="fileClick(row)">
													<text style="color: #FFFFFF;">
														{{row.file.fileName}}
														<br />
													</text>
													<text style="font-size: 5rpx;color: #F7F7F7;">{{row.file.fileSize}}k</text>
												</u-col>
												<u-col span="2" @click="fileClick(row)"><u-icon size="40" name="file-text"></u-icon></u-col>
											</u-row>
										</view>
									</u-card>
								</view>
								<!-- 红包 -->
								<!-- <view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)"> -->
								<!-- <image src="/static/img/red-envelope.png"></image> -->
								<!-- <view class="tis"> -->
								<!-- 点击开红包 -->
								<!-- </view> -->
								<!-- <view class="blessing">
										{{row.msg.content.blessing}}
									</view> -->
								<!-- </view> -->
							</view>
							<!-- 右-头像 -->
							<view class="right">
								<image :src="'http://39.105.78.171:1250'+userDetailedInfo.userHeader"></image>
								<!-- <u-col v-if="row.isme" style="margin-right: 10rpx;"><avatar :src="'http://39.105.78.171:1250'+userDetailedInfo.userHeader" size="80" mode="square" /></u-col> -->
							</view>
						</view>
						<!-- 别人发出的消息 -->
						<view class="other" v-if="!row.isme">
							<!-- 左-头像 -->
							<view class="left">
								<!-- <image :src=""></image> -->
								<image :src="'http://39.105.78.171:1250'+row.userHeader"></image>
								<!-- <u-col v-if="!row.isme" span="2"><avatar size="80" mode="square" /></u-col> -->
							</view>
							<!-- 右-用户名称-时间-消息 -->
							<view class="right">
								<view class="username">
									<view v-show="action == 2" class="name">{{ optionName }}</view>
									<view v-show="action == 3" class="name">{{ row.sourceName }}</view>
									<view class="time">{{ row.time }}</view>
								</view>
								<!-- 文字消息 -->
								<view v-if="row.type == 'text'" class="bubble"><rich-text :nodes="row.msg"></rich-text></view>
								<!-- 语音消息 -->
								<view v-if="row.type == 'voice'" class="bubble voice" @tap="playVoice(row)" :class="playMsgid == row.id ? 'play' : ''">
									<view class="icon other-voice"></view>
									<view class="length">{{ row.voiceLength }}</view>
								</view>
								<!-- 图片消息 -->
								<view v-if="row.type == 'img'" class="bubble img" @tap="showPic(row)">
									<image :src="row.msg" :style="{ width: row.img.w + 'px', height: row.img.h + 'px' }"></image>
								</view>
								<view v-if="row.type == 'file'" class="bubble">
									<u-card margin="0rpx" border-radius="0" padding="0" :border="false" :show-foot="false" :show-head="false" @body-click="fileClick(row)">
										<view class="" slot="body">
											<u-row>
												<u-col span="8" @click="fileClick(row)">
													<text>
														{{row.file.fileName}}
														<br />
													</text>
													<text style="font-size: 5rpx;color: #999999;">{{row.file.fileSize}}k</text>
												</u-col>
												<u-col span="2" @click="fileClick(row)"><u-icon size="40" name="file-text-fill"></u-icon></u-col>
											</u-row>
										</view>
									</u-card>
								</view>
								<!-- 红包 -->
								<!-- <view v-if="row.msg.type=='redEnvelope'" class="bubble red-envelope" @tap="openRedEnvelope(row.msg,index)"> -->
								<!-- <image src="/static/img/red-envelope.png"></image> -->
								<!-- <view class="tis"> -->
								<!-- 点击开红包 -->
								<!-- </view> -->
								<!-- <view class="blessing">
										{{row.msg.content.blessing}}
									</view> -->
								<!-- </view> -->
							</view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!-- 抽屉栏 -->
		<view class="popup-layer" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- 表情 -->
			<swiper class="emoji-swiper" :class="{ hidden: hideEmoji }" indicator-dots="true" duration="150">
				<swiper-item v-for="(page, pid) in emojiList" :key="pid">
					<view v-for="(em, eid) in page" :key="eid" @tap="addEmoji(em)"><image mode="widthFix" :src="'/static/img/emoji/' + em.url"></image></view>
				</swiper-item>
			</swiper>
			<!-- 更多功能 相册-拍照-红包 -->
			<view class="more-layer" :class="{ hidden: hideMore }">
				<view class="list">
					<view class="box" @tap="chooseImage"><view class="icon tupian2"></view></view>
					<view class="box" @tap="camera"><view class="icon paizhao"></view></view>
					<!-- <view class="box" @tap="handRedEnvelopes"><view class="icon hongbao"></view></view> -->
					<view v-show="action == 2" class="box" @tap="vedioTalk">
						<!-- <view class="icon hongbao"></view> -->
						<u-icon name="phone-fill" size="65"></u-icon>
					</view>
					<view class="box" @tap="uploadFile">
						<!-- <view class="icon hongbao"></view> -->
						<u-icon name="file-text" size="65"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部输入栏 -->
		<view class="input-box" :class="popupLayerClass" @touchmove.stop.prevent="discard">
			<!-- H5下不能录音，输入栏布局改动一下 -->
			<!-- #ifndef H5 -->
			<view class="voice"><view class="icon" :class="isVoice ? 'jianpan' : 'yuyin'" @tap="switchVoice"></view></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="textbox">
				<view
					class="voice-mode"
					:class="[isVoice ? '' : 'hidden', recording ? 'recording' : '']"
					@touchstart="voiceBegin"
					@touchmove.stop.prevent="voiceIng"
					@touchend="voiceEnd"
					@touchcancel="voiceCancel"
				>
					{{ voiceTis }}
				</view>
				<view class="text-mode" :class="isVoice ? 'hidden' : ''">
					<view class="box"><textarea auto-height="true" v-model="textMsg" @focus="textareaFocus" /></view>
					<view class="em" @tap="chooseEmoji"><view class="icon biaoqing"></view></view>
				</view>
			</view>
			<!-- #ifndef H5 -->
			<view class="more" @tap="showMore"><view class="icon add"></view></view>
			<!-- #endif -->
			<view class="send" :class="isVoice ? 'hidden' : ''" @tap="sendText"><view class="btn">发送</view></view>
		</view>
		<!-- 录音UI效果 -->
		<view class="record" :class="recording ? '' : 'hidden'">
			<view class="ing" :class="willStop ? 'hidden' : ''"><view class="icon luyin2"></view></view>
			<view class="cancel" :class="willStop ? '' : 'hidden'"><view class="icon chehui"></view></view>
			<view class="tis" :class="willStop ? 'change' : ''">{{ recordTis }}</view>
		</view>
		<l-file ref="lFile" @up-success="onfileUploadSuccess"></l-file>
	</view>
</template>
<script>
import avatar from '../../components/avatar/avatar.vue';
import commonUtil from '../../util/commonUtil.js';
import { mapState, mapMutations } from 'vuex';
import { pathToBase64, base64ToPath } from '../../js_sdk/gsq-image-tools/image-tools/index.js';
import file from '../../components/tki-file-manager/tki-file-manager.vue';
import lFile from '@/components/l-file/l-file.vue';
export default {
	computed: {
		...mapState(['userDetailedInfo','userName', 'isOnLine', 'msgList', 'socketTask', 'friendList', 'groupList', 'talkConfirm'])
	},
	components: {
		avatar,
		file,
		lFile
	},
	data() {
		return {
			filePath: '',
			textInput: true,
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
			optionName: '',
			//-------------------------------------------------------//
			//文字消息
			textMsg: '',
			//消息列表
			isHistoryLoading: false,
			scrollAnimation: false,
			scrollTop: 0,
			scrollToView: '',
			msgImgList: [],
			myuid: 0,

			//录音相关参数
			// #ifndef H5
			//H5不能录音
			RECORDER: uni.getRecorderManager(),
			// #endif
			isVoice: false,
			voiceTis: '按住 说话',
			recordTis: '手指上滑 取消发送',
			recording: false,
			willStop: false,
			initPoint: { identifier: 0, Y: 0 },
			recordTimer: null,
			recordLength: 0,

			//播放语音相关参数
			AUDIO: uni.createInnerAudioContext(),
			playMsgid: null,
			VoiceTimer: null,
			// 抽屉参数
			popupLayerClass: '',
			// more参数
			hideMore: true,
			//表情定义
			hideEmoji: true,
			emojiList: [
				[
					{ url: '100.gif', alt: '[微笑]' },
					{ url: '101.gif', alt: '[伤心]' },
					{ url: '102.gif', alt: '[美女]' },
					{ url: '103.gif', alt: '[发呆]' },
					{ url: '104.gif', alt: '[墨镜]' },
					{ url: '105.gif', alt: '[哭]' },
					{ url: '106.gif', alt: '[羞]' },
					{ url: '107.gif', alt: '[哑]' },
					{ url: '108.gif', alt: '[睡]' },
					{ url: '109.gif', alt: '[哭]' },
					{ url: '110.gif', alt: '[囧]' },
					{ url: '111.gif', alt: '[怒]' },
					{ url: '112.gif', alt: '[调皮]' },
					{ url: '113.gif', alt: '[笑]' },
					{ url: '114.gif', alt: '[惊讶]' },
					{ url: '115.gif', alt: '[难过]' },
					{ url: '116.gif', alt: '[酷]' },
					{ url: '117.gif', alt: '[汗]' },
					{ url: '118.gif', alt: '[抓狂]' },
					{ url: '119.gif', alt: '[吐]' },
					{ url: '120.gif', alt: '[笑]' },
					{ url: '121.gif', alt: '[快乐]' },
					{ url: '122.gif', alt: '[奇]' },
					{ url: '123.gif', alt: '[傲]' }
				],
				[
					{ url: '124.gif', alt: '[饿]' },
					{ url: '125.gif', alt: '[累]' },
					{ url: '126.gif', alt: '[吓]' },
					{ url: '127.gif', alt: '[汗]' },
					{ url: '128.gif', alt: '[高兴]' },
					{ url: '129.gif', alt: '[闲]' },
					{ url: '130.gif', alt: '[努力]' },
					{ url: '131.gif', alt: '[骂]' },
					{ url: '132.gif', alt: '[疑问]' },
					{ url: '133.gif', alt: '[秘密]' },
					{ url: '134.gif', alt: '[乱]' },
					{ url: '135.gif', alt: '[疯]' },
					{ url: '136.gif', alt: '[哀]' },
					{ url: '137.gif', alt: '[鬼]' },
					{ url: '138.gif', alt: '[打击]' },
					{ url: '139.gif', alt: '[bye]' },
					{ url: '140.gif', alt: '[汗]' },
					{ url: '141.gif', alt: '[抠]' },
					{ url: '142.gif', alt: '[鼓掌]' },
					{ url: '143.gif', alt: '[糟糕]' },
					{ url: '144.gif', alt: '[恶搞]' },
					{ url: '145.gif', alt: '[什么]' },
					{ url: '146.gif', alt: '[什么]' },
					{ url: '147.gif', alt: '[累]' }
				],
				[
					{ url: '148.gif', alt: '[看]' },
					{ url: '149.gif', alt: '[难过]' },
					{ url: '150.gif', alt: '[难过]' },
					{ url: '151.gif', alt: '[坏]' },
					{ url: '152.gif', alt: '[亲]' },
					{ url: '153.gif', alt: '[吓]' },
					{ url: '154.gif', alt: '[可怜]' },
					{ url: '155.gif', alt: '[刀]' },
					{ url: '156.gif', alt: '[水果]' },
					{ url: '157.gif', alt: '[酒]' },
					{ url: '158.gif', alt: '[篮球]' },
					{ url: '159.gif', alt: '[乒乓]' },
					{ url: '160.gif', alt: '[咖啡]' },
					{ url: '161.gif', alt: '[美食]' },
					{ url: '162.gif', alt: '[动物]' },
					{ url: '163.gif', alt: '[鲜花]' },
					{ url: '164.gif', alt: '[枯]' },
					{ url: '165.gif', alt: '[唇]' },
					{ url: '166.gif', alt: '[爱]' },
					{ url: '167.gif', alt: '[分手]' },
					{ url: '168.gif', alt: '[生日]' },
					{ url: '169.gif', alt: '[电]' },
					{ url: '170.gif', alt: '[炸弹]' },
					{ url: '171.gif', alt: '[刀子]' }
				],
				[
					{ url: '172.gif', alt: '[足球]' },
					{ url: '173.gif', alt: '[瓢虫]' },
					{ url: '174.gif', alt: '[翔]' },
					{ url: '175.gif', alt: '[月亮]' },
					{ url: '176.gif', alt: '[太阳]' },
					{ url: '177.gif', alt: '[礼物]' },
					{ url: '178.gif', alt: '[抱抱]' },
					{ url: '179.gif', alt: '[拇指]' },
					{ url: '180.gif', alt: '[贬低]' },
					{ url: '181.gif', alt: '[握手]' },
					{ url: '182.gif', alt: '[剪刀手]' },
					{ url: '183.gif', alt: '[抱拳]' },
					{ url: '184.gif', alt: '[勾引]' },
					{ url: '185.gif', alt: '[拳头]' },
					{ url: '186.gif', alt: '[小拇指]' },
					{ url: '187.gif', alt: '[拇指八]' },
					{ url: '188.gif', alt: '[食指]' },
					{ url: '189.gif', alt: '[ok]' },
					{ url: '190.gif', alt: '[情侣]' },
					{ url: '191.gif', alt: '[爱心]' },
					{ url: '192.gif', alt: '[蹦哒]' },
					{ url: '193.gif', alt: '[颤抖]' },
					{ url: '194.gif', alt: '[怄气]' },
					{ url: '195.gif', alt: '[跳舞]' }
				],
				[
					{ url: '196.gif', alt: '[发呆]' },
					{ url: '197.gif', alt: '[背着]' },
					{ url: '198.gif', alt: '[伸手]' },
					{ url: '199.gif', alt: '[耍帅]' },
					{ url: '200.png', alt: '[微笑]' },
					{ url: '201.png', alt: '[生病]' },
					{ url: '202.png', alt: '[哭泣]' },
					{ url: '203.png', alt: '[吐舌]' },
					{ url: '204.png', alt: '[迷糊]' },
					{ url: '205.png', alt: '[瞪眼]' },
					{ url: '206.png', alt: '[恐怖]' },
					{ url: '207.png', alt: '[忧愁]' },
					{ url: '208.png', alt: '[眨眉]' },
					{ url: '209.png', alt: '[闭眼]' },
					{ url: '210.png', alt: '[鄙视]' },
					{ url: '211.png', alt: '[阴暗]' },
					{ url: '212.png', alt: '[小鬼]' },
					{ url: '213.png', alt: '[礼物]' },
					{ url: '214.png', alt: '[拜佛]' },
					{ url: '215.png', alt: '[力量]' },
					{ url: '216.png', alt: '[金钱]' },
					{ url: '217.png', alt: '[蛋糕]' },
					{ url: '218.png', alt: '[彩带]' },
					{ url: '219.png', alt: '[礼物]' }
				]
			],
			//表情图片图床名称 ，由于我上传的第三方图床名称会有改变，所以有此数据来做对应，您实际应用中应该不需要
			onlineEmoji: {
				'100.gif': 'AbNQgA.gif',
				'101.gif': 'AbN3ut.gif',
				'102.gif': 'AbNM3d.gif',
				'103.gif': 'AbN8DP.gif',
				'104.gif': 'AbNljI.gif',
				'105.gif': 'AbNtUS.gif',
				'106.gif': 'AbNGHf.gif',
				'107.gif': 'AbNYE8.gif',
				'108.gif': 'AbNaCQ.gif',
				'109.gif': 'AbNN4g.gif',
				'110.gif': 'AbN0vn.gif',
				'111.gif': 'AbNd3j.gif',
				'112.gif': 'AbNsbV.gif',
				'113.gif': 'AbNwgs.gif',
				'114.gif': 'AbNrD0.gif',
				'115.gif': 'AbNDuq.gif',
				'116.gif': 'AbNg5F.gif',
				'117.gif': 'AbN6ET.gif',
				'118.gif': 'AbNcUU.gif',
				'119.gif': 'AbNRC4.gif',
				'120.gif': 'AbNhvR.gif',
				'121.gif': 'AbNf29.gif',
				'122.gif': 'AbNW8J.gif',
				'123.gif': 'AbNob6.gif',
				'124.gif': 'AbN5K1.gif',
				'125.gif': 'AbNHUO.gif',
				'126.gif': 'AbNIDx.gif',
				'127.gif': 'AbN7VK.gif',
				'128.gif': 'AbNb5D.gif',
				'129.gif': 'AbNX2d.gif',
				'130.gif': 'AbNLPe.gif',
				'131.gif': 'AbNjxA.gif',
				'132.gif': 'AbNO8H.gif',
				'133.gif': 'AbNxKI.gif',
				'134.gif': 'AbNzrt.gif',
				'135.gif': 'AbU9Vf.gif',
				'136.gif': 'AbUSqP.gif',
				'137.gif': 'AbUCa8.gif',
				'138.gif': 'AbUkGQ.gif',
				'139.gif': 'AbUFPg.gif',
				'140.gif': 'AbUPIS.gif',
				'141.gif': 'AbUZMn.gif',
				'142.gif': 'AbUExs.gif',
				'143.gif': 'AbUA2j.gif',
				'144.gif': 'AbUMIU.gif',
				'145.gif': 'AbUerq.gif',
				'146.gif': 'AbUKaT.gif',
				'147.gif': 'AbUmq0.gif',
				'148.gif': 'AbUuZV.gif',
				'149.gif': 'AbUliF.gif',
				'150.gif': 'AbU1G4.gif',
				'151.gif': 'AbU8z9.gif',
				'152.gif': 'AbU3RJ.gif',
				'153.gif': 'AbUYs1.gif',
				'154.gif': 'AbUJMR.gif',
				'155.gif': 'AbUadK.gif',
				'156.gif': 'AbUtqx.gif',
				'157.gif': 'AbUUZ6.gif',
				'158.gif': 'AbUBJe.gif',
				'159.gif': 'AbUdIO.gif',
				'160.gif': 'AbU0iD.gif',
				'161.gif': 'AbUrzd.gif',
				'162.gif': 'AbUDRH.gif',
				'163.gif': 'AbUyQA.gif',
				'164.gif': 'AbUWo8.gif',
				'165.gif': 'AbU6sI.gif',
				'166.gif': 'AbU2eP.gif',
				'167.gif': 'AbUcLt.gif',
				'168.gif': 'AbU4Jg.gif',
				'169.gif': 'AbURdf.gif',
				'170.gif': 'AbUhFS.gif',
				'171.gif': 'AbU5WQ.gif',
				'172.gif': 'AbULwV.gif',
				'173.gif': 'AbUIzj.gif',
				'174.gif': 'AbUTQs.gif',
				'175.gif': 'AbU7yn.gif',
				'176.gif': 'AbUqe0.gif',
				'177.gif': 'AbUHLq.gif',
				'178.gif': 'AbUOoT.gif',
				'179.gif': 'AbUvYF.gif',
				'180.gif': 'AbUjFU.gif',
				'181.gif': 'AbaSSJ.gif',
				'182.gif': 'AbUxW4.gif',
				'183.gif': 'AbaCO1.gif',
				'184.gif': 'Abapl9.gif',
				'185.gif': 'Aba9yR.gif',
				'186.gif': 'AbaFw6.gif',
				'187.gif': 'Abaiex.gif',
				'188.gif': 'AbakTK.gif',
				'189.gif': 'AbaZfe.png',
				'190.gif': 'AbaEFO.gif',
				'191.gif': 'AbaVYD.gif',
				'192.gif': 'AbamSH.gif',
				'193.gif': 'AbaKOI.gif',
				'194.gif': 'Abanld.gif',
				'195.gif': 'Abau6A.gif',
				'196.gif': 'AbaQmt.gif',
				'197.gif': 'Abal0P.gif',
				'198.gif': 'AbatpQ.gif',
				'199.gif': 'Aba1Tf.gif',
				'200.png': 'Aba8k8.png',
				'201.png': 'AbaGtS.png',
				'202.png': 'AbaJfg.png',
				'203.png': 'AbaNlj.png',
				'204.png': 'Abawmq.png',
				'205.png': 'AbaU6s.png',
				'206.png': 'AbaaXn.png',
				'207.png': 'Aba000.png',
				'208.png': 'AbarkT.png',
				'209.png': 'AbastU.png',
				'210.png': 'AbaB7V.png',
				'211.png': 'Abafn1.png',
				'212.png': 'Abacp4.png',
				'213.png': 'AbayhF.png',
				'214.png': 'Abag1J.png',
				'215.png': 'Aba2c9.png',
				'216.png': 'AbaRXR.png',
				'217.png': 'Aba476.png',
				'218.png': 'Abah0x.png',
				'219.png': 'Abdg58.png'
			},
			//红包相关参数
			windowsState: '',
			redenvelopeData: {
				rid: null, //红包ID
				from: null,
				face: null,
				blessing: null,
				money: null
			},
			localPath:'',
			friendInfo:{}
		};
	},
	created() {
		var that = this;
		var userInfo = JSON.parse(uni.getStorageSync('userInfo'));
		//从本地json资源加载自己的所有聊天相关记录
		// console.log(allMsgs)
		var routes = getCurrentPages();
		var params = routes[routes.length - 1].options;
		var friendInfo;
		var groupInfo;
		if (params == undefined) {
			params = { type: 2, id: 'zyj' };
		}
		that.action = params.type;
		that.msgBody.action = that.action;
		// console.log(params.id);
		if (that.action == 2) {
			console.log('一对一聊天');
			console.log(that.friendList);
			//从friendList过滤获取此人姓名
			friendInfo = that.friendList.find(item => item.user.userAccount == params.id);
			this.friendInfo=friendInfo
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
			console.log("groupList:{}",groupInfo)
			this.optionName = groupInfo.userGroupName;
			this.msgBody.receiveAccount = groupInfo.id;
		}

		//开启socket监听
		that.socketTask.onMessage(res => {
			console.log('收到了一条消息！');
			let data = JSON.parse(res.data);
			console.log(that.optionName);
			
			if (data.action == 2) {
				console.log(friendInfo);
				if (friendInfo.user.userAccount == data.sourceAccount) {
					console.log(data.sourceAccount + '发来了新消息');
					if (data.header.type == 'img') {
						// console.log(data.msgBody);
						base64ToPath(data.msgBody).then(path => {
							that.msgs.push({
								id: data.header.id,
								isSys: false,
								isme: false,
								msg: path,
								userHeader:friendInfo.user.userHeader,
								type: data.header.type,
								voiceLength: data.header.voiceLength,
								img: {
									w: data.header.imgw,
									h: data.header.imgh
								}
							});
							that.jumpScroll();
						});
					} else if (data.header.type == 'voice') {
						commonUtil.lzFileWriter(data.msgBody, new Date().getTime() + '.mp3').then((res, rej) => {
							console.log('解析mp3结果：' + JSON.stringify(res));
							that.msgs.push({
								id: data.header.id,
								isSys: false,
								isme: false,
								msg: res,
								userHeader:friendInfo.user.userHeader,
								type: data.header.type,
								voiceLength: data.header.voiceLength
							});
							that.jumpScroll();
						});
					} else if (data.header.type == 'file') {
						that.msgs.push({
							id: data.header.id,
							isSys: false,
							isme: false,
							userHeader:friendInfo.user.userHeader,
							msg: data.msgBody,
							file:JSON.parse(data.msgBody),
							type: data.header.type
						});
						that.jumpScroll();
					}else if (data.header.type == 'text') {
						that.msgs.push({
							id: data.header.id,
							isSys: false,
							isme: false,
							userHeader:friendInfo.user.userHeader,
							msg: data.msgBody,
							type: data.header.type
						});
						that.jumpScroll();
					}
				}
			} else if (data.action == 3) {
				if (that.userName != data.sourceAccount&&data.receiveAccount==groupInfo.id) {
					var sourceUserInfo=JSON.parse(data.header.sourceUserInfo)
					console.log(data.sourceAccount + '发来了群内新消息');
					if (data.header.type == 'img') {
						// console.log(data.msgBody);
						base64ToPath(data.msgBody).then(path => {
							
							that.msgs.push({
								id: data.header.id,
								isSys: false,
								isme: false,
								msg: path,
								type: data.header.type,
								voiceLength: data.header.voiceLength,
								userHeader:sourceUserInfo.userHeader,
								sourceName: data.sourceAccount,
								img: {
									w: data.header.imgw,
									h: data.header.imgh
								}
							});
							that.jumpScroll();
						});
					} else if (data.header.type == 'voice') {
						commonUtil.lzFileWriter(data.msgBody, new Date().getTime() + '.mp3').then((res, rej) => {
							console.log('解析mp3结果：' + JSON.stringify(res));
							that.msgs.push({
								id: data.header.id,
								isSys: false,
								isme: false,
								msg: res,
								userHeader:sourceUserInfo.userHeader,
								type: data.header.type,
								sourceName: data.sourceAccount,
								voiceLength: data.header.voiceLength
							});
							that.jumpScroll();
						});
					} else if (data.header.type == 'file') {
						that.msgs.push({
							id: data.header.id,
							isSys: false,
							isme: false,
							msg: data.msgBody,
							userHeader:sourceUserInfo.userHeader,
							file:JSON.parse(data.msgBody),
							sourceName: data.sourceAccount,
							type: data.header.type
						});
						that.jumpScroll();
					}else if (data.header.type == 'text') {
						that.msgs.push({
							id: data.id,
							isSys: false,
							isme: false,
							userHeader:sourceUserInfo.userHeader,
							msg: data.msgBody,
							sourceName: data.sourceAccount,
							type: data.header.type
						});
						that.jumpScroll();
					}
					// that.msgs.push({
					// 	id: data.id,
					// 	isSys: false,
					// 	isme: false,
					// 	msg: data.msgBody,
						
						
					// 	type: data.header.type,
					// 	img: {
					// 		w: data.header.imgw,
					// 		h: data.header.imgh
					// 	}
					// });
				}
				that.jumpScroll();
			}
		});
		//将此次会话缓存进vuex
		that.setTalkSession(userInfo.userName + '_talkSession_' + this.optionName);
		//将这条msglist消息待阅读数目改为0
		if (that.msgList == null || that.msgList == '') {
			that.msgList = [];
		}
		that.msgList.forEach(item => {
			if (item.optionId == this.optionName) {
				item.waitReadMsgNum = 0;
			}
		});
		// console.log(that.msgList);
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
			// console.log(resdata);
			if (that.action == 2) {
				resdata.forEach(item => {
					if (item.sourceAccount == userInfo.userName) {
						that.msgs.push({
							id: item.header.id,
							isSys: false,
							isme: true,
							
							file:item.header.type=='file'?JSON.parse(item.msgBody):'',
							msg: item.msgBody,
							type: item.header.type,
							voiceLength: item.header.voiceLength,
							img: {
								w: item.header.imgw,
								h: item.header.imgh
							}
						});
					} else {
						that.msgs.push({
							id: item.header.id,
							isSys: false,
							isme: false,
							file:item.header.type=='file'?JSON.parse(item.msgBody):'',
							msg: item.msgBody,
							userHeader:friendInfo.user.userHeader,
							type: item.header.type,
							voiceLength: item.header.voiceLength,
							img: {
								w: item.header.imgw,
								h: item.header.imgh
							}
						});
					}
				});
			} else {
				resdata.forEach(item => {
					// if (item.type == 'text') {
					// 	item.msgBody = '<p>' + that.subStrMsg(item.msgBody, 25) + '</p>';
					// }
					// console.log(item.msgBody);
					if (item.sourceAccount == userInfo.userName) {
						that.msgs.push({
							id: item.header.id,
							isSys: false,
							isme: true,
							file:item.header.type=='file'?JSON.parse(item.msgBody):'',
							msg: item.msgBody,
							type: item.header.type,
							voiceLength: item.header.voiceLength,
							img: {
								w: item.header.imgw,
								h: item.header.imgh
							}
						});
					} else {
						if(item.header.sourceUserInfo){
							var sourceUserInfo=JSON.parse(item.header.sourceUserInfo)
						}
						that.msgs.push({
							id: item.header.id,
							isSys: false,
							isme: false,
							userHeader:sourceUserInfo!=undefined?sourceUserInfo.userHeader:'',
							file:item.header.type=='file'?JSON.parse(item.msgBody):'',
							msg: item.msgBody,
							sourceName: item.sourceAccount,
							type: item.header.type,
							voiceLength: item.header.voiceLength,
							img: {
								w: item.header.imgw,
								h: item.header.imgh
							}
						});
					}
				});
			}
			// console.log(that.msgs);
			this.jumpScroll();
		});
		//延迟50毫秒执行，太快有bug
		// setTimeout(() => {

		// }, 100);
	},
	onLoad(option) {
		// this.getMsgList();
		//语音自然播放结束
		this.AUDIO.onEnded(res => {
			this.playMsgid = null;
		});
		// #ifndef H5
		//录音开始事件
		this.RECORDER.onStart(e => {
			this.recordBegin(e);
		});
		//录音结束事件
		this.RECORDER.onStop(e => {
			this.recordEnd(e);
		});
		// #endif
	},
	onShow() {
		this.scrollTop = 9999999;

		//模板借由本地缓存实现发红包效果，实际应用中请不要使用此方法。
		//
		// uni.getStorage({
		// 	key: 'redEnvelopeData',
		// 	success:  (res)=>{
		// 		console.log(res.data);
		// 		let nowDate = new Date();
		// 		let lastid = this.msgList[this.msgList.length-1].msg.id;
		// 		lastid++;
		// 		let row = {type:"user",msg:{id:lastid,type:"redEnvelope",time:nowDate.getHours()+":"+nowDate.getMinutes(),userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:res.data.blessing,rid:Math.floor(Math.random()*1000+1),isReceived:false}}};
		// 		this.screenMsg(row);
		// 		uni.removeStorage({key: 'redEnvelopeData'});
		// 	}
		// });
	},
	methods: {
		...mapMutations(['login', 'setMsgList', 'setTalkSession', 'removeTalkSession', 'setTalkConfirm']),
		fileClick(row) {
			console.log(row);
			if(row.file.localPath==undefined){
				this.downLoadThis(row.file.filePath).then(localPath=>{
					row.file.localPath=localPath
					console.log(localPath)
					console.log(this.userName + '_allMsg_' + this.msgBody.receiveAccount)
					//根据时间戳恢复消息成为已下载消息
					var msgList=uni.getStorageSync(this.userName + '_allMsg_' + this.msgBody.receiveAccount)
					msgList=JSON.parse(msgList)
					// console.log(msgList)
					msgList.forEach(msg=>{
						if(msg.header.type=='file'){
							console.log('找到了file类型文件')
							if(msg.header.id==row.id){
								console.log('找到了文件消息，设置已下载')
								let msgBody=JSON.parse(msg.msgBody)
								msgBody.localPath=localPath
								msg.msgBody=JSON.stringify(msgBody)
								commonUtil.setItem(this.userName + '_allMsg_' + this.msgBody.receiveAccount,JSON.stringify(msgList))
							}
						}
					})
					this.$refs.lFile.open(localPath);
				})
				
			}else{
				this.$refs.lFile.open(row.file.localPath);
			}
		},
		openThisFile(filePath) {
				let url = 'http://39.105.78.171:1250'+filePath;
				/* 下载返回临时路径（退出应用失效） */
				this.$refs.lFile.download(url)
				.then(path=>{
					/* 预览 */
					console.log(path)
					this.$refs.lFile.open(path);
				});
			},
		/* 保存 */
		downLoadThis(filePath) {
			let url = 'http://39.105.78.171:1250'+filePath;
			return this.$refs.lFile.download(url,'local')
			
		},
		/* 上传 */
		uploadFile() {
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
					Authorization: uni.getStorageSync('Authorization')
				}
				//...其他参数
			});
		},
		onfileUploadSuccess(res) {
			console.log('上传成功回调', JSON.stringify(res));
			let data = JSON.parse(res.data.id).data;
			// let localPath=res.data.localPath
			// data.localPath=localPath
			let msgBody = JSON.parse(JSON.stringify(this.msgBody));
			msgBody.msgBody = JSON.stringify(data);
			msgBody.header.type = 'file';
			msgBody.header.id=new Date().getTime()
			msgBody.sourceAccount = this.userName;
			console.log(msgBody);
			this.socketTask.send({
				data:JSON.stringify(msgBody)
			});
			this.msgs.push({
				id: msgBody.header.id,
				isSys: false,
				isme: true,
				file:data,
				msg: JSON.stringify(data),
				type: msgBody.header.type
			});
			this.jumpScroll();
			this.hideDrawer()
		},
		// 接受消息(筛选处理)
		screenMsg(msg) {
			//从长连接处转发给这个方法，进行筛选处理
			if (msg.isSys) {
				// 系统消息
				switch (msg.type) {
					case 'text':
						this.addSystemTextMsg(msg);
						break;
					case 'redEnvelope':
						this.addSystemRedEnvelopeMsg(msg);
						break;
				}
			} else if (!msg.isSys) {
				// 用户消息
				switch (msg.type) {
					case 'text':
						this.addTextMsg(msg);
						break;
					case 'voice':
						msg.url = msg.msg.url;
						msg.voiceLength = msg.msg.voiceLength;
						msg.msg = msg.msg.base64;
						this.addVoiceMsg(msg);
						break;
					case 'img':
						msg.img.url = msg.msg.url;
						msg.img.w = msg.msg.w;
						msg.msg.h = msg.msg.h;
						msg.msg = msg.msg.base64;
						console.log(msg);
						this.addImgMsg(msg);
						break;
					case 'redEnvelope':
						this.addRedEnvelopeMsg(msg);
						break;
				}
				console.log('用户消息');
				//非自己的消息震动
				if (!msg.isme) {
					console.log('振动');
					uni.vibrateLong();
					// this.scrollToView
				}
			}
			this.$nextTick(function() {
				// 滚动到底
				console.log('滚动到底msg' + JSON.stringify(msg));
				this.scrollToView = 'msg' + msg.id;
			});
		},

		//触发滑动到顶部(加载历史信息记录)
		loadHistory(e) {
			// if (this.isHistoryLoading) {
			// 	return;
			// }
			// this.isHistoryLoading = true; //参数作为进入请求标识，防止重复请求
			// this.scrollAnimation = false; //关闭滑动动画
			// let Viewid = this.msgs[0].id; //记住第一个信息ID
			//本地模拟请求历史记录效果
			// setTimeout(() => {
			// 	// 消息列表
			// 	let list = [
			// 		{
			// 			type: 'user',
			// 			msg: {
			// 				id: 1,
			// 				type: 'text',
			// 				time: '12:56',
			// 				userinfo: { uid: 0, username: '大黑哥', face: '/static/img/face.jpg' },
			// 				content: { text: '为什么温度会相差那么大？' }
			// 			}
			// 		},
			// 		{
			// 			type: 'user',
			// 			msg: {
			// 				id: 2,
			// 				type: 'text',
			// 				time: '12:57',
			// 				userinfo: { uid: 1, username: '售后客服008', face: '/static/img/im/face/face_2.jpg' },
			// 				content: { text: '这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。' }
			// 			}
			// 		},
			// 		{
			// 			type: 'user',
			// 			msg: {
			// 				id: 3,
			// 				type: 'voice',
			// 				time: '12:59',
			// 				userinfo: { uid: 1, username: '售后客服008', face: '/static/img/im/face/face_2.jpg' },
			// 				content: { url: '/static/voice/1.mp3', length: '00:06' }
			// 			}
			// 		},
			// 		{
			// 			type: 'user',
			// 			msg: {
			// 				id: 4,
			// 				type: 'voice',
			// 				time: '13:05',
			// 				userinfo: { uid: 0, username: '大黑哥', face: '/static/img/face.jpg' },
			// 				content: { url: '/static/voice/2.mp3', length: '00:06' }
			// 			}
			// 		}
			// 	];
			// 	// 获取消息中的图片,并处理显示尺寸
			// 	for (let i = 0; i < list.length; i++) {
			// 		if (list[i].type == 'user' && list[i].msg.type == 'img') {
			// 			list[i].msg.content = this.setPicSize(list[i].msg.content);
			// 			this.msgImgList.unshift(list[i].msg.content.url);
			// 		}
			// 		list[i].msg.id = Math.floor(Math.random() * 1000 + 1);
			// 		this.msgs.unshift(list[i]);
			// 	}
			// 	//这段代码很重要，不然每次加载历史数据都会跳到顶部
			// 	this.$nextTick(function() {
			// 		this.scrollToView = 'msg' + Viewid; //跳转上次的第一行信息位置
			// 		this.$nextTick(function() {
			// 			this.scrollAnimation = true; //恢复滚动动画
			// 		});
			// 	});
			// 	this.isHistoryLoading = false;
			// }, 1000);
		},
		// 加载初始页面消息
		getMsgList() {
			// 消息列表
			// let list = [
			// 	{type:"system",msg:{id:0,type:"text",content:{text:"欢迎进入HM-chat聊天室"}}},
			// 	{type:"user",msg:{id:1,type:"text",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{text:"为什么温度会相差那么大？"}}},
			// 	{type:"user",msg:{id:2,type:"text",time:"12:57",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{text:"这个是有偏差的，两个温度相差十几二十度是很正常的，如果相差五十度，那即是质量问题了。"}}},
			// 	{type:"user",msg:{id:3,type:"voice",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/voice/1.mp3",length:"00:06"}}},
			// 	{type:"user",msg:{id:4,type:"voice",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/voice/2.mp3",length:"00:06"}}},
			// 	{type:"user",msg:{id:5,type:"img",time:"13:05",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{url:"/static/img/p10.jpg",w:200,h:200}}},
			// 	{type:"user",msg:{id:6,type:"img",time:"12:59",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{url:"/static/img/q.jpg",w:1920,h:1080}}},
			// 	{type:"system",msg:{id:7,type:"text",content:{text:"欢迎进入HM-chat聊天室"}}},

			// 	{type:"system",msg:{id:9,type:"redEnvelope",content:{text:"售后客服008领取了你的红包"}}},
			// 	{type:"user",msg:{id:10,type:"redEnvelope",time:"12:56",userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:{blessing:"恭喜发财，大吉大利，万事如意",rid:0,isReceived:false}}},
			// 	{type:"user",msg:{id:11,type:"redEnvelope",time:"12:56",userinfo:{uid:1,username:"售后客服008",face:"/static/img/im/face/face_2.jpg"},content:{blessing:"恭喜发财",rid:1,isReceived:false}}},
			// ]
			// 获取消息中的图片,并处理显示尺寸
			for (let i = 0; i < list.length; i++) {
				if (list[i].type == 'user' && list[i].msg.type == 'img') {
					list[i].msg.content = this.setPicSize(list[i].msg.content);
					this.msgImgList.push(list[i].msg.content.url);
				}
			}
			this.msgs = list;
			// 滚动到底部
			this.$nextTick(function() {
				//进入页面滚动到底部
				this.scrollTop = 999999;
				this.$nextTick(function() {
					this.scrollAnimation = true;
				});
			});
		},
		//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
		setPicSize(content) {
			// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
			let maxW = uni.upx2px(350); //350是定义消息图片最大宽度
			let maxH = uni.upx2px(350); //350是定义消息图片最大高度
			if (content.w > maxW || content.h > maxH) {
				let scale = content.w / content.h;
				content.w = scale > 1 ? maxW : maxH * scale;
				content.h = scale > 1 ? maxW / scale : maxH;
			}
			return content;
		},

		//更多功能(点击+弹出)
		showMore() {
			this.isVoice = false;
			this.hideEmoji = true;
			if (this.hideMore) {
				this.hideMore = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		// 打开抽屉
		openDrawer() {
			this.popupLayerClass = 'showLayer';
		},
		// 隐藏抽屉
		hideDrawer() {
			this.popupLayerClass = '';
			setTimeout(() => {
				this.hideMore = true;
				this.hideEmoji = true;
			}, 150);
		},
		// 选择图片发送
		chooseImage() {
			this.getImage('album');
		},
		//拍照发送
		camera() {
			this.getImage('camera');
		},
		//发红包
		handRedEnvelopes() {
			// uni.navigateTo({
			// 	url:'HM-hand/HM-hand'
			// });
			console.log('发红包');
			this.hideDrawer();
		},
		vedioTalk() {
			console.log(this.optionName + '准备通话');
			let msgBody = JSON.parse(JSON.stringify(this.msgBody));
			msgBody.action = 4;
			msgBody.sourceAccount = this.userName;
			this.showMore();
			this.socketTask.send({ data: JSON.stringify(msgBody) });
		},
		app_img(num, rem) {
			console.log('准备图片');
			let that = this;
			let index = rem.tempFiles[num].path.lastIndexOf('.'); //获取图片地址最后一个点的位置
			let img_type = rem.tempFiles[num].path.substring(index + 1, rem.tempFiles[num].path.length); //截取图片类型如png jpg
			let img_yuanshi = rem.tempFiles[num].path.substring(0, index); //截取图片原始路径
			let d2 = new Date().getTime(); //时间戳
			uni.getImageInfo({
				src: rem.tempFilePaths[num],
				success: image => {
					//---------------------------------------------------------------------------//
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
								let msg = { url: rem.tempFilePaths[num], base64: base64, w: image.width, h: image.height };
								this.sendMsg(msg, 'img');
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
				}
			});
		},
		//选照片 or 拍照
		getImage(type) {
			let that = this;
			this.hideDrawer();
			uni.chooseImage({
				sourceType: [type],
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: res => {
					//------------------------------------------------------//
					// #ifndef H5
					// for (let i = 0; i < res.tempFilePaths.length; i++) {
					// 	uni.getImageInfo({
					// 		src: res.tempFilePaths[i],
					// 		success: image => {
					// 			console.log(image.width);
					// 			console.log(image.height);
					// 			pathToBase64(res.tempFilePaths[i]).then(base64 => {
					// 				console.log(base64.length);
					// 				let msg = { url: res.tempFilePaths[i], base64: base64, w: image.width, h: image.height };
					// 				this.sendMsg(msg, 'img');
					// 			});
					// 		}
					// 	});
					// }
					// #endif
					// #ifndef APP-PLUS
					that.app_img(0, res);
					// #endif
					// #ifndef MP-WEIXIN
					for (let i = 0; i < res.tempFilePaths.length; i++) {
						uni.getImageInfo({
							src: res.tempFilePaths[i],
							success: image => {
								console.log(image.width);
								console.log(image.height);
								pathToBase64(res.tempFilePaths[i]).then(base64 => {
									console.log(base64.length);
									let msg = { url: res.tempFilePaths[i], base64: base64, w: image.width, h: image.height };
									this.sendMsg(msg, 'img');
								});
							}
						});
					}
					// #endif
					// switch (uni.getSystemInfoSync().platform) {
					// 	case 'android':
					// 		that.app_img(0, res);
					// 		break;

					// 	case 'ios':
					// 		console.log('运行iOS上');

					// 		break;

					// 	default:
					// 		console.log('h5上');
					// 		for (let i = 0; i < res.tempFilePaths.length; i++) {
					// 			uni.getImageInfo({
					// 				src: res.tempFilePaths[i],
					// 				success: image => {
					// 					console.log(image.width);
					// 					console.log(image.height);
					// 					let msg = { url: res.tempFilePaths[i], w: image.width, h: image.height };
					// 					this.sendMsg(msg, 'img');
					// 				}
					// 			});
					// 		}
					// 		break;
					// }

					//-----------------------------------------------------------------------//
				}
			});
		},
		// 选择表情
		chooseEmoji() {
			this.hideMore = true;
			if (this.hideEmoji) {
				this.hideEmoji = false;
				this.openDrawer();
			} else {
				this.hideDrawer();
			}
		},
		//添加表情
		addEmoji(em) {
			this.textMsg += em.alt;
		},

		//获取焦点，如果不是选表情ing,则关闭抽屉
		textareaFocus() {
			if (this.popupLayerClass == 'showLayer' && this.hideMore == false) {
				this.hideDrawer();
			}
		},
		// 发送文字消息
		sendText() {
			this.hideDrawer(); //隐藏抽屉
			if (!this.textMsg) {
				return;
			}
			let content = this.replaceEmoji(this.textMsg);
			// let msg = {text:content}

			this.sendMsg(content, 'text');
			this.textMsg = ''; //清空输入框
		},
		//替换表情符号为图片
		replaceEmoji(str) {
			let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
				console.log('item: ' + item);
				for (let i = 0; i < this.emojiList.length; i++) {
					let row = this.emojiList[i];
					for (let j = 0; j < row.length; j++) {
						let EM = row[j];
						if (EM.alt == item) {
							//在线表情路径，图文混排必须使用网络路径，请上传一份表情到你的服务器后再替换此路径
							//比如你上传服务器后，你的100.gif路径为https://www.xxx.com/emoji/100.gif 则替换onlinePath填写为https://www.xxx.com/emoji/
							let onlinePath = 'https://s2.ax1x.com/2019/04/12/';
							let imgstr = '<img src="' + onlinePath + this.onlineEmoji[EM.url] + '">';
							console.log('imgstr: ' + imgstr);
							return imgstr;
						}
					}
				}
			});
			return '<div style="display: flex;align-items: center;word-wrap:break-word;">' + replacedStr + '</div>';
		},

		// 发送消息
		sendMsg(content, type) {
			//实际应用中，此处应该提交长连接，模板仅做本地处理。
			var nowDate = new Date();
			let lastid = nowDate.getTime();
			// if (this.msgs.length == 0) {
			// 	lastid = 0;
			// } else {
			// 	lastid = this.msgs[this.msgs.length - 1].id;
			// }
			// lastid++;
			// let msg = {type:'user',msg:{id:lastid,time:nowDate.getHours()+":"+nowDate.getMinutes(),type:type,userinfo:{uid:0,username:"大黑哥",face:"/static/img/face.jpg"},content:content}}
			let msg = {
				isme: true,
				msg: content,
				type: type,
				isSys: false,
				id: lastid,
				time: nowDate.getHours() + ':' + nowDate.getMinutes(),
				img: {}
			};
			// console.log(this.msgs);
			// console.log('发送了消息：' + JSON.stringify(msg) + '消息id是' + msg.id);
			// 发送消息
			this.screenMsg(msg);
			// 定时器模拟对方回复,三秒
			// setTimeout(() => {
			// 	lastid = this.msgs[this.msgs.length - 1].id;
			// 	lastid++;
			// 	msg = {
			// 		isme: false,
			// 		msg: content,
			// 		type: type,
			// 		isSys: false,
			// 		id: lastid,
			// 		time: nowDate.getHours() + ':' + nowDate.getMinutes(),
			// 		img: {}
			// 	};
			// 	// 本地模拟发送消息
			// 	this.screenMsg(msg);
			// }, 3000);
		},

		// 添加文字消息到列表
		addTextMsg(msg) {
			let msgBody = JSON.parse(JSON.stringify(this.msgBody));
			msgBody.msgBody = msg.msg;
			msgBody.header.id = msg.id;
			msgBody.header.type = 'text';
			msgBody.sourceAccount = this.userName;
			this.socketTask.send({
				data: JSON.stringify(msgBody)
			});
			this.msgs.push(msg);
			this.jumpScroll();
		},

		app_voice(msg, type) {
			let that = this;
			let index = msg.url.lastIndexOf('.'); //获取图片地址最后一个点的位置
			let file_type = msg.url.substring(index + 1, msg.url.length); //截取图片类型如png jpg
			let file_yuanshi = msg.url.substring(0, index); //截取图片原始路径
			let d2 = new Date().getTime(); //时间戳
			plus.zip.compress(
				{
					src: url, //你要压缩的图片地址
					dst: file_yuanshi + d2 + '.' + file_type, //压缩之后的图片地址(注意压缩之后的路径最好和原生路径的位置一样，不然真机上报code-5)
					quality: 10 //[10-100]
				},
				function(e) {
					console.log('CompressFile success!', e.target);
					pathToBase64(e.target).then(base64 => {
						console.log(base64.length);
						// let msg = { url: path, base64: base64 };
						msg.base64 = base64;
						this.sendMsg(msg, type);
					});
				},
				function(error) {
					console.log('Compress error!');
					console.log(JSON.stringify(error));
				}
			);
		},
		// 添加语音消息到列表
		addVoiceMsg(msg) {
			let msgBody = JSON.parse(JSON.stringify(this.msgBody));
			msgBody.header.voiceLength = msg.voiceLength;
			msgBody.header.id = msg.id;
			msgBody.msgBody = msg.msg;
			msgBody.sourceAccount = this.userName;
			msgBody.header.type = 'voice';
			msg.msg = msg.url;
			// console.log('发送消息:' + JSON.stringify(msgBody));
			this.socketTask.send({
				data: JSON.stringify(msgBody)
			});
			// this.app_voice(msg,'voice');
			this.msgs.push(msg);
			this.jumpScroll();
		},
		// 添加图片消息到列表
		addImgMsg(msg) {
			let that = this;
			let msgBody = JSON.parse(JSON.stringify(this.msgBody));
			// let msg = {
			// 	isImg: true,
			// 	isme: true,
			// 	msg: base64,
			// 	type:'img'
			// };
			msgBody.header.id = msg.id;
			msgBody.msgBody = msg.msg;
			msgBody.sourceAccount = that.userName;
			msgBody.header.type = 'img';
			msgBody.header.imgw = msg.img.w;
			msgBody.header.imgh = msg.img.h;
			console.log(msg);
			that.socketTask.send({
				data: JSON.stringify(msgBody)
			});
			// that.msgs.push(msg);
			msg = this.setPicSize(msg);
			// this.msgImgList.push(msg.msg.content.url);
			this.msgs.push(msg);
			this.jumpScroll();
		},
		addRedEnvelopeMsg(msg) {
			msgBody.header.id = msg.id;
			msgBody.msgBody = msg.msg;
			msgBody.sourceAccount = that.userName;
			msgBody.header.type = 'voice';
			console.log(msg);
			that.socketTask.send({
				data: JSON.stringify(msgBody)
			});
			this.msgs.push(msg);
			this.jumpScroll();
		},
		// 添加系统文字消息到列表
		addSystemTextMsg(msg) {
			this.msgs.push(msg);
			this.jumpScroll();
		},
		// 添加系统红包消息到列表
		addSystemRedEnvelopeMsg(msg) {
			this.msgs.push(msg);
			this.jumpScroll();
		},
		// 打开红包
		openRedEnvelope(msg, index) {
			let rid = msg.content.rid;
			uni.showLoading({
				title: '加载中...'
			});
			console.log('index: ' + index);
			//模拟请求服务器效果
			setTimeout(() => {
				//加载数据
				if (rid == 0) {
					this.redenvelopeData = {
						rid: 0, //红包ID
						from: '大黑哥',
						face: '/static/img/im/face/face.jpg',
						blessing: '恭喜发财，大吉大利',
						money: '已领完'
					};
				} else {
					this.redenvelopeData = {
						rid: 1, //红包ID
						from: '售后客服008',
						face: '/static/img/im/face/face_2.jpg',
						blessing: '恭喜发财',
						money: '0.01'
					};
					// if(!msg.content.isReceived){
					// 	// {type:"system",msg:{id:8,type:"redEnvelope",content:{text:"你领取了售后客服008的红包"}}},
					// 	this.sendSystemMsg({text:"你领取了"+(msg.userinfo.uid==this.myuid?"自己":msg.userinfo.username)+"的红包"},'redEnvelope');
					// 	console.log("this.msgs[index]: " + JSON.stringify(this.msgs[index]));
					// 	this.msgs[index].msg.content.isReceived = true;
					// }
				}
				uni.hideLoading();
				this.windowsState = 'show';
			}, 200);
		},
		// 关闭红包弹窗
		closeRedEnvelope() {
			this.windowsState = 'hide';
			setTimeout(() => {
				this.windowsState = '';
			}, 200);
		},
		sendSystemMsg(content, type) {
			let lastid = this.msgs[this.msgs.length - 1].msg.id;
			lastid++;
			let row = { type: 'system', msg: { id: lastid, type: type, content: content } };
			this.screenMsg(row);
		},
		//领取详情
		toDetails(rid) {
			// uni.navigateTo({
			// 	url:'HM-details/HM-details?rid='+rid
			// })
			console.log('领取详情界面');
		},
		// 预览图片
		showPic(msg) {
			console.log(msg);
			uni.previewImage({
				indicator: 'none',
				current: 0,
				urls: [msg.msg]
			});
		},
		// 播放语音
		playVoice(msg) {
			console.log('即将播放录音：' + JSON.stringify(msg));
			this.playMsgid = msg.id;
			this.AUDIO.src = msg.msg;
			this.$nextTick(function() {
				this.AUDIO.play();
			});
		},
		// 录音开始
		voiceBegin(e) {
			if (e.touches.length > 1) {
				return;
			}
			this.initPoint.Y = e.touches[0].clientY;
			this.initPoint.identifier = e.touches[0].identifier;
			this.RECORDER.start({ format: 'mp3' }); //录音开始,
		},
		//录音开始UI效果
		recordBegin(e) {
			this.recording = true;
			this.voiceTis = '松开 结束';
			this.recordLength = 0;
			this.recordTimer = setInterval(() => {
				this.recordLength++;
			}, 1000);
		},
		// 录音被打断
		voiceCancel() {
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.willStop = true; //不发送录音
			this.RECORDER.stop(); //录音结束
		},
		// 录音中(判断是否触发上滑取消发送)
		voiceIng(e) {
			if (!this.recording) {
				return;
			}
			let touche = e.touches[0];
			//上滑一个导航栏的高度触发上滑取消发送
			if (this.initPoint.Y - touche.clientY >= uni.upx2px(100)) {
				this.willStop = true;
				this.recordTis = '松开手指 取消发送';
			} else {
				this.willStop = false;
				this.recordTis = '手指上滑 取消发送';
			}
		},
		// 结束录音
		voiceEnd(e) {
			if (!this.recording) {
				return;
			}
			this.recording = false;
			this.voiceTis = '按住 说话';
			this.recordTis = '手指上滑 取消发送';
			this.RECORDER.stop(); //录音结束
		},
		//录音结束(回调文件)
		recordEnd(e) {
			let that = this;
			clearInterval(this.recordTimer);
			if (!this.willStop) {
				console.log('e: ' + JSON.stringify(e));
				let msg = {
					voiceLength: 0,
					url: e.tempFilePath
				};

				let min = parseInt(this.recordLength / 60);
				let sec = this.recordLength % 60;
				min = min < 10 ? '0' + min : min;
				sec = sec < 10 ? '0' + sec : sec;
				msg.voiceLength = min + ':' + sec;
				pathToBase64(e.tempFilePath).then(base64 => {
					msg.base64 = base64;
					that.sendMsg(msg, 'voice');
				});
			} else {
				console.log('取消发送录音');
			}
			this.willStop = false;
		},
		// 切换语音/文字输入
		switchVoice() {
			this.hideDrawer();
			this.isVoice = this.isVoice ? false : true;
		},
		discard() {
			return;
		},
		jumpScroll() {
			let that = this;
			// console.log(that.msgs);
			if (!(that.msgs.length == 0)) {
				this.$nextTick(function() {
					// 滚动到底
					that.scrollToView = 'msg' + that.msgs[that.msgs.length - 1].id;
					console.log(that.scrollToView)
				});
			}
		}
	}
};
</script>
<style lang="scss">
@import '@/static/HM-chat/css/style.scss';

.u-card-wrap {
	background-color: $u-bg-color;
	padding: 1px;
}

.u-body-item {
	font-size: 32rpx;
	color: #333;
	padding: 20rpx 10rpx;
}

.u-body-item image {
	width: 120rpx;
	flex: 0 0 120rpx;
	height: 120rpx;
	border-radius: 8rpx;
	margin-left: 12rpx;
}
</style>
