var blockedSite = [
	'www.google.com',
	'www.google.com.hk',
	'accounts.google.com',
	'myaccount.google.com',
	'mail.google.com',
	'inbox.google.com',
	'chrome.google.com',
	'plus.google.com',
	'ssl.gstatic.com',
	'www.gstatic.com',
	'twitter.com',
	'www.facebook.com',
];
var blacklistSite = [], whitelistSite = [];
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
		case "getSetting":
			sendResponse(setting);
			return;
		case "saveSetting":
			setting = messageObj.data;
			reloadMatchErrorList();
			generatePac();
			setProxy();
			localStorage.setItem('setting', JSON.stringify(setting));
			sendResponse();
			return;
		case "getBlockedSite":
			sendResponse(blockedSite);
			return;
		case "getWhiteListSite":
			sendResponse(whitelistSite);
			return;
		case "getBlackListSite":
			sendResponse(blacklistSite);
			return;
		case "addBlockedSite":
			addToSiteList(messageObj.host);
			sendResponse();
			return;
		case "removeBlockedSite":
			removeFromSiteList(messageObj.host);
			sendResponse();
			return;
		case "refreshPac":
			generatePac();
			setProxy();
			sendResponse();
			return;
		case "setProxyMode":
			proxyMode = messageObj.mode;
			setProxy();
			sendResponse();
			return;
		case "getProxyMode":
			sendResponse(proxyMode);
			return;
	}
}
chrome.runtime.onMessage.addListener(onReceivedMessage);
proxyDatabase.open();
proxyDatabase.onsuccess = function(){
	loadSitesFromDatabase();
};
function loadSitesFromDatabase(){
	proxyDatabase.getWhiteList(function(whitelist){ whitelistSite = whitelist; });
	proxyDatabase.getBlackList(function(blacklist){ blacklistSite = blacklist; generatePac(); setProxy(); });
}
function addToSiteList(host){
	if(!host) return;
	if(inArray(host, blockedSite)) return;
	loadSitesFromDatabase();
	if(inArray(host, whitelistSite)) return;
	console.log('Add '+host+' to blocked site list');
	blockedSite.push(host);
	generatePac();
	setProxy();
}
function removeFromSiteList(host){
	if(!host) return;
	if(!inArray(host, blockedSite)) return;
	console.log('Remove '+host+' from blocked site list');
	var offset = blockedSite.indexOf(host);
	blockedSite = blockedSite.slice(0, offset).concat(blockedSite.slice(offset+1, blockedSite.length));
	generatePac();
	setProxy();
}