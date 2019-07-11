
$.fn.extend({
    /** 光标处插入**/
    insertAtCaret : function (myValue) {
        var $t = $(this)[0];
        if (document.selection) {
            this.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
        } else
        if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
        } else {
            this.value += myValue;
            this.focus();
        }
    },

    /** 跑马灯**/
    slideSroll:function(value){
        var docthis = this;
        //默认参数
        value=$.extend({
            elem:'li',
            dir:"top", 
            li_h:"30",
            time:3000,
            movetime:1000
        },value)

        //向上滑动
        if(value.dir == "top"){
            function autoani(){
                $(value.elem+":first",docthis).animate({"margin-top":-value.li_h},value.movetime,function(){
                    $(this).css("margin-top",0).appendTo(docthis);
                })
            } 
        // 向左滑动
        }else if(value.dir == "left"){
            var w = $(docthis).width();
            var elem_w = $(value.elem,docthis).width();
            $(value.elem,docthis).css({"left":w+"px","position":"relative"});
            function autoani(){
                var left = parseFloat($(value.elem,docthis).css("left"))-1;
                if(left < (-elem_w)){
                    $(value.elem,docthis).css({"left":w});
                }else{
                     $(value.elem,docthis).css({"left":left});
                }
               
            } 
        }
        
        //自动间隔时间向上滑动
        var anifun = setInterval(autoani,value.time);

        //悬停时停止滑动，离开时继续执行
        $(docthis).find(value.elem).hover(function(){
            clearInterval(anifun);          //清除自动滑动动画
        },function(){
            anifun = setInterval(autoani,value.time);   //继续执行动画
        })
    },

    /**侧边导航收缩伸展效果 */
    sidebarNav:function(value){
        var docthis = this;
        //默认参数
        value=$.extend({
            btn    : ".js-subNav",     //btn 当前点击的按钮
            style  : "active"  ,       //style 变换的样式
            tMenu  : ".second-box" ,   //tMenu 二级菜单
            callback : function() {     //回调函数
                        
            }
        },value)
        $(value.btn,docthis).click(function(){
            $(this).toggleClass(value.style).siblings().removeClass(value.style);
            // 修改数字控制速度， slideUp(500)控制卷起速度
            $(this).next(value.tMenu).slideToggle(500).siblings(value.tMenu).slideUp(500);
            if(value.callback) {
                value.callback();
            }
        })
    },

    /**页面滚动到指定位置**/
    webScrolling:function(value){
        var docthis = this;
        //默认参数
        value=$.extend({
            btn  : ".js-scroll",             //btn 当前点击的按钮
            top  : 0,                        //top 距离顶部高度
            speed: 500,                      //speed 移动速度
            animateBefore : function() {     //动画开始之前回调函数      
                          
            },
            animateSuccess : function() {     //动画结束后回调函数       
                
            }
        },value)
        $(value.btn,docthis).click( function(){
            var scrolltodom = $(this).attr("date-scroll");
            $('html,body').animate(
                    {scrollTop:$(scrolltodom).offset().top-value.top},
                    value.speed,
            ).promise().then(value.animateSuccess);
            if(value.animateBefore){
                value.animateBefore();
            }
        });
    },

    /**复选框**/
    checkbox:function(value){
        var docthis = this;
        //默认参数
        value=$.extend({
            btn: ".js-checkbox",     //btn 当前点击的复选框
            parNode: ".box",                //parNode 当前点击的复选框的最外层父节点
            icon : ".icon",            //icon默认图标
            iconActive  : ".icon-checked",         //iconActive 选中后图标                
            callback : function(value) {     
                console.log(value);
            },
        },value)

        $(value.btn,docthis).on("click",function(e){
            e.preventDefault();
            //点击切换复选框状态
            var id = $(this).data("id");
            var icon =  $(this).find(value.icon);
            var input = $(this).find("input[type=checkbox]");
            var group = $(this).data("group");
            if(icon.hasClass(value.iconActive)){
                icon.removeClass(value.iconActive);
                input.prop("checked",false);
            }else{
                icon.addClass(value.iconActive);
                input.prop("checked",true);
            }
            $(this).toggleClass("active");

            //设置全选
            var box = $(this).parents(value.parNode);
            var len = box.find(value.icon).length;
            var chceckLen = box.find(value.btn+".active").length;
            if(id == "all"){ //点击全选复选框
                if($(this).find(value.icon).hasClass(value.iconActive)){
                    $(value.btn+"[data-group='"+group+"']").find(value.icon).addClass(value.iconActive);
                    $(value.btn+"[data-group='"+group+"']").find("input").prop("checked",true);
                    $(value.btn+"[data-group='"+group+"']").addClass("active");
                }else{
                    $(value.btn+"[data-group='"+group+"']").find(value.icon).removeClass(value.iconActive);
                    $(value.btn+"[data-group='"+group+"']").find("input").prop("checked",false);
                    $(value.btn+"[data-group='"+group+"']").removeClass("active");
                }
            }else{ //点击子复选框
                if(chceckLen == len){
                    $(value.btn+"[data-id='all'][data-group='"+group+"']").find(value.icon).addClass(value.iconActive);
                    $(value.btn+"[data-id='all'][data-group='"+group+"']").find("input").prop("checked",true);
                }else{
                    $(value.btn+"[data-id='all'][data-group='"+group+"']").find(value.icon).removeClass(value.iconActive);
                    $(value.btn+"[data-id='all'][data-group='"+group+"']").find("input").prop("checked",false);
                }
            }

            if(value.callback){
                var checked = [];
                $(value.btn+"[data-id!='all'][data-group='"+group+"'].active").each(function() {
                    checked.push($(this).data("id"));
                });
                value.callback(checked);
            }
        });
    },
    /**单选框**/
    radio:function(value){
        var docthis = this;
        //默认参数
        value=$.extend({
            btn: ".js-radio",                        //btn 当前点击的复选框
            parNode: ".box",                         //parNode 当前点击的复选框的最外层父节点
            icon : ".icon",                          //icon默认图标
            iconActive  : ".icon-radio-checked",     //iconActive 选中后图标                    
            type:'',                                 //type 类型是单个还是多个
            callback : function(value) {     
               console.log(value);               
            },
        },value)

        $(value.btn,docthis).on("click",function(e){
            e.preventDefault();
            //点击切换复选框状态
            var icon =  $(this).find(value.icon);
            var input = $(this).find("input[type=radio]");
            if(value.type == "single"){
                icon.toggleClass(value.iconActive);
                if(input.is(':checked')){
                    input.prop("checked",false)
                    $(this).data("id",0);
                }else{
                    input.prop("checked",true);
                    $(this).data("id",1);
                }
            }else{
                var box = $(this).parents(value.parNode);
                box.find(value.icon).removeClass(value.iconActive);
                box.find("input[type=radio]").prop("checked",false);
                icon.addClass(value.iconActive);
                input.prop("checked",true);
            }
            if(value.callback){
                var checked = $(this).data("id");
                value.callback(checked);
            }
        });

    },
});
// 计算json对象长度
function getJsonLength(jsonData) {
    var jsonLength = 0;
    for (var item in jsonData) {
        jsonLength++;
    }
    return jsonLength;
}

/*浏览器打开全屏*/
function fullScreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else if (el.oRequestFullscreen) {
        el.oRequestFullscreen();
    } else {
        console.log("浏览器不支持全屏调用！请更换浏览器或按F11键切换全屏！");
    }
}
/*浏览器退出全屏*/
function exitFullScreen() {
    var el = document;
    var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.exitFullScreen;
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    } else if (el.msExitFullscreen) {
        el.msExitFullscreen();
    } else if (el.oRequestFullscreen) {
        el.oCancelFullScreen();
    } else {
        console.log("浏览器不支持全屏调用！请更换浏览器或按F11键切换全屏！(3秒后自动关闭)");
    }
}