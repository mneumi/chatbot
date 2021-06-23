const API_URL = 'http://chatbot.mneumi.cn:33333';
const API_WORD = API_URL + "/api/v1/word";
const API_VOICE = API_URL + "/api/v1/voice"

function index($, doc) {
	var MIN_SOUND_TIME = 800;
	$.init({
		gestureConfig: {
			tap: true,
			doubletap: true,
			longtap: true,
			swipe: true,
			drag: true,
			hold: true,
			release: true,
		},
	});
	template.config('escape', false);
	if (mui.os.ios) {
		document.addEventListener('DOMContentLoaded', function() {
			var footerDom = document.querySelector('footer');

			document.addEventListener('focusin', function() {
				footerDom.style.position = 'absolute';
			});
			document.addEventListener('focusout', function() {
				footerDom.style.position = 'fixed';
			});
		});
	}
	$.plusReady(function() {
		var setting = {}
		var record = {}
		
		var initSetting = function() { // ^初始化设置^
			initSettingItem("spd", "5")
			initSettingItem("pit", "5")
			initSettingItem("vol", "5")
			initSettingItem("per", "4")
			initSettingItem("dev_pid", "1536")
			initSettingItem("avater-style", "1")
			initSettingItem("robot-style", "1")
			initSettingItem("background-style", "1")
		}
		var initSettingItem = function(key, value) { // ^初始化设置项^
			if (plus.storage.getItem(key) == null) {
				plus.storage.setItem(key, value)
			}
		}
		var updateSetting = function() { // ^更新设置信息^
			setting.spd = plus.storage.getItem("spd")
			setting.pit = plus.storage.getItem("pit")
			setting.vol = plus.storage.getItem("vol")
			setting.per = plus.storage.getItem("per")
			setting.dev_id = plus.storage.getItem("dev_pid")
			setting.avater_style = plus.storage.getItem("avater-style")
			setting.robot_style = plus.storage.getItem("robot-style")
			setting.background_style = plus.storage.getItem("background-style")
		}
		var updateHistory = function() { // ^更新聊天记录^
			if (plus.storage.getItem("history")) {
				record = JSON.parse(plus.storage.getItem("history"))
			} else {
				record = [{
					sender: 'zs',
					type: 'text',
					content: 'Hi，我是 LIZ 聊天机器人！'
				}];
			}
		}
		var updateBackground = function() { // ^更新聊天背景^
			var colorMap = {
				"1": "#5F9EA0","2": "#2F4F4F","3": "#FF00FF","4": "#FAF0E6",
				"5": "#FFFFE0","6": "#FF4500","7": "#556B2F","8": "#FA8072",
				"9": "#8FBC8F","10": "#F0FFF0","11": "#7B68EE","12": "#FFFACD",
				"13": "#FFA07A","14": "#DAA520",
			}
			var mc = document.getElementById("main-content")
			mc.style.cssText = "background-color: " + colorMap[setting.background_style] + ";";
		}
		
		initSetting()
		updateHistory();
		updateSetting();
		updateBackground();

		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize"
		});
		var showKeyboard = function() {
			if ($.os.ios) {
				var webView = plus.webview.currentWebview().nativeInstanceObject();
				webView.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
			} else {
				var Context = plus.android.importClass("android.content.Context");
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
			}
		};
		var ui = {
			body: doc.querySelector('body'),
			footer: doc.querySelector('footer'),
			footerRight: doc.querySelector('.footer-right'),
			footerLeft: doc.querySelector('.footer-left'),
			btnMsgType: doc.querySelector('#msg-type'),
			boxMsgText: doc.querySelector('#msg-text'),
			boxMsgSound: doc.querySelector('#msg-sound'),
			btnMsgImage: doc.querySelector('#msg-image'),
			areaMsgList: doc.querySelector('#msg-list'),
			boxSoundAlert: doc.querySelector('#sound-alert'),
			h: doc.querySelector('#h'),
			content: doc.querySelector('.mui-content')
		};
		ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
		var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
		var msgItemTap = function(msgItem, event) {
			var msgType = msgItem.getAttribute('msg-type');
			var msgContent = msgItem.getAttribute('msg-content')
			if (msgType == 'sound') {
				player = plus.audio.createPlayer(msgContent);
				var playState = msgItem.querySelector('.play-state');
				playState.innerText = '正在播放...';
				player.play(function() {
					playState.innerText = '点击播放';
				}, function(e) {
					playState.innerText = '点击播放';
				});
			}
		};
		var imageViewer = new $.ImageViewer('.msg-content-image', {
			dbl: false
		});
		var bindMsgList = function() { // bindMsgList
			ui.areaMsgList.innerHTML = template('msg-template', {
				"record": record,
				"avater_style": setting.avater_style,
				"robot_style": setting.robot_style,
			});
			var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
			[].forEach.call(msgItems, function(item, index) {
				item.addEventListener('tap', function(event) {
					msgItemTap(item, event);
				}, false);
			});
			imageViewer.findAllImage();
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
		};
		bindMsgList();
		window.addEventListener('resize', function() {
			ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
		}, false);
		window.addEventListener('refresh', function(e) {
			location.reload();
		})
		function msgTextFocus() {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
		ui.footerRight.addEventListener('touchstart', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		ui.footerRight.addEventListener('touchmove', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		ui.footerRight.addEventListener('release', function(event) {
			if (ui.btnMsgType.classList.contains('mui-icon-paperplane')) {
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
				sendWord({
					sender: 'self',
					type: 'text',
					content: ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>')
				});
				ui.boxMsgText.value = '';
				$.trigger(ui.boxMsgText, 'input', null);
			} else if (ui.btnMsgType.classList.contains('mui-icon-mic')) {
				ui.btnMsgType.classList.add('mui-icon-compose');
				ui.btnMsgType.classList.remove('mui-icon-mic');
				ui.boxMsgText.style.display = 'none';
				ui.boxMsgSound.style.display = 'block';
				ui.boxMsgText.blur();
				document.body.focus();
			} else if (ui.btnMsgType.classList.contains('mui-icon-compose')) {
				ui.btnMsgType.classList.add('mui-icon-mic');
				ui.btnMsgType.classList.remove('mui-icon-compose');
				ui.boxMsgSound.style.display = 'none';
				ui.boxMsgText.style.display = 'block';
				ui.boxMsgText.focus();
				setTimeout(function() {
					ui.boxMsgText.focus();
				}, 150);
			}
		}, false);
		var setSoundAlertVisable = function(show) {
			if (show) {
				ui.boxSoundAlert.style.display = 'block';
				ui.boxSoundAlert.style.opacity = 1;
			} else {
				ui.boxSoundAlert.style.opacity = 0;
				setTimeout(function() {
					ui.boxSoundAlert.style.display = 'none';
				}, 200);
			}
		};
		var recordCancel = false;
		var recorder = null;
		var audio_tips = document.getElementById("audio_tips");
		var startTimestamp = null;
		var stopTimestamp = null;
		var stopTimer = null;
		ui.body.addEventListener('drag', function(event) {
			if (Math.abs(event.detail.deltaY) > 50) {
				if (!recordCancel) {
					recordCancel = true;
					if (!audio_tips.classList.contains("cancel")) {
						audio_tips.classList.add("cancel");
					}
					audio_tips.innerHTML = "松开手指，取消发送";
				}
			} else {
				if (recordCancel) {
					recordCancel = false;
					if (audio_tips.classList.contains("cancel")) {
						audio_tips.classList.remove("cancel");
					}
					audio_tips.innerHTML = "手指上划，取消发送";
				}
			}
		}, false);
		ui.boxMsgSound.addEventListener('release', function(event) {
			if (audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
				audio_tips.innerHTML = "手指上划，取消发送";
			}
			stopTimestamp = (new Date()).getTime();
			if (stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
				audio_tips.innerHTML = "录音时间太短";
				ui.boxSoundAlert.classList.add('rprogress-sigh');
				recordCancel = true;
				stopTimer = setTimeout(function() {
					setSoundAlertVisable(false);
				}, 800);
			} else {
				setSoundAlertVisable(false);
			}
			recorder.stop();
		}, false);
		ui.boxMsgSound.addEventListener("touchstart", function(e) {
			e.preventDefault();
		});
		ui.boxMsgText.addEventListener('input', function(event) {
			ui.btnMsgType.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
			ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
			ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
			ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
			ui.content.style.paddingBottom = ui.footer.style.height;
		});
		var focus = false;
		ui.boxMsgText.addEventListener('tap', function(event) {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 0);
			focus = true;
			setTimeout(function() {
				focus = false;
			}, 1000);
			event.detail.gesture.preventDefault();
		}, false);
		ui.areaMsgList.addEventListener('click', function(event) {
			if (!focus) {
				ui.boxMsgText.blur();
			}
		})


		var sendWord = function(msg) { // ^发送文字聊天信息^
			record.push(msg);
			bindMsgList();
			toRobot(msg.content);
			plus.storage.setItem("history", JSON.stringify(record))
		};
		var sendVoice = function(msg) { // ^发送语音聊天信息^
			record.push(msg);
			bindMsgList();
			plus.storage.setItem("history", JSON.stringify(record))
		};
		var toRobot = function(info) { // ^发送聊天信息^
			var apiUrl = API_WORD;
			mui.ajax(apiUrl, {
				data: {
					"info": info,
					"cuid": plus.device.uuid,
					"spd": setting.spd,
					"pit": setting.pit,
					"vol": setting.vol,
					"per": setting.per,
				},
				dataType: 'json',
				type: 'post',
				timeout: 5000,
				success: function(data) {
					record.push({
						sender: 'zs',
						type: 'text',
						content: data.nlp
					});
					bindMsgList();
					plus.storage.setItem("history", JSON.stringify(record));
				},
				error: function(xhr, type, errorThrown) {
					record.push({
						sender: 'zs',
						type: 'text',
						content: "不好意思，我没听懂。。"
					});
					bindMsgList();
					plus.storage.setItem("history", JSON.stringify(record));
				},
			});
		};
		var doUpload = function(uploadFilePath) { // ^上传文件^
			var result = "";
			var task = plus.uploader.createUpload(API_VOICE, {
					method: "POST",
					blocksize: 204800,
					priority: 100,
				},
				function(t, status) {

					if (status != 200) {
						result = "语音上传失败"
					} else {
						result = t.responseText
					}

					sendVoice({
						sender: 'zs',
						type: 'text',
						content: result,
					});
				}
			);
			task.addFile(uploadFilePath, {
				key: "file"
			});
			task.addData("cuid", plus.device.uuid)
			task.addData("dev_pid", setting.dev_id)
			task.addData("spd", setting.spd)
			task.addData("pit", setting.pit)
			task.addData("vol", setting.vol)
			task.addData("per", setting.per)
			task.start();

			return result;
		}
		ui.boxMsgSound.addEventListener('hold', function(event) { // ^进行录音^
			recordCancel = false;
			if (stopTimer) clearTimeout(stopTimer);
			audio_tips.innerHTML = "手指上划，取消发送";
			ui.boxSoundAlert.classList.remove('rprogress-sigh');
			setSoundAlertVisable(true);
			recorder = plus.audio.getRecorder();
			if (recorder == null) {
				plus.nativeUI.toast("不能获取录音对象");
				return;
			}
			startTimestamp = (new Date()).getTime().toString();
			recorder.record({
				filename: "_doc/audio/" + startTimestamp,
			}, function(path) {
				if (recordCancel) return;
				sendVoice({
					sender: 'self',
					type: 'sound',
					content: path
				});
				doUpload(path);
			}, function(e) {
				plus.nativeUI.toast("录音时出现异常: " + e.message);
			});
		}, false);
		ui.footerLeft.addEventListener('tap', function(event) { // ^跳转到设置页面^
			console.log('jumping');
			mui.openWindow({
				url: './setting.html',
				id: 'setting.html'
			});
		}, false);
	});
}