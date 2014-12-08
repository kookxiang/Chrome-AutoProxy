var proxyDatabase = {};
proxyDatabase.version = 3;
proxyDatabase.db = null;
proxyDatabase.open = function() {
	var request = indexedDB.open("proxy", proxyDatabase.version);
	request.onsuccess = function(event) {
		proxyDatabase.db = event.target.result;
		console.log('Successfully initialised indexedDB');
		proxyDatabase.onsuccess();
	};
	request.onupgradeneeded = function(event) {
		proxyDatabase.db = event.target.result;
		proxyDatabase.db.createObjectStore("blacklist", { keyPath: "host" });
		proxyDatabase.db.createObjectStore("whitelist", { keyPath: "host" });
	}
	request.onfailure = function(){
		console.log('An error occur while initialising indexedDB');
	};
};
proxyDatabase.onsuccess = function(){};
proxyDatabase.onerror = window.onerror;
proxyDatabase.addSiteToBlackList = function(host, onsuccess, onerror) {
	if(proxyDatabase.db == null) this.open();
	if(typeof onerror != "function") onerror = proxyDatabase.onerror;
	console.log('Add ' + host + ' to blacklist');
	var request = proxyDatabase.db.transaction("blacklist", "readwrite").objectStore("blacklist").add({
		"host": host,
	});
	request.onsuccess = onsuccess;
	request.onerror = onerror;
};
proxyDatabase.addSiteToWhiteList = function(host, onsuccess, onerror) {
	if(proxyDatabase.db == null) this.open();
	if(typeof onerror != "function") onerror = proxyDatabase.onerror;
	console.log('Add ' + host + ' to whitelist');
	var request = proxyDatabase.db.transaction("whitelist", "readwrite").objectStore("whitelist").add({
		"host": host,
	});
	request.onsuccess = onsuccess;
	request.onerror = onerror;
};
proxyDatabase.getBlackList = function(onsuccess, onerror){
	if(proxyDatabase.db == null) this.open();
	var result = [];
	var request = proxyDatabase.db.transaction('blacklist', 'readonly').objectStore('blacklist').openCursor();
	request.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			result.push(cursor.value.host);
			cursor.continue();
		}
		return onsuccess(result);
	};
	if(typeof onerror == "function") onerror();
};
proxyDatabase.getWhiteList = function(onsuccess, onerror){
	if(proxyDatabase.db == null) this.open();
	var result = [];
	var request = proxyDatabase.db.transaction('whitelist', 'readonly').objectStore('whitelist').openCursor();
	request.onsuccess = function(e) {
		var cursor = e.target.result;
		if(cursor) {
			result.push(cursor.value.host);
			cursor.continue();
		}
		return onsuccess(result);
	};
	if(typeof onerror == "function") onerror();
};
proxyDatabase.removeFromBlackList = function(host, onsuccess, onerror){
	if(proxyDatabase.db == null) this.open();
	if(typeof onerror != "function") onerror = proxyDatabase.onerror;
	console.log('Remove ' + host + ' from blacklist');
	var request = proxyDatabase.db.transaction("blacklist", "readwrite").objectStore("blacklist").delete(host);
	request.onsuccess = onsuccess;
	request.onerror = onerror;
}
proxyDatabase.removeFromWhiteList = function(host, onsuccess, onerror){
	if(proxyDatabase.db == null) this.open();
	if(typeof onerror != "function") onerror = proxyDatabase.onerror;
	console.log('Remove ' + host + ' from whitelist');
	var request = proxyDatabase.db.transaction("whitelist", "readwrite").objectStore("whitelist").delete(host);
	request.onsuccess = onsuccess;
	request.onerror = onerror;
}