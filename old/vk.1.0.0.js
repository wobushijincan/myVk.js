function iget(id){
	var obj = document.getElementById(id);
	return obj;
}

function nget(ob, name){
	var obs = obj.getElementsByTagName(name);
	if(obs.length == 0){
		return obs[0];
	}else{
		return obs;
	}
}

//封装的get形式的ajax函数
function urlget(url, disdiv){
	var newxmlHttp = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveObject('Microsoft.XMLHTTP');
	newxmlHttp.open('get', url);
	newxmlHttp.onreadystatechange = function(){
		if(newxmlHttp.readyState ==4 && newxmlHttp.status == 200){
			disdiv.innerHTML = newxmlHttp.responseText;
		}
	}
	newxmlHttp.send(null);
}

a.onreadystatechange = function(){
	if(a.readyState == 4 && a.status == 200){
		reada = a.getdata;
	}
}

//应用函数
function changeById(destUrl, divid, invalue, lield){
	var url = destUrl + invalue + "&&rdm" + Math.random();
	var x = iget(diviv).cells(lield);
	urlget(url, x);
}

var obj = {a: 1, arr: [2,3]};
var shallowObj = shallowCopy(obj);

function shallowCopy(src){
	var dst = {};
	for(var prop in src){
		if(src.hasOwnProperty(prop)){
			dst[prop] = src[prop];
		}
	}
	return dst;
}

var china = {
	nation: 'china',
	birthplaces: ['shanghai', 'beijing', 'guangzhou'],
	skinclor: 'yellow',
	friends: ['sk', 'ls']
}
function deepCopy(o, c){
	var c = c || {};
	for(var i in o){
		if(typeof o[i] == 'object'){
			if(o[i].constructor == 'Array'){
				c[i] = [];
			}else{
				c[i] = {};
			}
			deepCopy(o[i], c[i]);
		}else{
			c[i] = o[i];
		}
	}
	return c;
}

var result = {name: 'result'};
result = deepCopy(china, result);
console.log(result);



function extendCopy(p) {
	var c = {};
	for (var i in p) { 
		c[i] = p[i];
	}
	c.uber = p;
	return c;
}





