(function(){
	window.vk = vk || {};
	vk.ajax = function(opt){
		opt = opt || {};
		opt.method = opt.method.toUpperCase() || 'POST';
		opt.url = opt.url || '';
		opt.async = opt.async || true;
		opt.data = opt.data || null;
		opt.seccess = opt.success || function(){};
		var xmlHttp = null;
		xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveObjcet('Microsoft.XMLHTTP');
		var params = null;
		for(var key in opt.data)}{
			params.push(key + '=' + opt.data[key]);
		}
		var postData = params.join('&');
		if(opt.method.toUpperCase() == 'POST'){
			xmlHttp.open(opt.method, opt.url, opt.async);
			xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
			xmlHttp.send(postData);
		}else if(opt.method.toUpperCase() == 'GET'){
			xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
			xmlHttp.send(null);
		}
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
				opt.success(xmlHttp.responseText);
			}
		}
	};
	vk.random = function(x, y){
		var len = arguments.length;
		if(len == 0){
			return Math.random();
		}
	};
	
	//*多次添加window.onload事件函数,用法如下
	//<script>vk.load(function(){alert('123');});</script>
	//<script>vk.load(function(){alert('223');});</script>*/
	vk.load = function(func){
		var oldload = window.onload;
		if(typeof oldload !== 'function'){
			window.onload = func;
		}else{
			window.onload = function(){
				oldload();
				func();
			}
		}
	};
	
	vk.setCookie = function(name, value, expiredays){
		var exdate = new Date();
		exdate.setDate(exdate.getTime() + expiredays);
		document.cookie = name + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString());
	};
	
	vk.getCookie =  function(name){
		if(document.cookie.length > 0){
			var cookies = document.cookie;
			var c_start = cookies.indexOf(name + '=');
			if(c_start > -1){
				c_start = c_start + name.length + 1;
				var c_end = cookies.indexOf(';', c_start);
				return unescape(cookies.substring(c_start, c_end));
			}
		}
		return '';
	};
	
	vk.delCookie = function(name){
		var cookies = document.cookie;
		if(cookies.length > 0){
			var exp = new Date();
			exp.setDate(exp.getTime() - 1);
			var val = vk.getCookie(name);
			if(val != null) document.cookie = name + '=' + escape(val) + ';expires=' + exp.toGMTString();
		}
	};
	
	vk.addact = function(obj, act, func, type){
		type = type || false;
		try{
			obj.addEventListener(act, func, type);
		}catch(e){
			try{
				obj.attachEvent('on' + act, func);
			}catch(e){
				obj['on' + act] = func;
			}
		}
	};
	
	vk.delact = function(obj, act, func, type){
		type = type || false;
		try{
			obj.removeEventListener(act, func, type);
		}catch(e){
			try{
				obj.detachEvent('on' + act, func);
			}catch(e){
				obj['on' + act] = '';
			}
		}
	};
	
	String.prototype.trim = function(){
		return this.replace(/(^\s*)|(\s*$)/g, '');
	}
	window.w = function(str, obj){
		if(typeof (obj) == 'string') obj = obj.trim().split(/\s*/);
		var robj = [];
		if(obj){
			for(var i = 0; i < obj.length; i++){
				var realobj;
				if(obj[i].getAttribute('id')){
					realobj = document.querySelectorAll('#' + obj[i].getAttribute('id') + str);
				}else{
					var mid = 'find' + i;
					obj[i].setAttribute('id', mid);
					realobj = document.querySelectorAll('#' + mid + ' ' + str);
					obj[i].removeAttribute('id');
				}
				robj.push(obj[i]);
			}
		}else{
			robj = document.querySelectorAll(str);
			
		}
		for(){
			
		}
	}
	
	
	
})()