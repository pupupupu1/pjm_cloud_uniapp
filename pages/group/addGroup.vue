<template>
	<view>
		<u-form style="margin-left: 30rpx;" label-width="150rpx" :label-style="'font-size:40rpx'">
			<u-form-item><text style="font-size: 60rpx;">群聊名称和群聊头像</text></u-form-item>
			<u-form-item label="群聊名称:"><u-input placeholder="输入群组名称" v-model="form.userGroupName" /></u-form-item>
			<u-form-item label="群号码:"><u-input placeholder="输入群组号码(数字)" v-model="form.userGroupNumber" /></u-form-item>
			<u-form-item label="群聊头像:">
				<u-upload ref="uUpload" @on-remove="removePic" :action="action" @on-change="onChange" :auto-upload="true" max-count="1"></u-upload>
			</u-form-item>
		</u-form>
		<u-button type="primary" @click="addGroup">创建</u-button>
	</view>
</template>

<script>
import service from '../../service.js';
import commonUtil from '../../util/commonUtil.js';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			form: {
				userGroupName: '',
				userGroupName:'',
				userGroupAvatarPath: ''
			},
			action: 'http://47.94.233.146:1220/pjm-service-nacos/file/uploadFile'
		};
	},
	methods: {
		...mapMutations(['setGroupList']),
		onChange(res, index, lists, name) {
			let data = JSON.parse(res.data);
			if (data && data.code == 200) {
				this.form.userGroupAvatarPath = data.data;
			}
		},
		removePic() {
			this.form.userGroupAvatarPath = '';
		},
		addGroup() {
			service.addGroup(this.form).then(res => {
				service.groupList().then(res=>{
					this.setGroupList(res.data.list)
				})
				commonUtil.reLaunch('../friendShip/friendShip');
			});
		}
	}
};
</script>

<style></style>
