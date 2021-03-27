// let baseUrl='http://www.becomeagoodboy.top:1211'

// #ifdef H5
var baseUrl = ''
// #endif
// #ifdef APP-PLUS
var baseUrl = 'http://47.94.233.146:1220/'
// #endif
// var baseUrl = 'http://47.94.233.146:1220/'
// let baseUrl='http://127.0.0.1:1211'
const post4Token = function(url, params) {
	let token = uni.getStorageSync("Authorization")
	if (token == undefined || token == '' || token == null) {
		uni.showModal({
			title: '未登录!',
			content: 'error'
		})
		return;
	}
	console.log('调用post4token：' + token)
	return uni.request({
		url: baseUrl + url,
		data: params,
		method: 'POST',
		header: {
			"Authorization": token,
			"Content-Type": "application/json"
		}
	}).then(res=>{
		console.log("打印request.js的返回值")
		console.log(res)
		res = res.filter(item => item != null)[0]
		if(res.data.code!=200){
			throw '非法请求:'+res.data.msg
		}
		return res;
	})
}

const post = function(url, params) {
	let token = uni.getStorageSync("Authorization")
	return uni.request({
		url: baseUrl + url,
		data: params,
		method: 'POST',
		// responseType:'json',
		header: {
			"Content-Type": "application/json"
		}
	}).then(res=>{
		console.log("打印request.js的返回值")
		console.log(res)
		res = res.filter(item => item != null)[0]
		if(res.data.code!=200){
			throw '非法请求:'+res.data.msg
		}
		return res;
	})
}
const get4Token = function(url) {
	let token = uni.getStorageSync("Authorization")
	if (token == undefined || token == '' || token == null) {
		uni.showModal({
			title: '未登录!',
			content: 'error'
		})
		return;
	}
	return uni.request({
		url: baseUrl + url,
		responseType: 'json',
		method: 'GET',
		header: {
			"Authorization": token
		}
	}).then(res=>{
		console.log("打印request.js的返回值")
		console.log(res)
		res = res.filter(item => item != null)[0]
		if(res.data.code!=200){
			throw '非法请求:'+res.data.msg
		}
		return res;
	})
}

export default {
	post,
	post4Token,
	get4Token
}
