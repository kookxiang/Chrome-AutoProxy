var matchError = [];
function reloadMatchErrorList(){
	matchError = [];
	if(setting.SET_ON_QUICERROR)		matchError.push('net::ERR_QUIC_PROTOCOL_ERROR');
	if(setting.SET_ON_RESET)			matchError.push('net::ERR_CONNECTION_RESET');
	if(setting.SET_ON_EMPTY)			matchError.push('net::ERR_EMPTY_RESPONSE');
	if(setting.SET_ON_TIMED_OUT)		matchError.push('net::ERR_CONNECTION_TIMED_OUT');
	if(setting.SET_ON_REFUSED)			matchError.push('net::ERR_CONNECTION_REFUSED');
	if(setting.SET_ON_ABORTED)			matchError.push('net::ERR_ABORTED');
}
function onErrorOccurred(details){
	if(proxyMode != 0) return;
	if(inArray(details.error, matchError)){
		var _host = getHost(details.url);
		console.log(_host + ' seems be blocked, add to PAC file');
		addToSiteList({ host: _host });
	}
}
function inArray(needle, haystack) {
	var i = 0, len = haystack.length;
	for (; i < len; i++) {
		if (haystack[i] === needle)
			return true;
	}
	return false;
}
function getHost(url){
	var object = document.createElement('a');
	object.href = url;
	return object.host;
}

chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, { urls: ["<all_urls>"] });
reloadMatchErrorList();