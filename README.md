#把以往常用的一些操作封装成函数，调用的时候直接调用就好！

#vk.js
> vk大部分功能和JQuery相似, 为了和JQuery并存且不发生冲突, 外部只能通过vk来访问内部的属性和方法. 
>
> 对于习惯用符号$的程序员, 也可以用以下方式引用:
>
> ```
>	var $=vk;
> ```

## 1 全局变量和方法

```
	//相当于$(function(){});页面文档准备就绪后执行.
	vk.ready(function(){...}); 

	//页面准备就绪并且所有图片已加载完后执行.
	vk.loaded(function(){...}); 
```

**注意：**下面的`vk`均用`$`代替

```
	$.html; //html节点(u实例)
	$.body; //body节点(u实例)
	$.head; //head节点(u实例)

	$.query; //获取URL上的键值对, 用法: $.query['name']. 
	$.queryUrl();//根据$.query, hostname, pashname, hash重新生成并返回新的url

	$.cookie; //获取浏览器存储的cookie值, 用法: $.cookie['name']. 

	$.browser={ //获取浏览器的各种属性:
		device:{ //设备, 对象有以下属性, 属性值为bool值: 
			mobile:true, //是否是移动设备
			ios:true, //是否是ios系统
			android:true, //是否是android系统
			iphone:true, //是否是iphone
			ipad:true //是否是ipad
		},
		app:{ //软件, 对象有以下属性, 属性值为bool值:
			wechat:true, //是否是微信
			qq:true, //是否是qq
			qqb:true, //是否是qq浏览器
			uc:true //是否是uc浏览器
		},
		core:'ms'||'o'||'webkit'||'moz'// 浏览器内核
	};
	
```

**文档准备好后, 会自动给html节点添加名为$.browser.device和$.browser.app的className:**

```
	举个栗子：
	<html class="mobile ios qq">
	//如果是IE浏览器,还会带上版本号:
	<html class="mobile ios ie9">,
```

**这样设计的初衷是方便对各种设备和环境编写不一样的css**

## 1.1 ajax

```
	$.ajax({//ajax异步请求
		url:'', //url可不传, 默认为当前页面地址; 传null则不发生请求. 
		type:'', //post,get, 默认为GET, 不区分大小写; 当data有值时默认为POST. 
		data:{}, //提交数据, 可不传. 
		dataType:'', //返回数据的类型json,script,xml,text. 可不传, 默认会根据服务器返回的标头信息自动返回对应的数据类型. 
		async:true, //是否异步请求, 默认为异步. 
		file:node, //异步提交文件, 值为type="file"的表单元素, 可为选择器字符串或node类型, 其父级元素一定要有form, form可以不设置文件相关属性. 
		charset:'', //文件编码, 默认为UTF-8. 
		contentType:'', //请求页面的类型, 默认为"text/html;charset=UTF-8". 
		cache:false,//请求是否缓存, 默认为不缓存. 
		content:object,//传入用于执行完后用this引用
		error:function(){
			//请求发生错误时回调.
		},
		success:function(data){
			//请求正常返回数据后回调. 
			//this->content,或window
			//data:返回的数据
		}
	});

```

### 1.2 扩展vk实例属性

```
	$.prototype('name','value'||function(){});
```

## 2 vk的事件绑定机制

