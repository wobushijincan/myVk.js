(function () {
	var $ = vk;
	vk.scrollView = function (para) {
		return new init(para);
	}
	function init(para) {
		if (typeof (para) == 'string'||!para.element) para = { element: para };
		else if (!para.element) para = { element: $(para) };
		this.view = $(para.element);
		this.view[0].scrollView=this;
		this.auto = typeof (para.auto) != 'undefined' ? para.auto : true;
		this.start = para.start;
		this.end = para.end;
		this.xy = !para.xy||parseInt(para.xy)==0?'center':parseInt(para.xy)==1?'left':'top';
		this.wh=this.xy=='left'?'Width':'Height';
		this.step = this._step = para.step || 1;
		this.timespan = typeof (para.timespan) == 'number' ? (para.timespan||0.005) : 3;
		this.time = typeof (para.time) == 'number' ? para.time  : 0.5;
		this.style=para.style||(para.timespan==0?'linear':'ease-out');
		this.hideStop=para.hideStop;
		var view=this;
		this.swipe=function(){
			if (this.event.endX - this.event.startX < 0)
				view.next();
			else view.prev();
		};
		this.view.on('tapin',function(){
			view.stop();
		}).on('tapout',function(){
			view.goon();
		}).on('swipe',this.swipe);
		this.init();
		this.goon();
	}
	var move={
		next:function(){
			var _this=this;
			var targets=_this.view.children(':not([scrollfix])');
			target=targets.eq(0);
			this.current=target;
			if(typeof(this.start)=='function')this.start.call(this);
			if(this.step>1){
				targets=vk(targets.$.slice(0,this.step));
			}
			else targets=target;
			var _end=function(){
				target.hide();
				_this.view.append(targets);
				target.css('margin-'+_this.xy, target[0].oldValue+'px');
				target.show();
				delete _this.isAnimation;
				if(typeof(_this.end)=='function')
					_this.end.call(_this);
			};
			if(vk.browser.ms&&vk.browser.version<10){
				target.animate('margin-'+this.xy,'-'+(target[0]['offset'+this.wh]+target[0].oldValue*2)*this.step+'px',_end, this.style, this.time);
			}
			else{
				target.css('margin-'+this.xy,'-'+(target[0]['offset'+this.wh]+target[0].oldValue*2)*this.step+'px');
				setTimeout(_end,_this.time*1000);
			}
			return this;
		},
		prev:function(){
			var _this=this;
			var targets=this.view.children(':not([scrollfix])');
			if(this.step==1)
				targets=vk(targets[targets.length-1]);
			else {
				targets=vk(targets.$.slice(targets.length-this.step));
			}
			var target=vk(targets[0]);
			this.current=target;
			target.css('animationDuration', '0s');
			target.css('margin-'+this.xy,'-'+(target[0]['offset'+this.wh]+target[0].oldValue*2)*this.step+'px');
			this.view.append(targets,0);

			if(vk.browser.ms&&vk.browser.version<10){
				if(typeof(_this.start)=='function')this.start.call(this);
				target.animate('margin-'+this.xy,target[0].oldValue+'px',function(){
					delete _this.isAnimation;
					if(typeof(_this.end)=='function')_this.end.call(_this);
				}, this.style, this.time);
			}
			else{
				setTimeout(function(){
					if(typeof(_this.start)=='function')_this.start.call(_this);
					target.css('animationDuration',_this.time+'s');
					target.css('margin-'+_this.xy, target[0].oldValue+'px');
					setTimeout(function(){
						delete _this.isAnimation;
						if(typeof(_this.end)=='function')_this.end.call(_this);
					},_this.time*1000);
				},20);
			}
			return this;
		}
	};
	var fade={
		next:function(){
			var _this=this;
			var target=_this.view.children(':not([scrollfix])');
			target=vk(target[target.length-1]);
			this.current=target;
			if(typeof(this.start)=='function')this.start.call(this);
			var _end=function(){
				target.hide();
				_this.view.append(target,0);
				target.css('opacity', target[0].oldValue);
				target.show();
				delete _this.isAnimation;
				if(typeof(_this.end)=='function')
					_this.end.call(_this);
			};
			if(vk.browser.ms&&vk.browser.version<10){
				target.animate('opacity','0', _end, this.style, this.time);
			}
			else{
				target.css('opacity','0');
				setTimeout(_end,_this.time*1000);
			}
			return this;
		},
		prev:function(){
			var _this=this;
			var target=this.view.children(':not([scrollfix])').eq(0);
			this.current=target;
			target.css('animationDuration', '0s');
			target.css('opacity','0');
			this.view.append(target);
			if(vk.browser.ms&&vk.browser.version<10){
				if(typeof(this.start)=='function')this.start.call(this);
				target.animate('opacity', target[0].oldValue,function(){
					delete _this.isAnimation;
					if(typeof(_this.end)=='function')_this.end.call(_this);
				}, this.style, this.time);
			}
			else{
				setTimeout(function(){
					if(typeof(_this.start)=='function')_this.start.call(_this);
					target.css('animationDuration',_this.time+'s');
					target.css('opacity', target[0].oldValue);
					setTimeout(function(){
						delete _this.isAnimation;
						if(typeof(_this.end)=='function')_this.end.call(_this);
					},_this.time*1000);
				},20);
			}
			return this;
		}
	};
	function scroll(auto){
		if(this.isAnimation||auto&&this.hideStop!=false&&this.view.appear(null,true)==false)return;
		if(this.xy!='center'){
			var clientV='client'+this.wh,scrollV='scroll'+this.wh;
			if(this.view[0][clientV]>=this.view[0][scrollV])return;
			this.isAnimation=true;
			var hide=this.view[0][scrollV]-this.view[0][clientV];
			var items=this.view.children();
			var one=items[0]['offset'+this.wh]+items[0].oldValue*2;
			var count=Math.ceil(hide/one);
			if(count<this.step){
				this.step=count;
			}
			if(this.dir==-1)move.prev.call(this);
			else move.next.call(this);
			this.step=this._step;
		}
		else{
			if(this.view.children().length<2)return;
			this.isAnimation=true;
			if(this.dir==-1)fade.prev.call(this);
			else fade.next.call(this);
		}
	}
	init.prototype = {
		next: function () {
			this.dir=1;
			this.goon();
			scroll.call(this);
			return this;
		},
		prev: function () {
			this.dir=-1;
			this.goon();
			scroll.call(this);
			return this;
		},
		goto: function (index) {
			var targets=this.view.children(':not([scrollfix])');
			for(var i=0;i<targets.length;i++){
				if(targets[i].scrollViewIndex==index||targets[i]==index){
					index=i;
					break;
				}
			}
			if(typeof(index)=='number'&&index>0){
				this.step=index;
				this.next();
			}

			return this;
		},
		stop: function () {
			if(this.timer){
				clearInterval(this.timer);
				delete this.timer;
			}
			return this;
		},
		goon: function () {
			if(!this.auto)return this;
			var _this=this;
			this.stop();
			this.timer=setInterval(function(){
				scroll.call(_this,true);
			},this.timespan*1000);
			return this;
		},
		init:function(){
			this.stop();
			if(this.isAnimation){
				var it=this;
				setTimeout(function(){it.init();},this.time*1024);
				return this;
			}
			var _child=this.view.children().$;
			var child=_child.slice(0);
			for(var i=0;i<child.length;i++){
				if(child[i].getAttribute('scrollfix')!=null){
					child.splice(i,1);
					i--;
				}
			}
			child=vk(child);
			if(this.xy=='center'){
				this.view.css('position',function(v){
					if(v=='static')v='relative';
					return v;
				});
				child.css({
					position:'absolute',
					left:'0px',
					top:'0px',
					height:'100%',
					width:'100%',
					transition:'opacity '+this.time+'s '+this.style
				});
			}
			else if(this.xy=='left'){
				this.view.css('white-space','nowrap');
				child.css({
					display:'inline-block',
					'white-space':'normal',
					transition:'margin-left '+this.time+'s '+this.style
				});
				this.view[0].innerHTML='';
				this.view.append(_child);
			}
			else{
				child.css(transition, 'margin-top '+this.time+'s '+this.style);
			}
			child.each(function(index){
				this.scrollViewIndex=index;
				var xy=this.parentNode.scrollView.xy;
				if(xy!='center')this.oldValue=vk(this).css('margin-'+xy);
				else this.oldValue=vk(this).css('opacity');
			});
		}
	};
})();