//基本信息
var company='huohuasiwei';//品牌
var userId =  randomRange(8)+(new Date()).getTime().toString().slice(11);//userId
var url=window.location.href; //url
var ip=returnCitySN["cip"];//ip
var userAgent=navigator.userAgent;//代理信息

$(function () {
    $('#phone').bind('input propertychange',function () {
        var Phone=$("#phone").val().trim().length;
        if (Phone === 11 ){
            $(".getCode").css({
                background:'#fff5f6',
                color:'#ffabb1'
            })
        }else{
            $(".getCode").css({
                background:'#fafafa',
                color:'#dcdcdc'
            })
        }
    })
    //保存页面初始化信息
    $.ajax({
        type:'POST',
        url: 'http://mm.jnrise.cn/loading/server/enter',
        headers:{"Content-Type":"application/x-www-form-urlencoded"},
        data:{
            'company':company,
            'userId':userId,
            'userAgent':userAgent,
            'ip':ip,
            'url':url,
            'sign':"",
            'flag':2
        },
        dataType: 'json',
        success: function(data){
            // console.log(data);
         },
        error: function(error){
            console.log(error);
        }
    });
    //每秒刷新页面停留时间
    function getTime() {
        var second=0
        var timer=window.setInterval(function () {
            second++
            if (second <= 90){
                $.ajax({
                    type:'POST',
                    url:'http://mm.jnrise.cn/loading/server/stay',
                    headers:{"Content-Type":"application/x-www-form-urlencoded"},
                    data:{
                        'company':company,//品牌名称
                        'userId':userId,//用户ID
                        'url':url,//url
                        'ip':ip,//ip地址
                        'userAgent':userAgent,//代理信息
                        'sign':"", //url携带的参数信息
                        'totalTime':second,//停留时间秒
                        'otherInfo':''
                    },
                    dataType:'json',
                    success:function (data) {
                        // console.log(data)
                    },
                    error:function (error) {
                        console.log(error)
                    }
                })
            }else{
                window.clearInterval(timer)
            }

        },1000)
    }
    getTime();
 })
function getInfo01(element) {
    //在按钮提交之后和AJAX提交之前将按钮设置为禁用
    var age=parseInt($("#age").val())
    var identity=$("#identity").val()
    var phone=$("#phone").val().trim()
    var code=$("#code").val().trim()
    var myreg= /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
    let RecurrenceId = getRequestByName("ID");
    if(RecurrenceId==""){
        RecurrenceId='test-00000000';
    }
    if (!age){
        $('.modal-h3').html("请输入孩子年龄")
        getDialog();
    }else if(!identity){
        $('.modal-h3').html("请输入家长身份")
        getDialog();
    }else if (!phone){
        $('.modal-h3').html("请输入手机号")
        getDialog();
    }else if (!myreg.test(phone)){
        $('.modal-h3').html("手机号格式不正确")
        getDialog();
    }else{
        if(!code){
            $('.modal-h3').html("请输入验证码")
            getDialog();
        }else{
            $.ajax({
                type:'GET',
                url: 'http://47.92.205.63:21667/sms/getCode?mobile='+phone+'&code='+code,
                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                dataType: 'json',
                success: function(data){
                    //在按钮提交之后和AJAX提交之前将按钮设置禁用
                    $("#btn01").attr('disabled',true)
                    $.ajax({
                            type:'POST',
                            url: 'http://47.92.205.63:21667/info/setInfo',
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            data:{
                                'mobile':phone,
                                'identity':identity,
                                'kidage':age,
                                'RecurrenceId':RecurrenceId
                            },
                            dataType: 'json',
                            success: function(result){
                                if (result.resp === "201"){
                                    $('.modal-h3').html("您已领取过")
                                    getDialog();
                                } else{
                                    $('.modal-h3').html("抢课成功")
                                    getDialog();
                                }
                                window.location.reload();
                                $("#age").val("");
                                $("#identity").val("");
                                $("#phone").val("");
                                $("#btn01").attr('disabled',false)
                            },
                            error: function(error){
                                $('.modal-h3').html("抢课失败")
                                getDialog();
                                window.location.reload();
                                $("#age").val("");
                                $("#identity").val("");
                                $("#phone").val("");
                                $("#btn01").attr('disabled',false)
                            }
                        });
                },
                error: function(error){
                    $('.modal-h3').html("验证码错误")
                    getDialog();
                }
            })
        }
    }
}
function getCode(obj) {
    var phone=$("#phone").val().trim()
    var myreg= /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
    if (!phone){
        $('.modal-h3').html("请输入手机号")
        getDialog();
    }else if(!myreg.test(phone)){
        $('.modal-h3').html("手机号格式不正确")
        getDialog();
    }else{
        $('.code').css('display','block')
        $.ajax({
            type:'GET',
            url: 'http://47.92.205.63:21667/sms/sendCode?mobile='+phone,
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            dataType: 'json',
            success: function(data){
                    $('.modal-h3').html("验证码已发送")
                    countDown(obj);
                    getDialog();
            },
            error: function(error){
                $('.modal-h3').html("验证码发送失败")
                getDialog();
            }
        })
    }
}
//随机生成10位用户id
function randomRange(min, max){
    var returnStr = "",
        range = (max ? Math.round(Math.random() * (max-min)) + min : min),
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for(var i=0; i<range; i++){
        var index = Math.round(Math.random() * (arr.length-1));
        returnStr += arr[index];
    }
    return returnStr;
}
//获取Url参数
function getRequestByName(name) {
    var url = window.location.search; //获取url中"?"符后的字串
    var result="";
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            if(strs[i].indexOf(name+"=")!=-1){
                result= unescape(strs[i].substring(name.length+1,strs[i].length));
            }
        }
    }
    return result;
}
//弹窗1.5秒后消失
function getDialog() {
    $('.modal').css('display','block')
    setTimeout(function () {
        $('.modal').css('display','none')
    },1500)
}
//验证码倒计时
function countDown(obj) {
    var countdown=60;
    var timers=setInterval(function() {
        countdown--;
        obj.setAttribute("disabled", true);
        obj.value=countdown + "s";
        $(".getCode").css({
            background:'#fafafa',
            color:'#dcdcdc',
            width:'43px'
        })
        if(countdown===0){
            obj.removeAttribute("disabled");
            obj.value="获取验证码";
            clearInterval(timers);
            $(".getCode").css({
                background:'#fff5f6',
                color:'#ffabb1',
                width: '83px'
            })
        }
    },1000)
}






