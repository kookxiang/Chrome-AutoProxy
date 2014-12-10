var currentPacFile;
function generatePac(){
	var _blockedSite = blockedSite.concat(blacklistSite);
	currentPacFile = 'var defaultProxy = "' + setting.proxy + '";';
	currentPacFile += 'var sites = [];';

	var flag = [];
	for (var i = _blockedSite.length - 1; i >= 0; i--) {
		var len = _blockedSite[i].length;
		if(!flag[ len ]){
			flag[ len ] = true;
			currentPacFile += 'sites['+len+'] = [];';
		}
		currentPacFile += 'sites['+len+'].push("'+_blockedSite[i]+'");';
	}

	currentPacFile += _getSiteProxy.toString();
	currentPacFile += _inArray.toString();
	if(setting.YOUKU_NOAD_FIX){
		currentPacFile += 'function FindProxyForURL(url, host) { if(url == "http://v.youku.com/crossdomain.xml") return "PROXY yk.pp.navi.youku.com"; return _getSiteProxy(host); }';
	}else{
		currentPacFile += 'function FindProxyForURL(url, host) { return _getSiteProxy(host); }';
	}
}
function setProxy(){
	if(proxyMode == 1){
		var config = {
			mode: "pac_script",
			pacScript: {
				data: 'function FindProxyForURL(url, host) { return "' + setting.proxy + '"; }'
			}
		};
		chrome.proxy.settings.set({value: config, scope: 'regular'}, function(){});
		chrome.browserAction.setBadgeText({text:'ALL'});
		chrome.browserAction.setBadgeBackgroundColor({ color: [255, 128, 64, 255] });
	}else if(proxyMode == -1){
		var config = { mode: "direct" };
		chrome.proxy.settings.set({value: config, scope: 'regular'}, function(){});
		chrome.browserAction.setBadgeText({text:'OFF'});
		chrome.browserAction.setBadgeBackgroundColor({ color: [128, 128, 128, 128] });
	}else{
		var config = {
			mode: "pac_script",
			pacScript: {
				data: currentPacFile
			}
		};
		chrome.proxy.settings.set({value: config, scope: 'regular'}, function(){});
		chrome.browserAction.setBadgeText({text:''});
	}
}

// functions in pac file:
function _getSiteProxy(host){ if(sites[host.length]){ if(_inArray(host, sites[host.length])){ return defaultProxy; }else{ return 'DIRECT'; } }else{ return 'DIRECT'; } }
function _inArray(needle, haystack) { return haystack.indexOf(needle) >= 0; }
generatePac();
setProxy();