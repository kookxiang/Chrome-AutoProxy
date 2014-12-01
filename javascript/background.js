var blockedSite = [
	'www.google.com',
	'www.google.com.hk',
	'accounts.google.com',
	'mail.google.com',
	'chrome.google.com',
	'plus.google.com',
	'ssl.gstatic.com',
	'www.gstatic.com',
	'twitter.com',
	'www.facebook.com',
];
var setting;
var proxyMode = 0;
if(localStorage['setting']){
	setting = JSON.parse(localStorage['setting']);
}else{
	setting = {};
	localStorage['setting'] = '{}';
}
if(typeof setting.proxy == 'undefined')						setting.proxy = 'SOCKS5 127.0.0.1:1080';
if(typeof setting.SET_ON_QUICERROR == 'undefined')			setting.SET_ON_QUICERROR = true;
if(typeof setting.SET_ON_RESET == 'undefined')				setting.SET_ON_RESET = true;
if(typeof setting.SET_ON_TIMED_OUT == 'undefined')			setting.SET_ON_TIMED_OUT = true;
if(typeof setting.SET_ON_EMPTY == 'undefined')				setting.SET_ON_EMPTY = false;
if(typeof setting.SET_ON_REFUSED == 'undefined')			setting.SET_ON_REFUSED = false;
if(typeof setting.SET_ON_ABORTED == 'undefined')			setting.SET_ON_ABORTED = false;
if(typeof setting.YOUKU_NOAD_FIX == 'undefined')			setting.YOUKU_NOAD_FIX = true;

function onReceivedMessage(message, sender, sendResponse){
	if(typeof message == 'object'){
		messageObj = message;
		message = messageObj.msg;
	}
	switch(message){
		default:
			console.log('Unknown message: ' + message);
			return;
		case 1:
		case "getSetting":
			sendResponse(setting);
			return;
		case 2:
		case "saveSetting":
			setting = messageObj.data;
			reloadMatchErrorList();
			generatePac();
			setProxy();
			localStorage.setItem('setting', JSON.stringify(setting));
			sendResponse();
			return;
		case 11:
		case "getBlockedSite":
			sendResponse(blockedSite);
			return;
		case 12:
		case "addBlockedSite":
			addToSiteList(messageObj);
			sendResponse();
			return;
		case 21:
		case "refreshPac":
			generatePac();
			setProxy();
			sendResponse();
			return;
		case 31:
		case "setProxyMode":
			proxyMode = messageObj.mode;
			setProxy();
			sendResponse();
			return;
		case 32:
		case "getProxyMode":
			sendResponse(proxyMode);
			return;
	}
}
chrome.runtime.onMessage.addListener(onReceivedMessage);
function addToSiteList(site){
	var host = site.host;
	if(!host) return;
	if(inArray(host, blockedSite)) return;
	blockedSite.push(host);
	generatePac();
	setProxy();
}