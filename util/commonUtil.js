import {
	pathToBase64,
	base64ToPath
} from '../js_sdk/gsq-image-tools/image-tools/index.js'
export default {
	setItem(key, value) {
		uni.setStorage({
			key: key,
			data: value
		})
	},
	getItem(key, data) {
		uni.getStorage({
			key: key,
			success: function(res) {
				data = res
			}
		}).then()
	},
	swapItems(arr, index1, index2) {
		arr.unshift(arr[index1]);
		arr.splice(index1 + 1, 1);
		return arr;
	},
	redirectTo(url) {
		let token = uni.getStorageSync("Authorization")
		if (!token) {
			console.log('请重新登录：' + token)
			uni.showToast({
				title: 'redirected，请重试'
			}).then(res => {
				uni.redirectTo({
					url: '../login/login'
				})
			})
		}
		console.log(token)
		uni.redirectTo({
			url: url
		})
	},
	navigateTo(url) {
		let token = uni.getStorageSync("Authorization")
		if (!token) {
			console.log('token不存在navvicate：' + token)
			uni.showToast({
				title: '请重新登录'
			}).then(res => {
				uni.redirectTo({
					url: '../login/login'
				})
			})
		}
		uni.navigateTo({
			url: url,
			animationDuration:1000,
			animationType:'pop-in'
		})
	},
	reLaunch(url) {
		let token = uni.getStorageSync("Authorization")
		if (!token) {
			console.log('token不存在launch：' + token)
			uni.showToast({
				title: '请重新登录'
			}).then(res => {
				uni.redirectTo({
					url: '../login/login'
				})
			})
		}
		console.log(token)
		uni.reLaunch({
			url:url
		})
	},
	//文件的写入操作传入要写入文件名，base64
	lzFileWriter(base64, fileName) {
		return new Promise((result, reject) => {
			// PRIVATE_WWW：本地文件系统常量，Number类型，固定值1。应用运行资源目录，仅本应用可访问。 为了确保应用资源的安全性，此目录只可读。
			// PRIVATE_DOC 本地文件系统常量，Number类型，固定值2。应用私有文档目录，仅本应用可读写。
			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
				// plus.io.requestFileSystem('_doc/uniapp_temp_1609049050292/recorder/', function(fs) {
				/*
				fs.root是根目录操作对象DirectoryEntry
				getFile(path,flag,succesCB,errorCB)创建或打开文件
					path: ( DOMString ) 必选 要操作文件相对于当前目录的地址
					flag: ( Flags ) 可选 要操作文件或目录的参数 create: (Boolean 类型 )是否创建对象标记 指示如果文件或目录不存在时是否进行创建，默认值为false
					succesCB: ( EntrySuccessCallback ) 可选 创建或打开文件成功的回调函数
					errorCB: ( FileErrorCallback ) 可选 创建或打开文件失败的回调函数
				*/
				// 创建或打开文件
				fs.root.getFile(fileName, {
					create: true
				}, function(fileEntry) {
					// 获得平台绝对路径    
					var fullPath = fileEntry.fullPath;
					console.log('平台绝对路径', fullPath);
					// 引入安卓原生类
					var Base64 = plus.android.importClass("java.util.Base64");
					var FileOutputStream = plus.android.importClass("java.io.FileOutputStream");
					//如果文件不存在则创建文件，如果文件存在则删除文件后重新创建文件
					var out = new FileOutputStream(fullPath);
					/**
					 * 此处需要把base64前缀去除，在写入字节流数组
					 * 去除头部data:image/jpg;base64,留下base64编码后的字符串
					 **/
					// console.log("切割前的base64："+base64)
					let base64Str = base64.replace(/^data:\S+\/\S+;base64,/, '')
					// console.log("切割后的base64" + base64Str)
					//base64解密得到字节流bytes
					var bytes = Base64.getDecoder().decode(base64Str);
					try {
						console.log(bytes.length);
						out.write(bytes); // byte 数组写入此文件输出流中。
						out.flush(); //刷新写入文件中去。
						out.close(); //关闭此文件输出流并释放与此流有关的所有系统资源。
						result("_doc/"+fileName)
					} catch (e) {
						console.log(e.message);
						reject(e.message)
					}
				});
			});
		})
	},
	app_img(num, rem) {
		let that = this
		let index = rem.tempFiles[num].path.lastIndexOf("."); //获取图片地址最后一个点的位置  
		let img_type = rem.tempFiles[num].path.substring(index + 1, rem.tempFiles[num].path.length); //截取图片类型如png jpg
		let img_yuanshi = rem.tempFiles[num].path.substring(0, index); //截取图片原始路径
		let d2 = new Date().getTime(); //时间戳
		//压缩图片
		plus.zip.compressImage({
				src: rem.tempFiles[num].path, //你要压缩的图片地址
				dst: img_yuanshi + d2 + '.' + img_type, //压缩之后的图片地址(注意压缩之后的路径最好和原生路径的位置一样，不然真机上报code-5)
				quality: 10 //[10-100]
			},
			function(e) {
				console.log("Compress success!", e.target);
				pathToBase64(e.target).then(base64 => {
					console.log(base64.length)
				})
				var pathArray = []
				pathArray.push(e.target)
				// uni.previewImage({
				// 	current:0,
				// 	urls:pathArray
				// })
				//利用递归循环来实现多张图片压缩
				if (num == rem.tempFiles.length - 1) {
					return
				} else {
					that.app_img(num + 1, rem)
				}
				console.log('end', that.materialList)
			},
			function(error) {
				console.log("Compress error!");
				console.log(JSON.stringify(error));
			}
		);
	}

}
