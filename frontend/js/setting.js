mui.init({
	beforeback: function() {
		var list = plus.webview.currentWebview().opener();
		mui.fire(list, 'refresh');  
		return true;  
	}
});
mui.plusReady(function() {
	// plus.storage.clear();
	var colorMap = {
		"1": "#5F9EA0","2": "#2F4F4F","3": "#FF00FF","4": "#FAF0E6",
		"5": "#FFFFE0","6": "#FF4500","7": "#556B2F","8": "#FA8072",
		"9": "#8FBC8F","10": "#F0FFF0","11": "#7B68EE","12": "#FFFACD",
		"13": "#FFA07A","14": "#DAA520",
	}
	
	var setBarColor = function() {
		var domList = document.getElementsByClassName("mybar-title")
		
		for (var i=0; i<domList.length; i++) {
			domList[i].style.cssText="background-color: " + colorMap[plus.storage.getItem("background-style")] + ";"
		}
	}
	
	var showStorage = function() {
		console.log("-------------------------------------")
		console.log(plus.storage.getItem("spd"))
		console.log(plus.storage.getItem("pit"))
		console.log(plus.storage.getItem("vol"))
		console.log(plus.storage.getItem("per"))
		console.log(plus.storage.getItem("dev_pid"))
		console.log(plus.storage.getItem("avater-style"))
		console.log(plus.storage.getItem("robot-style"))
		console.log(plus.storage.getItem("background-style"))
		console.log("-------------------------------------")
	}
	var initSettingItem = function(key, value) {
		if (plus.storage.getItem(key) == null) {
			plus.storage.setItem(key, value)
		}
	}
	var initSetting = function() {
		initSettingItem("spd", "5")
		initSettingItem("pit", "5")
		initSettingItem("vol", "5")
		initSettingItem("per", "4")
		initSettingItem("dev_pid", "1536")
		initSettingItem("avater-style", "1")
		initSettingItem("robot-style", "1")
		initSettingItem("background-style", "1")
	}
	var doVoiceSetting = function(key) {
		var value = plus.storage.getItem(key)
		var id = key + ":" + value
		document.getElementById(id).getElementsByTagName("input")[0].checked = true
	}
	var doStyleSetting = function(key, folderName) {
		var list = document.getElementsByClassName(key)
		for (var i = 0; i < list.length; i++) {
			var id = list[i].id.split(":")[1]
			list[i].src = "./images/" + folderName + "/" + id + ".jpg"
		}
		var trueId = parseInt(plus.storage.getItem(key), 10)

		list[trueId - 1].src = "./images/" + folderName + "/" + trueId + "-s.jpg"
	}
	var doSetting = function() {
		doVoiceSetting("spd")
		doVoiceSetting("pit")
		doVoiceSetting("vol")
		doVoiceSetting("per")
		doVoiceSetting("dev_pid")
		doStyleSetting("avater-style", "avaters")
		doStyleSetting("robot-style", "robots")
		doStyleSetting("background-style", "background")
	}
	mui(".reset").on("tap", "span", function() {
		plus.storage.setItem("spd", "5")
		plus.storage.setItem("pit", "5")
		plus.storage.setItem("vol", "5")
		plus.storage.setItem("per", "4")
		plus.storage.setItem("dev_pid", "1536")
		plus.storage.setItem("avater-style", "1")
		plus.storage.setItem("robot-style", "2")
		plus.storage.setItem("background-style", "3")
		doSetting()
		mui.toast('已重置App设置')
	});
	mui(".delete").on("tap", "span", function() {
		plus.storage.removeItem("history")
		mui.toast('已清除聊天记录')
	});
	mui(".voice-setting").on("tap", ".mui-radio", function() {
		var kv = this.id.split(":")
		plus.storage.setItem(kv[0], kv[1])
	});
	mui(".avater-style-setting").on("tap", "img", function() {
		var index = this.id.split(":")[1]
		var par = this.parentNode.parentNode
		var list = par.getElementsByTagName("img")
		for (var i = 0; i < list.length; i++) {
			list[i].src = "./images/avaters/" + (i + 1) + ".jpg"
		}
		this.src = "./images/avaters/" + index + "-s.jpg"
		plus.storage.setItem("avater-style", index)
	});
	mui(".robot-style-setting").on("tap", "img", function() {
		var index = this.id.split(":")[1]
		var par = this.parentNode.parentNode
		var list = par.getElementsByTagName("img")
		for (var i = 0; i < list.length; i++) {
			list[i].src = "./images/robots/" + (i + 1) + ".jpg"
		}
		this.src = "./images/robots/" + index + "-s.jpg"
		plus.storage.setItem("robot-style", index)
	});
	mui(".background-style-setting").on("tap", "img", function() {
		var index = this.id.split(":")[1]
		var par = this.parentNode.parentNode
		var list = par.getElementsByTagName("img")
		for (var i = 0; i < list.length; i++) {
			list[i].src = "./images/background/" + (i + 1) + ".jpg"
		}
		this.src = "./images/background/" + index + "-s.jpg"
		plus.storage.setItem("background-style", index)
		
		setBarColor();
	});

	initSetting()
	doSetting()
	setBarColor();
})