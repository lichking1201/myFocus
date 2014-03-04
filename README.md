myFocus
=======

myFocus是一个模仿[新浪](http://fashion.sina.com.cn/s/2013-10-28/220326550.shtml)焦点图轮播模块的练手作品，当时完成的非常草率，在找时间重构中。

![myFocus截图](/screenshot.png)

##参数设置：
	
	+beginSlider: 0,                    //初始图片
	+focusHead: "",                     //焦点图标题
	+counterNav: true,                  //进度与图片说明栏开启
	+controlNav: "thumb",               //缩略图索引开启
	+thumbCount: 5,                     //缩略图数量
	+autoPlay: true                     //自动播放开启
	+pauseTime:4000                     //默认自动播放间隔

##DOM结构与调用：
	
	&lt;div id="focus">
		&lt;img src="" title="">
		&lt;img src="" title="">
		&lt;img src="" title="">
	&lt;/div>
	
	&lt;script type="text/javascript">
		$("#focus").OYD_Focus(options);
	&lt;/script>