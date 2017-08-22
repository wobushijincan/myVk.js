( function( global,factory ){
	//这部分是支持AMD引入的,不是很懂,照抄就行
	'use strict';
	if(typeof module === "object" && typeof module.exports === "object" ){
		module.exports = global.document ? 
			factory(global,true) : 
			function(w){
				if( !w.document ){
					throw new Error('wm requires a window with a document');
				}
				return factory(w);
			}
	}else{
		factory( global );
	}
})(typeof window !== "undefined" ? window :this ,function(window,noGlobal ){
	"use strict";
	var window = window;
	var document  = window.document ;
	
	var arr = [];
	var slice = arr.slice ;
	var push = arr.push;
	var concat = arr.concat;
	
	var class2type = {};//对象
	var toString = class2type.toString;
	var hasOwn = class2type.hasOwnProperty;
	var fnToString = hasOwn.toString ;
	var objectFunctionString = fnToString.call( Object );	
	
	var _version = '2.0.0-161120';	
	
	var wm = function( selector ){
		return new wm.fn.init( selector );
	}
	//wm对象的原型对象
	wm.fn = wm.prototype = {
		wm: _version,
		constructor: wm,
		//返回数组对象
		toArray:function(){
			return slice.call( this );
		},
		//返回数组对象
		get:function( num ){
			if(num == null || num == undefined){
				return this.toArray();
			}
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},
		//返回实例化后的对象
		pushStack:function( elems ){
			var robj = wm.merge( this.constructor(),elems );//实例化一个对象并将各个元素置入
			robj.preObj = this;//添加一个回溯对象
			return robj;
		},
		slice:function(){
			return this.pushStack( slice.apply(this,arguments) );//先取出一个数组,再置入实例化后的对象里
		},
		
		each: function(callback){
			return wm.each( this , callback );
		},
		eq:function(i){
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 ) ;
			return this.pushStack( j>= 0 && j<len ? [this[ j ] ] : [] );
		},
		first:function(){
			return this.eq(0);
		},
		last:function(){
			return this.eq( -1 );
		},
		end : function(){
			return this.prevObj || this.constructor() ;
		},
		push:push,//这里在纠结要不要改成后面可以继续用链式操作的
		splice:arr.splice,//这个不需要同上,返回的应该是一个数组
		sort:arr.sort,
		w : function( str ){
			return this.pushStack( myQuerySelector( str ,this ) );
		},
		html : function(){
			var str,
				len = arguments.length;
			switch(len){
				case 0 :
					return this[0].innerHTML;
				case 1 :
					str = arguments[0];
					return this.each(function(){this.innerHTML = str;});
				default :
					str = arguments[0];
					for(var i =1;i<len;++i){
						this[arguments[i]].innerHTML = str;
					}
					return this;
			}
		},
		addhtml : function(str,isbefore){
			return this.each(function(one){
				var innerh = one.innerHTML;
				one.innerHTML = isbefore ? str + innerh : innerh + str ; 
			});
		},
		css : function(a,b){
			var obj = {} ;
			if(!b){
				if(typeof a == 'string') return this[0] && this[0].style[a];//获取
				var obj = a;
			}else{
				obj[a] = b;
			}
			return this.each(function(one){
				wm.each(obj,function(v,k){
					one.style[k]=v;
				});
			});
		}
	}
	wm.extend = wm.fn.extend = function(){
		var options,name,src,copy,copyIsArray,clone,target = arguments[0] || {},i = 1,length = arguments.length,deep = false;
		if( typeof target === "boolean" ) {//如果第一个参数是布尔型
			deep = target ;//第一个参数用来控制是否深度克隆
			target = arguments[i] || {};//将第二个参数作为被克隆对象
			i++;//这里I已经不等于1了
		};
		if(typeof target !== "object" && !wm.isFunction( target ) ){//target不是对象,不是函数
			target = {} ;
		};
		if( i === length){
			target = this ;
			i -- ;//i=0,下标只有一个函数
		};
		for ( ; i< length ; i++){
			if( (options = arguments[ i ] ) != null ){
				for( name in options){
					src = target[ name ] ;//原本的属性值
					copy = options[ name ] ;//需要拷贝的属性值
					if( target === copy){
						continue ;//跳过相同的内容
					}
					if(deep && copy && (wm.isPlainObject( copy ) || (copyIsArray = wm.isArray( copy ) ) ) ){
						if(copyIsArray){
							copyIsArray = false ;
							clone = src && wm.isArray(src) ? src : [] ;
						} else {
							clone = src && wm.isPlainObject( src ) ? src : {} ;//
						}
						target [ name ] = wm.extend(deep,clone ,copy);//深度克隆的话进行递归操作
					}else if(copy !== undefined) {//只有undefined不被合并,null也将被合并进去
						target[ name ] = copy ;
					}
				}
			}
		}
	};
	wm.extend( {
		ajax : function(opt) {
			var dopt = {
				'method' : 'GET',
				'url' : '',
				'async' : true,
				'data' : null,
				'isupload' : false,
				'success' :  function(t){},
				'error' : function(t){},
				'setHeaders' : null,
			};
			var data = {};
			wm.extend(data,opt.data || {});
			opt.data = data;
			wm.extend(dopt,opt);
			//opt.method = (opt.method || 'GET').toUpperCase();
			if(!dopt.url) throw('调用ajax的时候必须传入url参数');//
			var xmlHttp=window.XMLHttpRequest ? new XMLHttpRequest : new ActiveObject("Microsoft.XMLHTTP");
			//这里考虑做上传文件兼容,将采用 var postData = new FormData()来做为文件上传
			var params = [];
			for (var kg in dopt.data){
				//将加号转义,否则后台显示不正常,这里好好构思一下后续改到getformdata里去
				if(typeof dopt.data[kg] =='string' && !dopt.isupload ){
					dopt.data[kg] = encodeURIComponent(dopt.data[kg]);
				}
				params.push(kg + '=' + dopt.data[kg]);
			}
			var postData;
			switch(dopt.method.toUpperCase()){
				case 'POST':
				//判断FormData是否存在,存在则用formdata来传输数据可以上用来上传,否则不能用来上传;
					
					xmlHttp.open(dopt.method, dopt.url, dopt.async);
					if(dopt.isupload){
						postData = new FormData();
						for(var kp in dopt.data){
							//console.log(kp);
							postData.append(kp,dopt.data[kp]);
						}
					}else{
						postData =  params.join('&') ;
						//console.log(postData);
						//设置表单属性
						xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
					}
					break;
				case 'GET':	default:
					var getData = (dopt.url.match(/\?/) ? '&' : '?' ) + params.join('&');
					//getData =  + getData : '?' + getData;//检测url内是否有?,如果有?则把数据直接加上&做为查询参数,否则把数据加上?做为查询参数
					xmlHttp.open(dopt.method, dopt.url + getData, dopt.async);;
					break;
				
					//console.log('错误的调用');
			}
			//console.log(dopt);
			xmlHttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
			for(var sk in dopt.setHeaders){
				xmlHttp.serRequestHeader(sk,dopt.setHeaders[sk]);
			}
			xmlHttp.send(postData);
			//console.log(xmlHttp);		
			/* 同步模式下如果有success则调用success回调函数(主要是为了与异步调用参数形式相同),然后返回获取到的值 */
			if(!dopt.async){
				dopt.success (xmlHttp.responseText);
				return xmlHttp.responseText;
			}
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState == 4 &&(xmlHttp.status == 200 || xmlHttp.status == 304 )) {
					//console.log(xmlHttp);
					dopt.success(xmlHttp.responseText,xmlHttp.status);
				}else if(xmlHttp.readyState == 4 && xmlHttp.status != 200){
					//console.log(xmlHttp);
					dopt.error(xmlHttp.responseText,xmlHttp.status);
				}
			}
			return xmlHttp;
		},
		random : function(x,y){
			x = x || 0 ;
			y = y || 1 ;
			return  Math.random() * ( y - x ) + x ;
		},
		getdistance : function(p1x,p1y,p2x,p2y){
			var xdistance = p1x - p2x;
					ydistance = p1y - p2y;
			return Math.sqrt( Math.pow( xdistance,2 ) +Math.pow( ydistance,2 ) );
		},
		circle : function(i,num,del){
			return del ? (i==0 ? num : --i ) : ( i==num ? 0 : ++i) ;
		},
		//这个方法要用===null来判断,用if判断的话不合适,会返回0
		is_in : function(a,b){
			var i=null ;
			if(!b) return i;
			wm.each(b,function(bi,bk){ if(bi == a) i = bk; });
			return i;
		},
		stopprop : function(e){
			//这个e是事件绑定里的e;
			if(e && e.stopPropagation){
				e.stopPropagation();
			}else{
				//IE  e=window.event;
				window.event.cancelBubble=true;
			}
		},
		//阻止默认事件
		predef : function(e){
			if(e && e.preventDefault){
				e.preventDefault();
			}else{
				window.event.returnValue =  false;
			}
		},
		//获取事件目标节点
		getevent : function(e){
			return e || window.event || arguments.callee.caller.arguments[0];
		},
		gettarget : function(e){
			var even = wm.getevent(e)/* e || window.event || arguments.callee.caller.arguments[0] */;
			var ele = even.target || even.srcElement;
			return new wm.fn.init(ele);//这里实例化目标元素作为对象返回
		},
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},
		isPlainObject : function(obj){
			//这个里面的一堆toString  hasOwn  fnToString objectFuntionString都是开始的时候那个class2type = {}的属性,应该是缓存了Object的一些属性和方法
			var proto,Ctor;
			if(!obj || toString.call( obj ) !== "[object Object]" ) return false;
			proto = Object.getPrototypeOf( obj );
			if(!proto) return true;
			Ctor = hasOwn.call( proto,"constructor") && proto.constructor ;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === objectFunctionString;
		},
		isDom : (( typeof HTMLElement === 'object' ) ?
		function(obj){
			return obj instanceof HTMLElement;
		} :
		function(obj){
			return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
		}),
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
		isArray : Array.isArray,
		isArrayLike : function(obj){
			var length = !!obj && "length" in obj && obj.length,
				type = this.type( obj );
			if(type === "function" || wm.isWindow( obj ) ){
				return false;
			}
			return type === "array" || length === 0 || typeof length === "number" && length>0 && ( length - 1 ) in obj ;
		},
		isFunction : function(obj){
			return wm.type(obj) === 'function' ;
		},
		//创建节点
		createnode : function(tagname,innerstr){
			var newnode=document.createElement(tagname);
			if(typeof innerstr=='string') newnode.innerHTML = innerstr ;
			return wm( [newnode] );
		},
		str_repeat:function(i, m) {
			for (var o = []; m > 0; o[--m] = i);
			return o.join('');
		},
		sprintf : function() {
			var i = 0, a, f = arguments[i++], o = [], m, p, c, x, s = '';
			while (f) {
				if (m = /^[^\x25]+/.exec(f)) {
					o.push(m[0]);
				}
				else if (m = /^\x25{2}/.exec(f)) {
					o.push('%');
				}
				else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
					if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) { 
						throw('Too few arguments.');
					}
					if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
						throw('Expecting number but found ' + typeof(a));
					}
					switch (m[7]) {
						case 'b': a = a.toString(2); break;
						case 'c': a = String.fromCharCode(a); break;
						case 'd': a = parseInt(a); break;
						case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
						case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
						case 'o': a = a.toString(8); break;
						case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
						case 'u': a = Math.abs(a); break;
						case 'x': a = a.toString(16); break;
						case 'X': a = a.toString(16).toUpperCase(); break;
					}
					a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+'+ a : a);
					c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
					x = m[5] - String(a).length - s.length;
					p = m[5] ? wm.str_repeat(c, x) : '';
					o.push(s + (m[4] ? a + p : p + a));
				}
				else {
					throw('Huh ?!');
				}
				f = f.substring(m[0].length);
			}
			return o.join('');
		},
  		hasClass : function(obj,classstr){
			var oclassname = obj.className || '';
			var classarr = oclassname.split(' ') || [];
			return wm.is_in(classstr,classarr) ;
		}, 
		each : function( obj , callback , arg){
			var length, i=0;
			if(this.isArrayLike( obj ) ){//判断是否是数组或者伪数组
				length = obj.length;//console.log(length);console.log(obj);
				for( ; i<length; i++){
					if( callback.call(obj[i],obj[i],i,arg) === false) break;
				}
			}else{
				for( i in obj){
					if( callback.call(obj[i],obj[i],i,arg) === false) break;
				}
			}
			return obj;//返回的是调用each的jq对象
		},
		map : function( obj ,callback,arg){
			var length,value,i,ret=[];//ret是反回指
			if(this.isArrayLike( obj )){//同上
				length = obj.length;
				for( i = 0; i<length;i++){
					value = callback( obj[i],i,arg);
					ret.push( value );
					/* if(value !== null ){//jq的写法
						ret.push( value );
					} */
				}
			}else{
				for( i in obj){
					value = callback( obj[i],i,arg);
					ret.push( value );
					/* if(value !== null ){
						ret.push( value );
					} */
				}
			}
			return wm(ret) ;//jq这里用了return Jquery(ret)这样转为伪数组jq对象了
		},
		merge : function(a,b){
			if(!b) return a;
			var len = +b.length,j=0,i=a.length || 0;
			for( ; j<len;j++){
				a[i++] = b[j];
			}
			//console.log(i);
			a.length = i;
			return a ;
		},
		ck : function( obj ){
			wm.each(obj,function(v,i,nobj){
				if( v ) nobj[i] = encodeURIComponent( v );
			},obj);
			if(obj.value == undefined && obj.ott==undefined){
				// 获取cookie,如果存在切未过期返回cookie值,否则返回false 
				var name = obj.name || obj,cstr = document.cookie,md = new RegExp("(:?\\s|^)"+name+"=([^;]*)(:?;|$)"),rs=cstr.match(md);
				rs=cstr.match(md);
				if(rs) return decodeURIComponent( rs[2] );
				return false;
			}else{
				var name = obj.name,ott= obj.ott,value = obj.value || '',path = obj.path || "/",domain = obj.domain,str;
				str = name + '=' + value
				if(ott!==undefined && ott!==0){
					//ott设置为负数表示删除cookie,为正数数表示设置成多久之后过期,为0或者不传入表示浏览器关闭就删除
					var date=new Date();
					date.setTime(date.getTime()+ott); 
					str += ';expires=' + date.toGMTString();
				}
				str += ';path=' + path;
				if(domain) str += ';domain=' + domain;
				document.cookie=str;
			}
		},
		
		ready : (function() {   //这个函数返回whenReady()函数
			//console.log('ready闭包内');
			var funcs = [];             //当获得事件时，要运行的函数
			var ready = false;          //当触发事件处理程序时,切换为true
			//当文档就绪时,调用事件处理程序
			function handler(e) {
				if(ready) return;       //确保事件处理程序只完整运行一次
				//console.log(document.readyState);
				if(e.type === 'readystatechange' && document.readyState !== 'complete') return; 
				for(var i=0; i<funcs.length; i++) {
					funcs[i].call(document);
				}
				ready = true;
				funcs = null;
			};
			if(document.addEventListener) {
				//console.log(123123213);
				document.addEventListener('DOMContentLoaded', handler, false);
				document.addEventListener('readystatechange', handler, false);   		//IE9+
				window.addEventListener('load', handler, false);
			}else if(document.attachEvent) {
				document.attachEvent('onreadystatechange', handler);
				window.attachEvent('onload', handler);
			};
			return function whenReady(fn) {
				if(ready) {
					fn.call(document);
				}else{ 
					funcs.push(fn);
				}
			}
		})(),
		load : function(func){
			var oldload = window.onload || function(){};
			window.onload = function(){
				oldload();
				func();
			}
		},
	} );
	
	wm.fn.extend( {
		clss : function(classstr,had){//obj,需要设置class的对象
			//debugger();
			if(had === true){
				var dobj = this[0];
				var x = dobj.className || '';
				var xarr = x.split(' ') || [];
				var rs = wm.is_in(classstr,xarr);
				return rs !== null ? true : false;
			};
			var callback =
			had == 'add' ? function(obj){
				var x = obj.className || '';
				var xarr = x.split(' ') || [];
				var rs = wm.is_in(classstr,xarr);
				if(rs === null){
					obj.className = x + ' ' + classstr;
				}
			} :
			had == 'del' ? function(obj){
				var x = obj.className || '';
				var xarr = x.split(' ') || [];
				var rs = wm.is_in(classstr,xarr);
				//console.log(rs);
				if(rs !== null){
					xarr.splice(rs,1);
					obj.className = xarr.join(' ');
				}
			} : 
			had === undefined ?  function(obj){//取反
				var x = obj.className || '';
				var xarr = x.split(' ') || [];
				var rs = wm.is_in(classstr,xarr);
				if(rs !== null){
					xarr.splice(rs,1);
					obj.className = xarr.join(' ');
				}else{
					obj.className = x + ' ' + classstr;
				}
			} :
			false;
			if(!callback) throw('调用clss时参数错误');
			try{ return this.each(callback); }
			catch(e){ console.log(this);console.log(e);}
		},
		moveto : function(t,strmix,txt){
			if( t == undefined ){
				//console.log(123123);
				return this.each(function(tnode){
					tnode = this.parentNode;
					tnode.removeChild(this);
				});
			}else{
				var dis = typeof t == 'string' ? new wm.fn.init(t) : t ;//可能是原生对象,也可能是对象
				var tnode = 0 in dis ? dis[0] : dis ;//这里只判断对象的0是否存在,存在就调用,不存在当作原生dom节点直接调用
				var callback = 
					strmix === undefined ? function(cnode){
						tnode.appendChild(cnode);
					} : 
					strmix == 'before' ? function(cnode){
						tnode.parentNode.insertBefore(cnode,tnode);
					} :
					strmix == 'after' ? function(cnode){
						if(tnode.parentNode.lastChild === tnode){//最后一个元素
							tnode.parentNode.appendChild(cnode);//直接添加的最后
						}else{
							tnode.parentNode.insertBefore(cnode,tnode.nextSibling);//添加到它下一个元素的前面
						}
					} : function(cnode){//添加到第几个元素,先判断是否需要文本节点
						var nodelist = txt ? tnode.childNodes : tnode.children;
						tnode.insertBefore(cnode,nodelist[strmix]);
					};
				return this.each(callback);
			};
		},
		att : function(attname,attvalue){
			//console.log(this);
			if(typeof(attvalue) != 'undefined'){
				return this.each( function(dis){ dis.setAttribute(attname,attvalue); } );
			}else{
				return this[0] ? this[0].getAttribute(attname) : '';
			}
		},
		on : function(a,c,f,t){
			if(this.length == 0  || !wm.isDom(this[0])) return this;
			var fun,type;
			//console.log(123);
			if(typeof c == 'string'){//事件委托模式
				fun =  function(e){
					//这里的this应该是绑定事件的对象,也即调用on对象的一个dom元素
					/* console.log(this);
					console.log(w(this)); */
					var etar = wm.gettarget(e)[0],
						fetar = etar,//fetar是初始触发对象
						cdis=w(this).w(c),
					    //cdis = wm(this).w(c),//这个如果放在外面触发就不是动态的了,不划算,还是放在函数内比较好
						k,
						_self = this;
						//console.log(this);console.log(e);
					while( etar !== this ){
						//console.log(etar);
						//if(fdis == this) break;
						if( !etar ) return;
						if( (k=wm.is_in(etar,cdis)) !== null ){
							f.call(etar,e,fetar,_self,cdis);//e,fetar,
							//  f(e,fetar,etarpop,cdis){
							//		this;
							//  //e事件,fetar实际事件冒泡的初始对象,etarpos冒泡到这个节点被捕获,cdis可以触发该动作的节点的集合的wm对象
							//  //this 冒泡到当前代理的对象被捕获
							//  }
							return;
						}
						//if(etar == window);
						//if(etar == this) return ;
						etar = etar.parentNode;
					}
				};
				type = t || false;
			}else{//省略了一个参数
				fun = c;
				type = f || false;//默认冒泡事件
			};
			try{
				return this.each( function(obj){ obj.addEventListener(a,fun,type); } );
			}catch(e){
				try{
					return this.each( function(obj){obj.attachEvent('on'+a,fun)} );
				}catch(e){
					return this.each( function(obj){
														//这里先缓存旧的程序的做法是不是不太妥当,后续再测试吧
														/* var oldact = obj['on'+a] ;
														obj[ 'on' + a ] = function(e){
															oldact.call(this,e);
															fun.call(this,e);
														}; */
														obj['on'+a ] = fun ;
					});
				}
			}
		},
		addact : function(act,c,func,type){
			return this.on(act,c,func,type);
		},
		delact : function(act,funchandle,type){
			return this.off(act,funchandle,type);
		},
		off : function(act,funchandle,type){
			if(this.length == 0  || !wm.isDom(this[0])) return this;
			type = type || false;
			try{//最新版浏览器
				//obj.removeEventListener(act,funchandle,type);
				return this.each( function(obj){ obj.removeEventListener(act,funchandle,type);});
			}catch(e){
				try{
					return this.each( function(obj){ obj.detachEvent('on'+act,funchandle);});
				}catch(e){
					return this.each( function(obj){ obj['on'+act]=function(){};} );
				}
			}
		},
		each : function( func ){
			wm.each(this,func) ;
			return this;
		},
		map : function( func){
			return wm.pushStack( wm.map( this ,func ) );
		}
	} );
	wm.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),function( name,i  ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );
	//170408优化选择器,不需要在循环内部使用querySelecorAll
	function myQuerySelector(str,obj){
		var robj={length:0};
		if(obj){
			//这里用isdom函数来判断是是节点,还是节点集合
			var querystr,queryarr=[];
			var strarr = str.split(',');
			var mdclass='_wm_mark_class'+parseInt(Math.random()*10000+1000);//这个class应该不会和用户使用的class冲突吧
			var strlen = strarr.length;
			for(var i=0;i<strlen;i++){
				var onequery = strarr[i];
				queryarr.push( '.' + mdclass + ( onequery.match(/^\>/) ? '' : ' ' ) + onequery ) ;
			};
			querystr = queryarr.join(',');
			var mdobjlist= wm.isDom(obj) ? {0:obj,length:1} : obj;
			wm.fn.clss.call(mdobjlist,mdclass,'add');
/* 			try{ */
				robj = document.querySelectorAll( querystr );
/* 			}catch(e){
				console.log(querystr);
				console.log(e);
			} */
			wm.fn.clss.call(mdobjlist,mdclass,'del');
		}else{
			//console.log( str );
			robj = document.querySelectorAll( str );
		}
		return robj
	};
	
	var reghtml = /^<[a-zA-Z]+[\s\S]*>$/;//html内容
	var tempdiv = document.createElement('div');
	wm.fn.init=function(arg){
		var nodes ;
		if(!arg) return this;//'',或空
		else if(typeof arg == 'string'){
			if( arg == 'body' ){
				nodes = [ document.body ];
			}else if(reghtml.test(arg)){
				tempdiv.innerHTML = arg;
				nodes = tempdiv.children;
			}else{
				//类似css选择器
				nodes = myQuerySelector( arg );
			}
		}else{
			if(wm.type(arg) === 'function'){
				wm.ready(arg);
				return;
			}else{
				if(wm.isDom(arg)){
					nodes = [arg];
				}else if(wm.isArrayLike(arg)){
					//wm.merge(this,arg);
					//this.length = arg.length ;
					nodes = arg;
				}else{
					this[0]=arg;
					this.length=1;
					//if(!wm.isDom(arg)) return this;
				}
			}
		};
		//console.log(nodes);
		if(nodes) wm.merge(this,nodes);
		tempdiv.innerHTML = '';
		this.preObj = docobj ;
		return this;
	};
	wm.fn.init.prototype=wm.fn;//实例化后返回
	window.wm=window.w=wm;
	wm.extend({
		setSelectorSign : function(str){
			
		}
	});
	var docobj = wm( document );
});
wm.extend({
	show:function(opt){
		//opt.inner,opt.url,opt.callback,opt.style,opt.dis,opt.clss,opt.method,opt.data,
		opt.inner = opt.inner || '';
		var bgboxstyle = opt.bgboxstyle || 'position:fixed;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,.3);z-index:9398;overflow:scroll;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding-top:100px;';
		opt.callback = opt.callback || function(){};
		
		function showindiv(innerstr,callback){
			var bgnode;
			if(opt.dis){
				bgnode = typeof opt.dis=='string' ? w(opt.dis) : opt.dis ;
				//console.log(bgnode);
				bgnode.html(innerstr);
			}else{
				innerstr+='<a href="javascript:" class="close"></a>';
				bgnode = wm.createnode('div',innerstr);
				bgnode.att('style',bgboxstyle).clss('bgbox','add');
				bgnode.moveto('body');
			}
			if(opt.url) bgnode.att('href',opt.url);
			if(opt.clss) bgnode.clss(opt.clss);
			if(callback) setTimeout(function(){callback(bgnode)},200);
		}
		if(opt.url){
			var ajaxobj={
				'url':opt.url,
				'method':opt.method || 'get',
				'success':function(t){
					showindiv(opt.inner + t,opt.callback);
				},
				'error':function(t){
					alert(t);
				}
			};
			if(opt.data) ajaxobj.data=opt.data;
			wm.ajax(ajaxobj);
		}else{
			showindiv(opt.inner,opt.callback)
		}
		
	}
});
	
	/* 
	(function(){
		//初始化必须输入banner的容器,定时移动容器的位置
		//banner主要是左右移动的banner
		//上一个下一个(初始化的时候需要输入
		//变化类型,默认是height,
		
		//公用变量,只读变量,不对外开放,依次代表获取宽度,x位移还是y位移,正位移还是负位移
		var _typearr ={
			'left':['offsetWidth','X',true],
			'right':['offsetWidth','X',false],
			'top':['offsetHeight','Y',true],
			'bottom':['offsetHeight','Y',false],
		}
		//是否触屏,触屏绑定滑动机制
		var _touchstart,_touchend,_touchcancle;//开始,结束,取消
		function banner(opt){
			var _self=this;
			//console.log(_self);
			_self._timer=undefined;//定时器
			_self.time= opt.time ? opt.time :(opt.notauto ? false : 2000) ;//默认两秒切换
			//_self.notauto = opt.notauto;
			_self.bnnr= typeof opt.bnnr == 'string' ? wm.w(opt.bnnr)[0] : opt.bnnr;
			_self.index=0;
			_self.Xs=0;//初始X,
			_self.Ys=0;//初始Y
			_self.Xe=0;//结束X
			_self.Ye=0;//结束Y
			_self.type = opt.type || 'left';//默认方式为左侧
			var _bnnrchildren = _self.bnnr.children;
			_self.bnnrtotal = _bnnrchildren.length
			//_self.onenum = -((_self.type=='left' || _self.type=='right' ) ? _self.bnnr.offsetWidth : _self.bnnr.offsetHeight)/(_self.bnnrtotal);
			var typearr=_typearr[_self.type];
			_self.typearr=typearr;
			_self.onenum = (_self.bnnr[typearr[0]]/(_self.bnnrtotal))
			if(opt.next){
				var next = typeof opt.next == 'string' ? wm.w(opt.next)[0] : opt.next;
				wm.w(next).addact('click',function(e){
					_self.next();
				});
			}
			if(opt.previous){
				var previous = typeof opt.previous == 'string' ? wm.w(opt.previous)[0] : opt.previous;
				wm.w(previous).addact('click',function(e){
					_self.previous();
				});
			}
			//opt.mark一般都是一个ul
			if(opt.mark){
				_self.mark = typeof opt.mark =='string' ? wm.w(opt.mark)[0] : opt.mark;
				//console.log(_self.mark.children.length);
				if(_self.mark.children.length==0){
					var strarr=[];
					for(var i=0;i<_self.bnnrtotal;i++){
						strarr.push('<li><a href="javascript:">'+(i+1)+'</a></li>');
					}
					_self.mark.innerHTML = strarr.join('');
				}
				_self.mark.addact('click',function(e){
					var etar= wm.gettarget(e);
					if(etar.parentNode.parentNode==_self.mark || etar.parentNode == _self.mark ){
						if( etar.parentNode.parentNode==_self.mark) etar=wm.w(etar.parentNode);
						_self.index = wm.is_in(etar,_self.mark.children);
						_self.tonum(_self.index);
					}
				});
				wm.addkv(_self.mark.children);
			}
			//console.log(touch);
			if( 'ontouchstart' in window){
				_self.bnnr.addact('touchstart',function(e){
					//wm.stopprop(e);
					_self[typearr[1]+'s']=e.touches[0]['client'+typearr[1]];
					//window.innerHTML='';
					wm.addkv(window).addact('touchend',function(ew){
						_self[typearr[1]+'e']=ew.touches[0]['client'+typearr[1]];
						var movelen = _self[typearr[1]+'e'] - _self[typearr[1]+'s'];
						var movelenz = movelen>0 ? movelen : -movelen ;
						if(movelenz > 100) _self.tonum(wm.circle(_self.index,_self.bnnrtotal-1,movelen>0));
						this.delact('touchend',arguments.callee);
					});
				});
				wm.addkv(window).addact('touchcancel',function(){
					_self[typearr[1]+'s']=0;
					_self[typearr[1]+'e']=0;
				});
			};
			if(_self.time){
				_self.bnnr.addact('mouseover',function(){
					_self.resettime();
				}).addact('mouseout',function(){
					_self._timer=setTimeout(function(){_self.next();},_self.time);
				});
			}
			
			if(_self.time) _self._timer = setTimeout(function(){
				_self.tonum(wm.circle(_self.index,_self.bnnrtotal-1));
			},_self.time);
			
		}
		banner.prototype.resettime=function(){
			var _self=this;
			if(_self._timer){
				clearTimeout( _self._timer );
				_self._timer=undefined;
			}
		}
		banner.prototype.tonum=function(i){
			var _self=this;
			_self.resettime();
			_self.index=i;
			var move = _self.typearr[2] ?  (-_self.onenum*i) : _self.onenum*i;
			var str = 'translate'+_self.typearr[1]+'('+move+'px)'
			_self.bnnr.style.transform=str;
			_self.bnnr.style.MsTransform=str;
			_self.bnnr.style.MozTransform=str;
			_self.bnnr.style.WebkitTransform=str;
			_self.bnnr.style.OTransform=str;
			// console.log(i);
			//console.log(_self.mark.children); 
			if(_self.mark){
				_self.mark.w('>*').clss('current','del');
				_self.mark.w('>*')[i].clss('current','add');
			}
			///alert(_self._timer);
			if(_self.time) _self._timer=setTimeout(function(){
				_self.tonum(wm.circle(i,_self.bnnrtotal-1));
			},_self.time);
		}
		banner.prototype.next=function(){
			var _self=this;
			_self.tonum(wm.circle(_self.index,_self.bnnrtotal-1));
		}
		banner.prototype.previous=function(){
			var _self=this;
			_self.tonum(wm.circle(_self.index,_self.bnnrtotal-1,true));//减掉
		}
		wm.banner=function(inopt){
			return new banner(inopt);
		}
	})(); */


	
	wm.fn.extend({
		val : function(index,value){
			var len =arguments.length,pos,val;
			switch(len){
				case 0 :
					return (this[0] ? this[0].value : '');
				case 1 :
					pos = 0;
					val = index;
					break;
				default :
					pos = index;
					val = value;
			}
			//console.log(pos);
			//console.log(this[pos]);
			if(this[pos]) this[pos].value = val;
			return this;
		},
		getval : function (){
			//包括两种 input 和 textarea
			var inputlist = this.w('input,select,textarea');
			this.each(function(one){
				var nname = one.nodeName;
				if( nname == 'INPUT' || nname == 'TEXTAREA' || nname == 'SELECT' ) inputlist.push(one);
			});
			var data = {};//该对象存放序列化后的数据
			var datalength={};//该对象存放name带有[]的数组对应的length
			var iil = inputlist.length;
			//console.log(inputlist);
			for(var k=0;k<iil;k++){//之前用的while(length--)会出现反序的Bug
				var crc = (inputlist[k].type == 'checkbox' || inputlist[k].type == 'radio') && (inputlist[k].checked == true);//判断是'文本'元素
				var txttypearr = ['text','password','textarea','hidden','color','date','datetime','datetime-local','month','week','time','email','number','range','search','tel','url'];
				var txttype = false;
				txttype = wm.is_in(inputlist[k].type,txttypearr);
				var dataname = undefined,arrname=undefined;
				if( crc || txttype !== null ){
					//这里之前用的是/^\w+[\s\S]*\[\]$/如果是二维数组的话匹配不到
					var oldname = inputlist[k].name,ei = oldname.indexOf('[]');//endindex
					if(ei>-1){
						arrname = oldname.replace('[]','');
						if(datalength[arrname]!= undefined) datalength[arrname]++;
						else datalength[arrname] = 0;
						dataname = arrname + '[' + datalength[arrname] + ']';
					}else{
						dataname = inputlist[k].name;
					}
					data[dataname] = inputlist[k].value;
				}else if(inputlist[k].type=='select-one'){
					if(inputlist[k].value){
						dataname = inputlist[k].name;
						data[dataname] = inputlist[k].value;
					}
				}else if(inputlist[k].type=='select-multiple'){
					var arrname = inputlist[k].name.replace('[]','');
					var optionlist = inputlist[k].options;
					var i = optionlist.length;
					while(i--){
						if(optionlist[i].selected){
							if(datalength.arrname != undefined){
								datalength.arrname++;
							}else{
								datalength.arrname = 0;
							}
							dataname = arrname + '[' + datalength.arrname + ']';
							data[dataname] = optionlist[i].value;
						}
					}
				}else if(inputlist[k].type == 'file'/* &&inputlist[k].files.length>0 */){	// 160505更新,判断name是否以[]结尾 再判断文件个数
					if(inputlist[k].name.match(/^\w+\[\]$/) || inputlist[k].files.length > 1){
						dataname = inputlist[k].name.replace(/^(\w+)\[\]$/,'$1');
						for(var j = 0;j<inputlist[k].files.length;j++){
							data[dataname + '[' + j + ']'] = inputlist[k].files[j];
						}
					}else{
						dataname = inputlist[k].name;
						data[dataname] = inputlist[k].files[0];
					}
				}
			}
			return data;
		} 
	});

