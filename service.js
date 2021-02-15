import request from './request/request.js'
// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';

const login = function(data) {
	return request.post("pjm-service-user/user/login", data).then(res => {
		if (res && res.data.code == 200) {
			console.log(res.data.msg)
			uni.setStorageSync("Authorization", res.data.msg)
			return res.data
		} else {
			uni.showModal({
				title: '登录失败!',
				content: res.data.msg
			})
		}
	})
}
const detailUserInfo = function(account) {
	let param = {
		userAccount: account
	}
	return request.post4Token("pjm-service-user/user/details", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const detailsGroup=function(id){
	
	return request.get4Token("pjm-service-user/userGroupInfo/details/" + id).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const userList = function(key) {
	return request.get4Token("pjm-service-user/user/searchList/" + key).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const request2AddFriends = function(id) {
	return request.post4Token("pjm-service-user/userFriendShip/request2AddFriends/", {
		friendUserId: id
	}).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const applicationJoinGroup=function(id){
	return request.post4Token("pjm-service-user/userGroupMemberInfo/applicationJoinGroup/", {
		userGroupId: id
	}).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const applyPeopleList = function() {
	return request.get4Token("pjm-service-user/userFriendShip/applyList/").then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}

const applyGroupList = function() {
	return request.get4Token("pjm-service-user/userGroupMemberInfo/getTheReviewListOfGroupMembershipApplicationRelatedToMe/").then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const agree2JoinGroup = function(id,memberId) {
	let params={
		id:id,
		userGroupMemberId:memberId
	}
	return request.post4Token("pjm-service-user/userGroupMemberInfo/agree2JoinGroup/",params).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const friendList = function() {
	//不分页
	let param = {
		pageNum: 0,
		pageSize: 0
	}
	return request.post4Token("pjm-service-user/userFriendShip/friendList", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const groupList = function() {
	//不分页
	let param = {
		pageNum: 0,
		pageSize: 0
	}
	return request.post4Token("pjm-service-user/userGroupInfo/listGroup", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const getOfflineMsgList = function() {
	return request.get4Token("pjm-service-user/im/getOfflineMsgList/").then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const my_circle_of_firend_list = function(param) {
	return request.post4Token("pjm-service-circleoffriend/circleOfFriendsInfo/getList", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const detailCircleOfFriendInfo = function(id) {
	return request.get4Token("pjm-service-circleoffriend/circleOfFriendsInfo/detail/" + id).then(res => {

		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const addCircleCommont = function(param) {
	return request.post4Token("pjm-service-circleoffriend/circleOfFriendsComment/insert", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const deleteCircleCommont = function(id) {
	return request.get4Token("pjm-service-circleoffriend/circleOfFriendsComment/delete/" + id).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const addCircleOfFriendInfo = function(textContent, picPath) {
	let param = {
		textContent: textContent,
		picPath: picPath
	}
	return request.post4Token("pjm-service-circleoffriend/circleOfFriendsInfo/insert", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const batchUploadFile = function(files) {
	let imgs = files.map((value, index) => {
		return {
			name: "files",
			uri: value
		}
	})
	console.log(imgs)
	return uni.uploadFile({
		url: 'http://47.94.233.146:1220/pjm-service-nacos/file/uploadFiles', //仅为示例，非真实的接口地址
		files: imgs
		// success: (uploadFileRes) => {
		// 	console.log(uploadFileRes.data);
		// },
		// fail: res => {
		// 	console.log(res);
		// }
	});
}
const uploadPhoneFile = function(path) {
	return uni.uploadFile({
		url: 'http://47.94.233.146:1220/pjm-service-nacos/file/uploadFile4FileInfo',
		filePath: path,
		name: 'file',
		header: {
			// 'content-type': 'multipart/form-data'
			Authorization:uni.getStorageSync("Authorization")
		}
		// success: uploadFileRes => {
		// 	let res = JSON.parse(uploadFileRes.data)
		// 	console.log(res);
		// 	paths.push(res.msg + ';')
		// 	if (i < infos.length - 1) {
		// 		uploadFile(infos, i + 1, paths)
		// 	}
		// },
		// fail: res => {
		// 	console.log(res);
		// }
	});
}
const addGroup=function(param){
	return request.post4Token("pjm-service-user/userGroupInfo/insert", param).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
}
const findGroupList=function(searchkey){
	return request.get4Token("pjm-service-user/userGroupInfo/findGroupList/" + searchkey).then(res => {
		console.log(res)
		if (res && res.data.code == 200) {
			console.log(res)
			return res.data
		} else {
			console.log("出现异常")
		}
	})
	
}
const getNearbyPeopleByLoc=function(loc){
	let params={
		loc:loc
	}
	return request.post4Token("pjm-service-nacos/mongo/nearPropleByLbs", params).then(res => {
		console.log(res)
		return res.data
	})
}
const updateMyself=function(params){
	return request.post4Token("pjm-service-user/user/updateMySelf", params).then(res => {
		console.log(res)
		return res.data
	})
}
export default {
	userList,
	detailUserInfo,
	login,
	friendList,
	groupList,
	request2AddFriends,
	applyPeopleList,
	applyGroupList,
	getOfflineMsgList,
	my_circle_of_firend_list,
	detailCircleOfFriendInfo,
	addCircleCommont,
	deleteCircleCommont,
	uploadPhoneFile,
	addCircleOfFriendInfo,
	batchUploadFile,
	addGroup,
	findGroupList,
	getNearbyPeopleByLoc,
	updateMyself,
	agree2JoinGroup,
	detailsGroup,
	applicationJoinGroup
}
