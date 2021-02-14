let mask = document.querySelector(".mask");
let fileDom = document.querySelector(".file");
let tis = document.querySelector(".tis");
let progress = document.querySelector(".tis-progress");
let cancel = document.querySelector(".cancel-btn");


let createUpload = (file, url, key = 'file', header = {}, data = {}) => {
	console.log(`
	上传地址:${url}\n
	请求头:${JSON.stringify(header)}\n
	参数:${JSON.stringify(data)}
	`);
	if (!url) {
		return;
	}
	tis.style.display = 'flex';

	let formData = new FormData();
	formData.append(key, file);

	for (let keys in data) {
		formData.append(keys, data[keys]);
	}

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);

	for (let keys in header) {
		xhr.setRequestHeader(keys, header[keys]);
	}
	xhr.upload.addEventListener("progress", function(event) {
		if (event.lengthComputable) {
			let percent = Math.ceil(event.loaded * 100 / event.total) + "%";
			progress.innerText = `努力上传中..${percent}`;
		}
	}, false);

	xhr.ontimeout = function() {
		// xhr请求超时事件处理
		progress.innerText = '请求超时';
		setTimeout(() => {
			tis.style.display = 'none';
			plus.webview.currentWebview().close();
		}, 1000);
	};

	xhr.onreadystatechange = (ev) => {

		if (xhr.readyState == 4) {
			console.log('status：' + xhr.status);

			if (xhr.status == 200) {
				progress.innerText = '上传成功';
				console.log('返回数据：' + xhr.responseText);
				location.href = `callback?fileName=${escape(file.name)}&id=${escape(xhr.responseText)}`;
			} else {
				progress.innerText = '上传失败了';
			}

			setTimeout(() => {
				tis.style.display = 'none';
				plus.webview.currentWebview().close();
			}, 1000);

		}
	};
	xhr.send(formData);

	cancel.addEventListener("click", () => {
		xhr.abort();
		plus.webview.currentWebview().close();
	});
}


mask.addEventListener("click", () => {
	plus.webview.currentWebview().close();
});

document.addEventListener('UniAppJSBridgeReady', () => {
	let {
		url,
		key,
		header,
		formData
	} = plus.webview.currentWebview();
	console.log('打印formdata')
	console.log(JSON.stringify(formData))
	fileDom.addEventListener('change', (event) => {
		let file = fileDom.files[0];
		if (file) {
			var reader = new FileReader();
			reader.onload = function(event) {
				var txt = event.target.result;
				console.log("文件datautl是")
				console.log(txt)
			};
		}
		reader.readAsDataURL(file);

		if (file.size > (1024 * 1024 * 100)) {
			plus.nativeUI.toast('单个文件请勿超过100M,请重新上传');
			return;
		}
		createUpload(file, url, key, header, formData);
	}, false);
});