/* wm.fn.extend({
	parent : function(){
		if(this[0] && this[0].parentNode) return this.pushStack( this[0].parentNode );
		else return this.pushStack();
	}
}); */
	
//调试模式
/* localStorage.clear();
//非调试模式把上面这行清空
;(function(){
	var sk = (function(_skversion){
		var ls = localStorage || (function(){
			var lscache = {};//内存缓存
			return {
				getItem : function(name){
					return lscache[name];
				},
				setItem : function(name,value){
					lscache[name]=value;
				},
			}
		}());
		var _sk = ls.getItem('__wmsk__');
		var _init = function(){
			_sk={'version':_skversion};
			ls.setItem('__wmsk__',JSON.stringify(_sk));
		};
		try{
			_sk = JSON.parse(_sk);
			if(_sk['version'] != _skversion) _init();
		}catch(e){
			_init();
		};
		return function(name,value){
			if(!value) return _sk[name];
			_sk[name]=value;
			ls.setItem('__wmsk__',JSON.stringify(_sk));
		};
	})(version || '1.0.0');//初次调用传入全局对象
	wm.extend({
		sk:sk
	});
}()); */

//嵌入wm对象版
wm.extend({
	ls : localStorage || ( function(){
		var lscache = {};//不支持localstorage则用内存缓存
		return {
			getItem : function(name){
				return lscache[name];
			},
			setItem : function(name,value){
				lscache[name]=value;
			}
		};
	}()),
	sk_nowversion : '1.0.0',//这个值可以在外部重新赋值
});
wm.extend({
	sk : (function(){
		var _skversion = wm.ls.getItem('__wmsk_version__') || '';
		try{
			_skversion = JSON.parse( _skversion );
		}catch(e){
			_skversion={};
			wm.ls.setItem('__wmsk_version__',JSON.stringify(_skversion));
		};
		return function(name,value){
			if(!value){
				var rtn;
				if(wm.sk_nowversion == _skversion[name]) rtn = wm.ls.getItem(name);
				return rtn;
			}else{
				_skversion[name]=wm.sk_nowversion;
				wm.ls.setItem('__wmsk_version__',JSON.stringify(_skversion));
				wm.ls.setItem(name,value);
			}
		};
	}()),
	
});
//console.log(wm);
//函数版
/* ;(function(){
	var ls = localStorage || (function(){
		var lscache = {};//内存缓存
		return {
			getItem : function(name){
				return lscache[name];
			},
			setItem : function(name,value){
				lscache[name]=value;
			},
		}
	}());
	var sk = (function(_nowversion){
		
		var _skversion = ls.getItem('__wmsk_version__') || '';
		try{
			_skversion = JSON.parse( _skversion );
		}catch(e){
			_skversion={};
			ls.setItem('__wmsk_version__',JSON.stringify(_skversion));
		};
		return function(name,value){
			if(!value){
				var rtn;
				if(_nowversion == _skversion[name]) rtn = ls.getItem(name);
				return rtn;
			}else{
				_skversion[name]=_nowversion;
				ls.setItem('__wmsk_version__',JSON.stringify(_skversion));
				ls.setItem(name,value);
			}
		};
	})(version || '1.0.0')
}()); */


