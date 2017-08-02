!function () {
	add_qq={
		mqq:{/*手机QQ功能*/
			chat:function(qq, type){/*功能: 弹出对话框.qq:qq号码或链接地址, type:3为企点QQ, 2为营销qq, 否则为私人qq;*/
				var ua=window.navigator.userAgent.toLowerCase(),url;
				if(type===3){
					if(ua.indexOf('mobile')>-1){
						window.location.href=qq;
						return;
					}
					var ifr=document.createElement('iframe');
					ifr.style.display='none';
					ifr.src=qq;
					ifr.onload=onerror=function(){
						setTimeout(function(){
							document.body.removeChild(add_qq.mqq.iframe);
							delete add_qq.mqq.iframe;
						},5000);
					};
					if(this.iframe)this.iframe.parentNode.removeChild(this.iframe);
					this.iframe=ifr;
					document.body.appendChild(ifr);
					return;
				}
				if(ua.indexOf('mobile')>-1){
					if(ua.indexOf('micromessenger')>-1){
						if(type===2)window.location.href='http://wpd.b.qq.com/page/info.php?nameAccount='+qq;
						else window.location.href='http://wpa.qq.com/msgrd?v=1&uin=' +qq + '&site=qq&menu=yes';
						return;
					}
					var url='://im/chat?chat_type='+(type===2?'crm':'wpa')+'&uin='+qq+'&version=1&src_type=web&web_src=http:://'+window.location.hostname;
					if(ua.indexOf('mac os x')> -1)window.location.href='mqq'+url;
					else window.location.href='mqqwpa'+url;
				}
				else{
					if(type===1){
						window.location.href='tencent://message/?Menu=yes&uin='+qq;
					}
					else{
						var script=document.createElement('script');
						window.jsonp=function(data){
							window.location.href=data.data.sign;
						}
						script.src='http://wpd.b.qq.com/cgi/get_sign.php?na='+qq+'&cb=window.jsonp';
						script.onload=script.onerror=function(){
							this.parentNode.removeChild(this);
						};
						document.body.appendChild(script);
					}
					return;
				}
			}
		}
	};
}();
//use like: add_qq.mqq.chat(qqnum, type);
