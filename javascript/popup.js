var currentHost = "";
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	var object = document.createElement('a');
	object.href = tabs[0].url;
	if(object.protocol == "chrome:" || object.protocol == "file:" || object.protocol == "chrome-extension:"){
		currentHost = "";
		$('#addToSites').style.display = "none";
	}else{
		currentHost = object.host;
		$('#addCurrentSite').innerText = "添加 "+currentHost+" 到代理列表";
		$('#addCurrentSite').addEventListener('click', function(event){
			chrome.runtime.sendMessage(null, { msg: "addBlockedSite", host: currentHost }, {}, function(){ window.close() });
		});
	}
});

chrome.runtime.sendMessage(null, { msg: "getProxyMode" }, {}, function(proxyMode){
	if(proxyMode == 1){
		$('#proxyMode_force').className += ' selected';
	}else if(proxyMode == -1){
		$('#proxyMode_off').className += ' selected';
	}else{
		$('#proxyMode_auto').className += ' selected';
	}
});

$('#config').addEventListener('click', function(event){
	window.open('option.htm');
});

$('#about').addEventListener('click', function(event){
	window.open('https://github.com/kookxiang/Chrome-AutoProxy');
});

$('#proxyMode_auto').addEventListener('click', function(event){
	chrome.runtime.sendMessage(null, { msg: "setProxyMode", mode: 0 }, {}, function(){ window.close() });
});

$('#proxyMode_force').addEventListener('click', function(event){
	chrome.runtime.sendMessage(null, { msg: "setProxyMode", mode: 1 }, {}, function(){ window.close() });
});

$('#proxyMode_off').addEventListener('click', function(event){
	chrome.runtime.sendMessage(null, { msg: "setProxyMode", mode: -1 }, {}, function(){ window.close() });
});

function $(selector){
	return document.querySelector(selector);
}