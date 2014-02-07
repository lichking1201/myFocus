/**
 * Created with JetBrains WebStorm.
 * User: lichen
 * Date: 13-11-19
 * Time: 下午3:30
 */

/**
 * 仿http://fashion.sina.com.cn/s/2013-10-28/220326550.shtml 焦点图
 * @DOM
 *      <div id="focus">
 *          <img src="" title="">
 *          <img src="" title="">
 *          <img src="" title="">
 *      </div>
 * @CSS
 *      <link rel="stylesheet" type="text/css" href="focus.css" media="all" />
 * @Usage
 *      $("#focus").OYD_Focus(options);
 * @options
 *      beginSlider: 0,                    //初始图片
 *      focusHead: "",                     //焦点图标题
 *      counterNav: true,                  //进度与图片说明栏开启
 *      controlNav: "thumb",               //缩略图索引开启
 *      thumbCount: 5,                     //缩略图数量
 *      autoPlay: true                     //自动播放开启
 *      pauseTime:4000                     //默认自动播放间隔
 *↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ 未实现
 *      thumbNum: true,                    //显示缩略图角标数字
 */

(function ($) {

    $.fn.OYD_Focus = function (options) {

        var opt = $.extend({}, $.fn.OYD_Focus.defaults, options);

        return this.each(function () {
            //关键变量
            var vars = {
                totalSlides: 0,       //图片总数
                currentImg: "",       //当前图片地址
                currentSlider: 0,     //当前图片计数器
                imgItem: [],
                barLeft:0
            };

            var focus = $(this);
            focus.addClass("focusSlider");

            var focusWidth = focus.width(),
                imgWrap = $('<span class="focus-slider"></span>');   //滑动块。对图片进行包裹，用于布局

            //图片包裹，定宽，信息存储，初始化
            var kids = focus.children();
            kids.each(function () {
                var child = $(this),
                    link = "";
                if (!child.is("img")) {
                    if (child.is("a")) {
                        link = child.attr("href");
                        child = child.find("img:first")
                    }
                    child = child.find("img:first");
                }
                child.wrap(imgWrap);
                var slider = $(".focus-slider");
                slider.width(focusWidth);
                var ary = {
                    img: child,
                    imgSrc: child.attr("src"),
                    imgTitle: child.attr("title"),
                    slider: slider
                };
                vars.imgItem.push(ary);
                vars.totalSlides++;
                slider.remove();
            });

            //图片总数小于缩略图显示数量时，缩略图区块显示所有图片
            if (vars.totalSlides < opt.thumbCount) {
                opt.thumbCount = vars.totalSlides
            }

            //包裹所有slider
            var sliderWrap = $('<div class="focus-slider-all"></div>');
            focus.append(sliderWrap);
            var sliderAll = focus.find(".focus-slider-all");

            //初始图片
            vars.currentSlider = opt.beginSlider;
            $(vars.imgItem[vars.currentSlider].slider).appendTo(sliderAll);

            //添加头部标题
            var focusHead = $('<div class="focus-head"><h3>' + opt.focusHead + '</h3></div>');
            if (opt.focusHead != "") {
                focus.before(focusHead)
            }

            //计数进度导航
            var counterWrap = $('<div class="focus-info"><div class="focus-counter"><span class="current-counter">' + (vars.currentSlider + 1) + '</span>/<span class="total-counter">' + vars.totalSlides + '</<span></div><p class="focus-title">' + vars.imgItem[vars.currentSlider].imgTitle + '</p></span></div> ');
            if (opt.counterNav) {
                focus.after(counterWrap);
                var counter = focus.next(".focus-info");
                $(".focus-title").width(Math.ceil((focusWidth - 110) / 16) + "em");      //标题向下取整截字
            }

            //缩略图导航
            var controlWrap = $('<div class="focus-control"></div>'),
                thumbWrap = $('<a id="focus-thumbsLeft"></a><div class="focus-thumb"></div><div class="focus-bar"><span></span></div><a id="focus-thumbsRight"></a>');

            if (opt.controlNav != "") {
                focus.parent().append(controlWrap);
                var controlBlk = focus.siblings(".focus-control");

                if (opt.controlNav == "thumb") {
                    controlBlk.append(thumbWrap);
                    var thumbBlk = controlBlk.children(".focus-thumb"),
                        thumbCount = opt.thumbCount;


                    var thumbList = "";       //生成缩略图列表DOM
                    for (var i = 0; i < vars.totalSlides; i++) {
                        thumbList += '<li><img src="' + vars.imgItem[i].imgSrc + '" alt=""/><b></b></li>'
                    }
                    thumbBlk.append($('<ul>' + thumbList + '</ul>'));

                    var thumb = thumbBlk.find("li"),
                        thumbUl = thumbBlk.find("ul"),
                        thumbBlkWidth = focusWidth - 40,           //-40左右按钮宽度
                        thumbWidth = thumbBlkWidth / thumbCount - 10;    //除以缩略图个数，-10间距，得到每个缩略图外框宽

                    thumbBlk.width(thumbBlkWidth).height(thumbWidth * 0.75 + 10);  //缩略图可视区域宽、高
                    thumb.width(thumbWidth).height(thumbWidth * 0.75).eq(0).addClass("focus-active"); //缩略图4:3
                    controlBlk.find("a").css("top", (thumbWidth * 0.75 + 10 - 34) / 2); //左右按钮上下居中

                    var timer;
                    controlBlk.find("#focus-thumbsLeft").on({     //缩略图区域向左移动
                        mousedown: function () {
                            var o = $(this);
                            timer = setInterval(function () {
                                o.pixMove("left", thumbUl)
                            }, 10)
                        },
                        mouseup:function () {
                            var o = $(this);
                            clearInterval(timer);
                        }
                    });

                    controlBlk.find("#focus-thumbsRight").on({   //缩略图区域向右移动
                        mousedown: function () {
                            var o = $(this);
                            timer = setInterval(function () {
                                o.pixMove("right", thumbUl)
                            }, 10);
                        },
                        mouseup: function () {
                            var o = $(this);
                            clearInterval(timer);
                        }
                    });

                    //缩略图宽高自适应
                    thumb.each(function () {
                        var thumb = $(this),
                            thumbImg = thumb.find("img"),
                            img = new Image();
                        img.src = thumbImg.attr("src");
                        if (img.width * 0.75 > img.height) {
                            thumbImg.width(thumbWidth).css("padding-top", (thumbWidth * 0.75 - thumbImg.height()) / 2)
                        } else {
                            thumbImg.height(0.75 * thumbWidth)
                        }
                    });
                    //缩略图点击切换大图
                    thumb.on("click", function () {
                        var thumb = $(this),
                            current = vars.currentSlider,
                            thumbNum = thumb.index(),
                            n;
                        thumb.addClass("focus-active").siblings("li").removeClass("focus-active");
                        n = thumbNum - current;
                        focusMove(n);
                        vars.currentSlider = thumbNum;
                    });
                    var track = controlBlk.children(".focus-bar"),
                        bar = track.children("span"),
                        iMouse = {},
                        iPosition = {star:0,now:0},
                        ratio =  ((thumbWidth+10) * (vars.totalSlides-1) - thumbBlkWidth)/(thumbBlkWidth - bar.width()),  //缩略图总宽与可视区宽度比值
                        iScroll = 0;
                    bar.bind("mousedown",star);
                    track.bind("mousedup",drag);

                }
            }

            function star( event ){
                $( "body" ).addClass( "noSelect" );
                var barLeft   = parseInt( bar.css( "left" ), 10 );
                iMouse.start = event.pageX;
                iPosition.start = barLeft;
                $( document ).bind( 'mousemove', drag );
                $( document ).bind( 'mouseup', end );

            }
            function end(){
                $( "body" ).removeClass( "noSelect" );
                $( document ).unbind( 'mousemove', drag );
                $( document ).unbind( 'mouseup', end );
                bar.unbind( 'mouseup', end );
                document.ontouchmove = document.ontouchend = null;
            }
            function drag( event )
            {
                iPosition.now = Math.min((focusWidth-bar.width()),Math.max((iPosition.start + event.pageX  - iMouse.start),0));

                iScroll = iPosition.now *ratio;
                thumbUl.css( "left", -iScroll );
                bar.css( "left", iPosition.now );

            }



            //检测鼠标位置，焦点图自动切换、悬停暂停、离开继续、点击切换
            var x, playTime;

            if (opt.autoPlay) {
                playTime = setInterval(focusMove, opt.pauseTime)
            }

            //焦点图绑定事件
            focus.on({
                mousemove: function (event) {
                    var focusLeft = $(this).offset().left;
                    x = event.pageX - focusLeft;
                    if (x < focusWidth / 2) {
                        $(this).css("cursor", "url('http://i2.sinaimg.cn/dy/deco/2012/1218/hdfigure/hd_left_arrow.cur'),pointer");
                    } else {
                        $(this).css("cursor", "url('http://i2.sinaimg.cn/dy/deco/2012/1218/hdfigure/hd_right_arrow.cur'),pointer")
                    }
                },
                mouseover: function () {
                    clearInterval(playTime)
                },
                mouseleave: function () {
                    playTime = setInterval(focusMove, opt.pauseTime)
                },
                click: function () {
                    focusMove();
                }
            });
            controlBlk.on({
                mouseover: function () {
                    clearInterval(playTime)
                },
                mouseleave: function () {
                    playTime = setInterval(focusMove, opt.pauseTime)
                }
            });







            //焦点图移动n位，正数左移，负数右移
            function focusMove(n) {
                if (n == 0) {      //不移动
                    return
                }
                else if (n > 0) {       //焦点图向左移动n位
                    slideLeft(n);
                }
                else if (n < 0) {      //焦点图向右移动-n位
                    slideRight(-n);
                }
                else {                  //n为空或NAN，单张移动，并可首尾循环
                    if (x < focusWidth / 2) {
                        if (vars.currentSlider == 0) {
                            slideLeft(vars.totalSlides - 1);
                        } else {
                            slideRight(1);
                        }
                    } else {
                        if (vars.currentSlider == vars.totalSlides - 1) {
                            slideRight(vars.totalSlides - 1)
                        } else {
                            slideLeft(1)
                        }
                    }
                }
                //焦点图切换时，关联缩略图
                thumb.eq(vars.currentSlider).addClass("focus-active").siblings("li").removeClass("focus-active");
                var activeLeft = thumb.eq(vars.currentSlider).position().left,    //缩略图选中项左位移
                    defaultPosition = Math.ceil(opt.thumbCount / 2),              //选中项固定位置：居中
                    activePosition = activeLeft / thumb.outerWidth(true),          //选中项位置
                    ulLeft;

                if (vars.totalSlides > opt.thumbCount) {

                    if (activePosition <= vars.totalSlides - defaultPosition) {          //选中项位置
                        if (activePosition < defaultPosition) {                         //选中项在固定位置前时，不滚动
                            ulLeft = 0;
                        } else {
                            ulLeft = -activeLeft + (defaultPosition - 1) * thumb.outerWidth(true)
                        }          //选中项在固定位置后，滚动到固定项位置
                    } else {
                        ulLeft =  -(vars.totalSlides - opt.thumbCount) * thumb.outerWidth(true);
                    }
                    thumbUl.animate({left: ulLeft});
                    bar.animate({left:-ulLeft/ratio});
                }
            }
            //缩略图滚动
            $.fn.pixMove = function (direction, obj) {
                var ch = obj.children(),
                    chW = ch.outerWidth(true),
                    chN = ch.size(),
                    chsW = chW * chN,
                    l = parseInt(obj.css("left"));
                obj.css({position: "absolute", left: l}).parent().css("position", "relative");

                if (direction == "right") {
                    if (l > obj.parent().width() - chsW) {
                        l -= 10;
                        obj.css({left: l + "px"});
                        bar.css({left: -l/ratio + "px"});
                    } else {
                        obj.css({left: obj.parent().width() - chsW});
                    }
                }
                else if (direction == "left") {
                    if (l < 0) {
                        l += 10;
                        obj.css({left: l + "px"});
                        bar.css({left: -l/ratio + "px"});
                    } else {
                        obj.css({left: 0});
                    }
                }

            };

            //根据当前图片序号，构建滑块
            function createSlider(currentSlider) {
                return $(vars.imgItem[currentSlider].slider)
            }

            //向左滑动n张图片   未来需要实现循环滚动
            function slideLeft(n) {

                var currentSlider = createSlider(vars.currentSlider),
                    slideLeft = createSlider(vars.currentSlider + n);
                vars.currentSlider += n;
                if (vars.currentSlider >= vars.totalSlides) {
                    slideLeft = createSlider(0);
                    vars.currentSlider = 0;
                }
                currentSlider.after(slideLeft);
                slideLeft
                    .animate({left: -focusWidth}, function () {
                        $(this).css("left", 0)
                    });
                currentSlider
                    .animate({left: -focusWidth}, function () {
                        $(this).css("left", 0).remove()
                    });
                focus.height(slideLeft.height());
                $(".focus-title").html(vars.imgItem[vars.currentSlider].imgTitle);
                counter.find(".current-counter").text(vars.currentSlider + 1);
            }

            //向右滑动n张图片    未来需要实现循环滚动
            function slideRight(n) {
                var currentSlider = createSlider(vars.currentSlider),  //当前图片：切换前图片
                    slideRight = createSlider(vars.currentSlider - n); //切换后的图片
                vars.currentSlider -= n;
                if (vars.currentSlider < 0) {
                    slideRight = createSlider(vars.totalSlides - 1);
                    vars.currentSlider = vars.totalSlides - 1;
                }
                currentSlider.after(slideRight);
                slideRight
                    .css("left", -focusWidth * 2)
                    .animate({left: -focusWidth}, function () {
                        $(this).css("left", 0)
                    });
                currentSlider
                    .animate({left: focusWidth}, function () {
                        $(this).css("left", 0).remove()
                    });
                focus.height(slideRight.height());
                $(".focus-title").text(vars.imgItem[vars.currentSlider].imgTitle);
                counter.find(".current-counter").text(vars.currentSlider + 1);
             }
            function focusRun(slider, kids, settings, nudge) {
            }
        })
    };

    $.fn.OYD_Focus.defaults = {
        beginSlider: 0,
        focusHead: "",
        counterNav: true,
        controlNav: "thumb",
        thumbCount: 5,
        thumbNum: true,
        autoPlay: true,
        pauseTime: 4000
    }
})(jQuery);
