(function () {
	var $ = ves;
	var views = [];
	var start=true;
	ves.pageView = function (para) {
		views.unshift(new init(para));
		if(start){
			start=false;
			$(window).on('resized',function () {
				for(var i=0;i<views.length;i++){
					views[i].init();
				}
			});
			$(window).on('scrolled',function () {
				for(var i=0;i<views.length;i++){
					if (views[i].view.appear(true)){
						views[i].goon();
					}
					else views[i].stop();
				}
				scrolled=true;
			});
		}
		return views[0];
	};
	ves.pageView.viewFor = function (view) {
		for (var i = 0; i < views.length; i++) {
			if (views[i].view[0] == view)
				return views[i];
		}
	};
	function init(para) {
		var it = this;
		if (typeof (para) == 'string'||!para.element) para = { element: para };
		else if (!para.element) para = { element: $(para) };
		this.view = $(para.element);
		this.view[0].pageview=this;
		this.holder = this.view.parent();
		this.nextButton = this.holder.find('.next:last');
		this.prevButton = this.holder.find('.prev:last');
		this.pageIndex = this.holder.find('.index:last');
		this.index =-1;
		this.isAuto = typeof (para.auto) != 'undefined' ? para.auto : true;
		this.complete = para.complete;
		this.xy = typeof (para.xy) != 'undefined' ? para.xy : 'x';
		this.xy=this.xy!='x'&&this.xy!='y'?false:this.xy;
		this.timespan = typeof (para.timespan) == 'number' ? para.timespan : 3;
		this.speed = typeof (para.speed) == 'number' ? para.speed  : 0.8;
		this.imgCover = para.imgCover;
		this.view[0].style.overflow='hidden';
		this.view.css('position',function(v){
			if(v=='static') return 'relative';
		});
		this.holder.css('position',function(v){
			if(v=='static') return 'relative';
		});
		this.nextButton.on('tap',function () {
			var _startT=new Date();
			if(this.startT){
				if((_startT-this.startT)/1000<(it.speed+0.2))return;
			}
			this.startT=_startT;
			it.next(); $.event.stopDefault(); 
		});
		this.prevButton.on('tap', function () {
			var _startT=new Date();
			if(this.startT){
				if((_startT-this.startT)/1000<(it.speed+0.2))return;
			}
			this.startT=_startT;
			it.prev(); $.event.stopDefault(); 
		});
		this.holder.on('tapin',function(){
			it.stop();
		}).on('tapout',function(){
			it.goon();
		}).on('swipe',function () {
			var _startT=new Date();
			if(this.startT){
				if((_startT-this.startT)/1000<(it.speed+0.2))return;
			}
			this.startT=_startT;
			if(it.xy=='x'){
				if (ves.event.data.endX - ves.event.data.startX < 0) it.next();
				else it.prev();
			}
			else{
				if (ves.event.data.endY - ves.event.data.startY < 0) it.next();
				else it.prev();
			}
			it.goon();
		});
		this.init(para.current);
	}
	function _prev(dir){
		if(this.current){
			this.current.removeClass('current')
			if(ves.browser.core=='ms'&&ves.browser.version<10){
				if(this.xy){
					if(this.xy=='x')this.current.stop().animate({'left':dir*this.view[0].clientWidth+'px'});
					else this.current.stop().animate({'top':dir*this.view[0].clientHeight+'px'});
				}
				else this.current.stop().animate({opacity:0,filter:'alpha(opacity=0)'});
			}
			else{
				if(this.xy){
					if(this.xy=='x')this.current.css('left',dir*this.view[0].clientWidth+'px');
					else this.current.css('top',dir*this.view[0].clientHeight+'px');
				}
				else this.current.css('opacity',0);
			}
		}
	}
	function _reset(next,dir){
		next.css('display','none');
		if(this.xy){
			if(this.xy=='x'){
				next.css('left', dir*this.view[0].clientWidth+'px');
			}
			else{
				next.css('top', dir*this.view[0].clientHeight+'px');
			}
		}
		else{
			next.css({opacity:0,filter:'alpha(opacity=0)'});
		}
		next.css('display','block');
	}
	function _view(next, dir){
		if(!this.current||this.current[0]!=next[0]){
			_reset.call(this,next,dir);
			_prev.call(this,0-dir);
			next.addClass('current');
			if(ves.browser.core=='ms'&&ves.browser.version<10){
				if(this.xy){
					if(this.xy=='x')next.stop().animate({left:'0px'});
					else next.stop().animate({top:'0px'});
				}
				else {
					next.animate({opacity:1,filter:'alpha(opacity=100)'});
				}
			}
			else{
				if(this.xy){
					if(this.xy=='x')next.css('left','0px');
					else next.css('top','0px');
				}
				else {
					next.css('opacity', 1);
				}
			}
			var it=this;
			this.current=next;
			setIndex(this);
			setTimeout(function () {
				next.siblings().css('display','none');
				if(typeof(it.complete)=='function')
					it.complete.call(it);
				if(window.lazyLoad){
					lazyLoad(ves('img',next));
				}
			}, this.speed*1000);
		}
	}
	function setIndex(it) {
		it.pageIndex.children().removeClass('current');
		it.pageIndex.children().eq(it.index).addClass('current');
	}
	init.prototype = {
		next: function () {
			var next=this.current;
			if(this.items.length>1){
				next = this.current.next();
				if(next.length==0){
					next=ves(this.items[0]);
					this.index=0;
				}
				else this.index+=1;
			}
			_view.call(this,next,1);
			return this;
		},
		prev: function () {
			var next = this.current.prev();
			if(next.length==0){
				next=ves(this.items[this.items.length-1]);
				this.index=this.items.length-1;
			}
			else this.index-=1;
			_view.call(this,next,-1);
			return this;
		},
		goto: function (index) {
			if(index<0||index>this.items.length-1)return this;
			var next = ves(this.items[index]);
			if(index<this.index){
				this.index = index;
				_view.call(this,next,-1);
			}
			else {
				this.index = index;
				_view.call(this,next,1);
			}
			return this;
		},
		stop: function () {
			clearInterval(this.timer);
			this.timer = null;
			return this;
		},
		goon: function () {
			if (this.isAuto){
				var it = this;
				clearInterval(this.timer);
				this.timer = setInterval(function () {
					it.next();
				}, this.timespan*1000);
			}
			return this;
		},
		init: function (_current) {
			if (this.view[0].offsetHeight == 0) return this;
			this.current=null;
			this.stop();
			var node, last;
			var items=this.view.children();
			items.css({
				'position':'absolute',
				'left':'0px','top':'0px',
				'display':'block',
				'height':'100%','width':'100%',
				'transition':'all 0s ease 0s'
			}).removeClass('current');
			if(this.xy)items.css('left','100%');
			else items.css({'opacity':0,'filter':'alpha(opacity=0)'});
			if($.imgCover){
				$.imgCover($('img[imgcover]',this.view));
			}
			if (items.length > 1) {
				last =items.eq(0);
				last.siblings().each(function () {
					last.append($(this).children());
				}).remove();
			}
			(function () {
				if ((this.scrollHeight-10) > this.clientHeight){
					last = $(this).children('ul:last');
					node = last[0].cloneNode();
					node.innerHTML='';
					node.removeAttribute('bind');
					(function () {
						ves(node).append(last.children('li:last')[0],0);
						if ((this.scrollHeight-10) > this.clientHeight)
							arguments.callee.call(this);
					}).call(this);
					this.appendChild(node);
					arguments.callee.call(this);
				}
			}).call(this.view[0]);
			items=this.view.children();
			this.items=items;
			if(this.xy=='y'){
				items.css({'left':'0px','top':'100%'});
			}
			if (items.length > 1)this.holder.addClass('page');
			else this.holder.removeClass('page');

			if (this.pageIndex.length > 0) {
				var num = this.pageIndex.children();
				if (this.pageIndex.attr('type') == 'number') {
					this.pageIndex.html('');
					for (var i = 0; i < this.view.children().length; i++) {
						num = document.createElement('span');
						num.innerHTML = i + 1;
						this.pageIndex.append(num);
					}
				}
				else if (this.pageIndex.attr('type') == 'copy') {
					if (num.length > 0) num = $(num[0].cloneNode(true)).removeClass('current')[0];
					else num = document.createElement('span');
					this.pageIndex.html('');
					for (var i = 0; i < this.view.children().length; i++) {
						this.pageIndex.append(num.cloneNode(true));
					}
				}
				var it = this;
				this.pageIndex.children().on('tap',function () {
					it.goto($(this).index());
					$.event.stopDefault();
				}).eq(0).addClass('current');
			}
			this.goto(_current||0);
			items.css('transition','all '+this.speed+'s linear');
			if(this.view.appear(true))this.goon();
			return this;
		}
	};
})();