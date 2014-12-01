var dialog_id = 1;
var DIALOG = [];
var DRAG_OBJECT = [];
function createWindow(){
	var win = {};
	DIALOG[dialog_id] = win;
	win.id = dialog_id++;
	win.obj = document.createElement('div');
	win.obj.className = 'dialog';
	win.obj.id = 'dialog_' + win.id;
	win.title = '提示信息';
	win.content = 'null';
	win.btns = document.createElement('p');
	win.btns.className = 'buttons';
	win.with_cover = true;
	win.setTitle = function(str){
		this.title = str;
		return this;
	};
	win.setContent = function(str){
		this.content = str;
		return this;
	};
	win.addButton = function(title, callback, buttonClass){
		var btn = document.createElement('button');
		btn.className = typeof buttonClass == 'undefined' ? "button submit" : buttonClass;
		btn.innerHTML = title;
		btn.onclick = function(){
			callback();
			win.close();
		};
		this.btns.appendChild(btn);
		return this;
	};
	win.addCloseButton = function(title){
		var btn = document.createElement('button');
		btn.className = "button";
		btn.innerHTML = title;
		btn.onclick = function(){
			win.close();
		};
		this.btns.appendChild(btn);
		return this;
	};
	win.append = function(){
		var win_title = document.createElement('h3');
		win_title.innerHTML = this.title;
		var obj = this.obj;
		win_title.onmousedown = function(event){
			try{
				dragObject(obj, event, 1);
			}catch(e){
			}
		};
		win_title.unselectable = true;
		this.obj.appendChild(win_title);
		var win_content = document.createElement('div');
		win_content.className = 'dialog-content';
		win_content.innerHTML = this.content;
		this.obj.appendChild(win_content);
		if(this.btns.innerHTML){
			this.obj.appendChild(this.btns);
		}
		$('#dialogContainer').append(this.obj);
		var top = (document.body.clientHeight - this.obj.clientHeight) / 2 - 70;
		var left = (document.body.clientWidth - this.obj.clientWidth) / 2;
		this.obj.style.top = top + 'px';
		this.obj.style.left = left + 'px';
		if(this.with_cover){
			$('.container').addClass('blur');
			showCover();
		}
		return false;
	};
	win.close = function(){
		if(this.with_cover) hideCover();
		$('.container').removeClass('blur');
		win.obj.className = 'dialog h';
		setTimeout(function(){
			$(win.obj).remove();
		}, 300);
	};
	return win;
}
var coverTimer;
function showCover(){
	if(coverTimer) clearTimeout(coverTimer);
	$('.cover').removeClass('h').removeClass('hidden');
}
function hideCover(){
	if(coverTimer) clearTimeout(coverTimer);
	$('.cover').removeClass('h').addClass('h');
	coverTimer = setTimeout(function(){
		$('.cover').addClass('hidden');
	}, 1000);
}
function dragObject(menuObj, e, op){
	e = e ? e : window.event;
	if(op == 1){
		DRAG_OBJECT['drag'] = [e.clientX, e.clientY];
		DRAG_OBJECT['drag'][2] = parseInt(menuObj.style.left);
		DRAG_OBJECT['drag'][3] = parseInt(menuObj.style.top);
		document.onmousemove = function(e){
			try{
				dragObject(menuObj, e, 2);
			}catch(err){
			}
		};
		document.onmouseup = function(e){
			try{
				dragObject(menuObj, e, 3);
			}catch(err){
			}
		};
	}else if(op == 2 && DRAG_OBJECT['drag'][0]){
		var menuDragNow = [e.clientX, e.clientY];
		menuObj.style.left = (DRAG_OBJECT['drag'][2] + menuDragNow[0] - DRAG_OBJECT['drag'][0]) + 'px';
		menuObj.style.top = (DRAG_OBJECT['drag'][3] + menuDragNow[1] - DRAG_OBJECT['drag'][1]) + 'px';
		menuObj.removeAttribute('top_');
		menuObj.removeAttribute('left_');
	}else if(op == 3){
		DRAG_OBJECT['drag'] = [];
		document.onmousemove = null;
		document.onmouseup = null;
	}
	return false;
}