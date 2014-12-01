var currentSetting = {};
var blockedSite = [];
chrome.runtime.sendMessage(null, "getSetting", {}, onReceiveSetting);
function onReceiveSetting(_currentSetting){
	currentSetting = _currentSetting;
	$('#SET_ON_QUICERROR').attr('checked', currentSetting.SET_ON_QUICERROR);
	$('#SET_ON_REFUSED').attr('checked', currentSetting.SET_ON_REFUSED);
	$('#SET_ON_RESET').attr('checked', currentSetting.SET_ON_RESET);
	$('#SET_ON_TIMED_OUT').attr('checked', currentSetting.SET_ON_TIMED_OUT);
	$('#SET_ON_EMPTY').attr('checked', currentSetting.SET_ON_EMPTY);
	$('#SET_ON_ABORTED').attr('checked', currentSetting.SET_ON_ABORTED);
	$('#YOUKU_NOAD_FIX').attr('checked', currentSetting.YOUKU_NOAD_FIX);
	$('#defaultProxy').val(currentSetting.proxy);
}
chrome.runtime.sendMessage(null, "getBlockedSite", {}, function (_blockedSite){
	blockedSite = _blockedSite;
});
$('#refreshPac').click(function () {
	chrome.runtime.sendMessage(null, "refreshPac", {}, function (){
		createWindow().setTitle('自动代理').setContent('代理脚本已更新').addCloseButton('确定').append();
	});
});
$('#siteListButton').click(function () {
	createWindow().setTitle('开发中').setContent('这个功能还没有写好 :)').addCloseButton('确定').append();
});
$('#saveButton').click(function () {
	currentSetting.SET_ON_QUICERROR = $('#SET_ON_QUICERROR').prop('checked');
	currentSetting.SET_ON_REFUSED = $('#SET_ON_REFUSED').prop('checked');
	currentSetting.SET_ON_RESET = $('#SET_ON_RESET').prop('checked');
	currentSetting.SET_ON_EMPTY = $('#SET_ON_EMPTY').prop('checked');
	currentSetting.SET_ON_TIMED_OUT = $('#SET_ON_TIMED_OUT').prop('checked');
	currentSetting.SET_ON_ABORTED = $('#SET_ON_ABORTED').prop('checked');
	currentSetting.YOUKU_NOAD_FIX = $('#YOUKU_NOAD_FIX').prop('checked');
	currentSetting.proxy = $('#defaultProxy').val();

	chrome.runtime.sendMessage(null, { msg: "saveSetting", data: currentSetting }, {}, function (){
		createWindow().setTitle('自动代理').setContent('您的设置已经保存').addCloseButton('确定').append();
	});
});