/* 事件处理相关	 */
	//阻止事件冒泡
	/* //注意,该功能里大量使用了dom对象 点 自定义属性的方式,没有用att,这可能会引起不良后果和兼容方面的问题
	wm.formcheck =function(dismax,ruler){
		disform = typeof dismax == 'string' ? w(dismax)[0] : dismax;
		if(!disform[selectorSign]) wm.addkv(disform);
		disform.ruler = ruler ;
		for(var rk in disform.ruler){
			//初始化
			disform.ruler[rk]['isok'] = false;
		}
		//添加阻止提交事件
		wm.addact(disform,'submit',wm.preventdefault);
		//添加组织提交事件标示
		//disform.att('preventsubmit',true);
		disform.preventsubmit=true;
		wm.addact(disform,'change',function(e){
			//var disele = e.target || window.event.srcElement;//change目标元素
			var disele = wm.gettarget(e);
			var ruler = this.ruler;//对象是引用传值
			//console.log(ruler);
			var disname = disele.name;
			if(ruler[disname]){
				// 获取提示信息目标 
				if(ruler[disname]['dis']){
					var notedis = typeof ruler[disname]['dis'] == 'string' ? this[selectorSign](ruler[disname]['dis'])[0] : ruler[disname]['dis'] ;
				}else{
					var notedis = wm.createnode('span','');
					notedis.style.color='#f00';
					ruler[disname]['dis']=notedis;
					notedis.moveto(disele,'after');
				}
				if(disele.value.match(ruler[disname]['ruler'])){//验证规则通过
					var note = '格式正确';
					ruler[disname]['isok'] = true;
					var allisok = true;
					for(var k in ruler){
						if(ruler[k]['isok'] != true){
							allisok = false;
							break;
						}
					}
					if(allisok == true){
						wm.delact(this,'submit',wm.preventdefault);
						this.preventsubmit = false ;
					}
				}else{//验证规则不通过
					if(this.preventsubmit == false){//如果已解绑阻止提交事件,则重新绑定阻止提交事件
						wm.addact(this,'submit',wm.preventdefault);
						//添加已绑定事件标示
						this.preventsubmit = true ;
					}
					var note = ruler[disname]['note'];
				}
				notedis.innerHTML = note;
			}
		});
	} */
	//设置目标的class属性,有则删除,没有则添加该classstr好像不怎么实用的样子
	
	//设置cookie函数,可以添加cookie 修改cookie 和删除 cookie;
	//传入参数是对象,该对象如果没有value属性表示获取cookie;ott单位是毫秒与setTime那个一致
	//注意 