```
	$('选择器').bind('event',function(){
		//event事件名称可为字符串、空格或,|隔开的字符串、数组. 
		//当不传入方法时, 触发事件;
	});
	$('选择器').unbind('event',function);//解绑事件,function不传时解绑所有绑定的方法
	//等同于以下方式
	$('选择器').on('event',function (){}); 		
	$('选择器').off('event',function); 

	//绑定event事件除了可以使用浏览器默认提供事件之外, 另新添了一些兼容电脑端和移动端的事件:	
	$('选择器').on('click',function(){});//常用的浏览器事件,不一一列举了

	//..............................
	$('选择器').on('tap',function(){}); //电脑端click, 移动端比click反应更快, 消除了点击延迟. 
	$('选择器').on('tapin',function(){}); //电脑端mouseover, 移动端按住触摸屏. 
	$('选择器').on('tapout',function(){}); //电脑端mouseout, 移动端手指离开触摸屏. 
	$('选择器').on('tapstart',function(){}); //电脑端mousedown, 移动端按住触摸屏. 
	$('选择器').on('tapend',function(){}); //电脑端mouseup, 移动端手指离开触摸屏. 
	$('选择器').on('swipe',function(){}); //电脑端按住鼠标, 拖动一段距离, 松开鼠标后触发; 移动端手指按住触摸屏, 滑动一段距离, 松开手指后触发. 
	$('选择器').on('swiping',function(){}); //电脑端按住鼠标, 拖动时触发; 移动端手指按住触摸屏, 滑动时触发.
	$('选择器').on('press',function(){}); //电脑端长按鼠标0.5触发, 移动端手指按压0.5触发.

	$.event={//可以读取各种当前事件的数据和方法:
		data:{//事件相关数据:
			startX: 'number', //事件开始时的屏幕X坐标值.
			startXL: 'number', //当前事件开始时的屏幕X坐标值和上次事件开始时的屏幕X坐标值之差.
			startY: 'number', //事件结束时的屏幕Y坐标值.
			startYL: 'number', //当前事件开始时的屏幕Y坐标值和上次事件开始时的屏幕Y坐标值之差.
			startT: 'Data', //事件开始时间(Date对象).
			endX: 'number', //事件结束时的屏幕X坐标值.
			endXL: 'number', //当前事件结束时的屏幕X坐标值和上次事件结束时的屏幕X坐标值之差.
			endY: 'number', //事件结束时的屏幕Y坐标值.
			endYL: 'number', //当前事件结束时的屏幕Y坐标值和上次事件结束时的屏幕Y坐标值之差.
			endT: 'Data', //事件结束时间(Date对象).根据startT和endT可以知道两次事件的时间间隔.
			moveX: 'number', //移动事件当前位置的屏幕X坐标值.
			moveXR: 'number', //移动事件水平方向改变的次数.
			moveY: 'number', //移动事件当前位置的屏幕Y坐标值.
			moveYR: 'number', //移动事件垂直方向改变的次数.
			moveXS: 'number', //移动事件水平方向当前的步长和方向.
			moveXSS: 'number', //移动事件水平方向开始的步长和方向.
			moveYS: 'number', //移动事件垂直方向当前的步长和方向.
			moveYSS: 'number', //移动事件垂直方向开始的步长和方向.
			moveT: 'number' //整个移动事件所用的时间(秒)
		},
		stopParent:function, //禁止冒泡
		stopDefault:function //禁止事件的默认行为.
	};
```

## 3 对象实例变量和方法

> 实例变量和方法命名大体和jQuery的一致, 区别如下:

```
	//判断实例节点是否包含node节点, node可为单个节点, 或者节点数组.
	//当为数组时,数组里面的每个节点都必须被实例节点包含,否则返回false .
	//node为节点类型
	$('选择器').contains('node'); 

	//参数key可为object类型{key:value}; value值可为function类型
	//relative为bool类型, 相对于原属性值,比如.css('top',10,true);表示在原top值的基础上加10px, 可为空
	$('选择器').css('key','value','relative'); 

	//value为number类型或者字符串类型带px
	//relative为bool类型, 相对于原属性值的基础上加或减value(number类型), 可为空
	$('选择器').height('value','relative'); 
	$('选择器').width('value','relative');

	//如果要获取节点的实际高度包括内外边距和边框,可直接用原生:$(element)[0].offsetHeight;
	//获取内容包括滚动区域的高度$(element)[0].scrollHeight
	$(document).height(); //获取文档范围内的可视高度
	$(window).height(); //获取浏览器窗口的高度
	$(element).height(); //获取节点的css高度,不包括内外边距和边框

	//这些方法的参数都可以是字符串,数组,或以','空格和'|'隔开的字符串
	$('选择器').addClass().removeClass().toggleClass().hasAttr().noAttr().hasClass().noClass(); 

	$('选择器').insertBefore('node').insertAfter('node');
	//将实例节点插入到参数节点node的前面或后面.
	//实例节点和参数节点node都可以是数组. 
	//如果参数节点node是数组,除了实例节点本身外,还会另外克隆多份节点插入到其他的参数节点node前后位置.
	//node为节点类型

	$('选择器').append('node','index');
	//将参数节点node插入到实例节点的index位置,
	//如果index为空,默认为插入到实例节点的最后面位置.
	//index为number类型, node为节点类型

	$('选择器').remove();
	//移除实例节点.

	/**
	animate部分还有点bug
	*
	*/

	$('选择器').animate({},callback);
	//动画结束后执行callback

	$('选择器').stop('end'); 
	//停止animate, 当end==true时, 停止动画到最后状态.

	$('选择器').pause('type');
	//中断animate
	//当type===0时继续animate; 
	//当type===2时如果animate处于中断状态则继续animate, 否则中断, 切换两个状态.

```

##再更新...