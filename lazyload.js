!function(){
	var $=window.ves?window.ves:window.jQuery;
	window.lazyLoad = function(config) {
		new _lazyLoad(config);
	};
	var _lazyLoad=function(config){
		if(typeof(config)!='object'){
			if(typeof(config)=='string')
				config={query:config};
			else config={};
		}
		this.imgs=[];
		if(config.query)this.imgs = $(config.query);
		if(this.imgs.length==0)this.imgs=$('img');
		this.data = config.data?config.data:"data-src";
		this.placeholder = config.placeholder ? config.placeholder : "data:image/gif;base64,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";
		this.init(config);
	};

	_lazyLoad.prototype = {
		init: function(config) {
			var _this = this;
			_this.imgs = Array.prototype.slice.call(_this.imgs);
			_this.setPlaceholder();
			_this.forDom();

			$(window).bind('scroll',function(){
				_this.forDom();
				if(_this.imgs.length==0){
					$(window).unbind('scroll',arguments.callee);
				}
			});
		},
		setPlaceholder: function(){
			var img,prt;
			for(var i = 0; i < this.imgs.length; i++){
				img=this.imgs[i];
				if(!img.src && !img.getAttribute("src")){
					$(img).addClass('lazy');
					img.lazyLoad=this;
					prt=img.parentNode;
					img.src = this.placeholder;
					if($(img).siblings().length>0){
						var _div=document.createElement('div');
						_div.className="_ves_delete";
						prt.insertBefore(_div,img);
						_div.appendChild(img);
						prt=_div;
					}
					var _before=document.createElement('span');
					_before.className="_ves_before";
					var scale=img.getAttribute('scale');
					if(scale){
						scale=scale.split(/[\s]*:[\s]*/gi);
						if(scale.length==2){
							scale=parseInt(scale[1])/parseInt(scale[0])*100+'%';
						}
						else scale=scale[0];
						_before.style.paddingTop=scale;
					}
					prt.insertBefore(_before,img);
					$(prt).addClass('_ves_lazy');
					if(img.getAttribute('_lazy')){
						this.imgs.splice(i, 1);
						i--;
					}
				}
			}
		},
		forDom: function() {
			for (var i = 0; i < this.imgs.length; i++) {
				var img = this.imgs[i];
				if (this.appear(img)&&$(img).hasClass('lazy')) {
					this.setSrc(img, img.getAttribute(this.data));
					this.imgs.splice(i, 1);
					i--;
				}
			}
			if(this.imgs.length==0)delete this;
		},
		appear: function(obj) {
				var objTop = obj.getBoundingClientRect().top,
				docHeight = document.documentElement.clientHeight;
			return (objTop>0&&objTop<= docHeight)||(objTop>0==false&&(objTop+obj.offsetHeight)>0);
		},
		setSrc: function(target, src) {
			var c = new Image();
			c.onload = function(){
				var prt=$(target.parentNode);
				if(prt.hasClass('_ves_lazy')==false)return;
				else prt.removeClass('_ves_lazy');
				target.src = src;
				var r = target.className;
				$(target).removeClass('lazy');
				delete target.lazyLoad;
				target.parentNode.removeChild(target.previousSibling);
				if(prt.hasClass('_ves_delete')){
					prt=prt[0];
					prt.parentNode.insertBefore(target,prt);
					prt.parentNode.removeChild(prt);
				}
				if(window.ves&&window.ves.imgCover&&target.getAttribute('imgcover'))
					ves.imgCover.call(target);
				c.onload = null;
			}
			c.src = src;
		}
	};
	var addCSS=function(selector, rules) {
		var style=addCSS.style;
		if(!style){
			var head=document.head||document.getElementsByTagName('head')[0];
			style = document.createElement('style');
			style.type = 'text/css';
			head.appendChild(style);
			addCSS.style=style.sheet ||style.styleSheet;
			style=addCSS.style;
			addCSS.index=-1;
		}
		addCSS.index+=1;
		var index=addCSS.index;
		if (style.insertRule) {
			style.insertRule(selector + "{" + rules + "}",index);
		} else if (style.addRule) {
			style.addRule(selector, rules, index);
		}
	};
	$(function(){
		addCSS('._ves_lazy','display:inline-block;width:100%;height:100%;text-align:center;background-color:#fff;');
		addCSS('._ves_lazy img.lazy','width:auto !important;height:auto !important;max-height:100%;max-width:100%;display:inline-block !important; vertical-align:middle  !important;');
		addCSS('._ves_lazy ._ves_before','display:inline-block;width:0;height:100%;vertical-align:middle;box-sizing:border-box;');
		lazyLoad();
	});

}();