/* 	wm.setSelectorSign=function(str){
		str = str || 'w';
		selectorSign = str;
		window[str]=wm.w;
		//console.log(window);
	}
	var selectorSign = 'w';
	wm.setSelectorSign(selectorSign); */
	/* Object.prototype.next = function(){
		return this.nextElementSibling || this.nextSibling;
	};
	Object.prototype.previous=function(){
		return this.previousElementSibling || this.previousSibling;
	} */
	/* Object.prototype.addkv=function(){
		wm.addkv(this);
	} */
	//扩展的日期对象格式化
wm.extend({
	jsonp:function(obj){
		var dopt = {
			callback : 'callback',//传给服务端的$_GET[xxx]的名称
			url : '',
			success : function(t){}
		};
		wm.extend(dopt,obj);
		var funname = 'wmjsonp' + (new Date()).getTime() ; 
		window[funname] = function(t){
			dopt.success(t);
		}
		var src = dopt.url;
		src += dopt.url.indexOf('?')<0 ? '?' : '&';
		src += dopt.callback + '=' + funname ;
		wm.createnode('script').att('src',src).moveto('head');
	}
});
wm.extend({
	jsona:function(opt){
		var dopt = {};
		wm.extend(dopt,opt);
		dopt.success = function(t,s){
			var d;
			try{
				d = JSON.parse(t);
			}catch(e){
				this.error(t+e);
				return;
			}
			opt.success(d,s)
		};
		return wm.ajax(dopt);
	}
});
/* })(window,undefined); */