var database = {};
database.version = 2;
database.db = null;
database.open = function() {
	var request = indexedDB.open("proxy", database.version);
	request.onsuccess = function(event) {
		database.db = event.target.result;
	};
	request.onupgradeneeded = function(event) {
		database.db = event.target.result;
		database.db.createObjectStore("site", { keyPath: "host" });
	}
	request.onfailure = database.onerror;
};
database.onerror = function(event){
	console.log(event);
}
database.addSite = function(host, onsuccess, onerror) {
	if(typeof onerror != "function") onerror = database.onerror;
	var request = database.db.transaction("site", "readwrite").objectStore("site").add({
		"host": host,
	});
	request.onsuccess = onsuccess;
	request.onerror = onerror;
}
database.getSite = function(host, onsuccess, onerror) {
	if(typeof onerror != "function") onerror = database.onerror;
	var request = database.db.transaction("site", "readwrite").objectStore("site").get(host);
	request.onsuccess = function(event){ if (typeof onsuccess == "function") onsuccess(event.target.result); };
	request.onerror = onerror;
}
database.putSite = function(host, onsuccess, onerror) {
	if(typeof onerror != "function") onerror = database.onerror;
	var request = database.db.transaction("site", "readwrite").objectStore("site").delete(host);
	request.onsuccess = onsuccess;
	request.onerror = onerror;
}
database.putSite = function(object, onsuccess, onerror) {
	if(typeof onerror != "function") onerror = database.onerror;
	var request = database.db.transaction("site", "readwrite").objectStore("site").put(object);
	request.onsuccess = onsuccess;
	request.onerror = onerror;
}