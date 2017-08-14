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