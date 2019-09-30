window.oncontextmenu = function () {
    return false;
}
const denglu = new Vue({
    el: "#box",
    data() {
        return {
            list: [],
            focusShow: ''
        }
    },
    methods: {
        showKeyboard: function () {
            this.focusShow = true
        },

    },
})
function play(mp3) {
    var mp3 = new Audio(mp3);
    mp3.play();
}
let n = {
    ended: true
}
function speckText(str) {
    if (!n.ended) {
        n.muted = 0;
        n.pause();
    }
    n = null;
    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
    n = new Audio(url);
    n.src = url;
    n.play();
}
var aCenter = document.getElementById('center')
var oOver = document.getElementById('over')
var oBtn = document.getElementById('btn')
var oLogin = document.getElementById('login')
var oPhoto = document.getElementById('photo')
var cApture = document.getElementById('capture')
var oRegister = document.getElementById('register')
var oVideo = document.getElementById('video')
var oCanvas = document.getElementById('canvas')
var oRemake = document.getElementById('remake')
var oSend = document.getElementById('send')
var oZhuce = document.getElementById('zhuce')
var oCasual = document.getElementById('casual')
var oReg = document.getElementById('reg')
let sendimg, blobimg;
var timers = null;
var a = 0;
var allowSpeckRun = true;

$("#regs").on("click", function () {
    if (a == 0) {
        layer.msg('请拍照!!')
        var text = "请拍照！";
        speckText(text)
    } else {
        var indexs = layer.load(1, {
            shade: [0.5, '#000'],
            success: function (layero) {
                layero.find('.layui-layer-content').after(
                    "<p style='position:absolute;left:-70px;color:#e5e5e5;white-space:nowrap;font-size:22px'>正在注册请稍等!</p>"
                )
            }
        });
        var formdata = new FormData();
        formdata.append("uname", $('#use').val());
        formdata.append("realname", $('#realname').val())
        formdata.append("password", $('#word').val())
        formdata.append("file", blobimg)
        if ($('#use').val() == '' && $('#word').val() != '' && $('#realname').val() != '') {
            layer.close(indexs);
            var text = "请输入用户名";
            speckText(text)
        } else if ($('#realname').val() == '' && $('#word').val() !== '' && $('#use').val() !== '') {
            layer.close(indexs);
            var text = "请输入真实姓名";
            speckText(text)
        } else if ($('#word').val() == '' && $('#realname').val() !== '' && $('#use').val() !== '') {
            layer.close(indexs);
            var text = "请输入密码";
            speckText(text)
        } else if ($('#word').val() == '' && $('#realname').val() == '' && $('#use').val() == '') {
            layer.close(indexs);
            var text = "请填写基本信息";
            speckText(text)
        } else {
            //上传到后台。
            var uploadAjax = $.ajax({
                type: "post",
                //后端需要调用的地址
                url: baseurl + "/user/userRegister.do",
                data: formdata,
                processData: false, //tell jQuery not to process the data
                contentType: false, //tell jQuery not to set contentType   
                //设置超时
                timeout: 10000,
                async: true,
                success: function (suc) {
                    //成功后回调
                    console.log(suc);
                    $(".showimg img").remove()
                    $('#use').val('')
                    $('#realname').val('')
                    $('#word').val('')
                    URL.revokeObjectURL(sendimg);
                    blobimg = null;
                    sendimg = null;
                    if (suc.status == 1) {
                        layer.close(indexs);
                        layer.msg(suc.data + '请联系管理员激活!')
                        var text = suc.data + '请联系管理员激活!';
                        speckText(text)
                    } else {
                        layer.close(indexs);
                        layer.msg(suc.data)
                    }
                },
                error: function (data) {
                    if (data.status == '-1') {
                        layer.msg('请填写注册信息')
                        layer.close(indexs)
                    }
                    layer.msg('注册失败!请重新注册')
                    layer.close(indexs)
                    $(".showimg img").remove()
                    $('#use').val('')
                    $('#realname').val('')
                    $('#word').val('')
                    URL.revokeObjectURL(sendimg, blobimg);
                    sendimg = null;
                },
            });
        }
    }

})
function takePic() {
    var text = "请将脸部对准摄像头并保持静止，点击拍照按钮，然后点击确定按钮"
    speckText(text)
    oRegister.style.display = 'none';
    oPhoto.style.display = 'block';
    if (!window.cavpop) {
        videotocanvas();
    }
}
$('#paizhao').click(function () {
    getUserMedia1(takePic)
})
$("#btn").on("click", function () {
    oOver.style.display = 'block';
    aCenter.style.display = 'none';
    oPhoto.style.display = 'none';
    oRegister.style.display = 'none';

})
$('#reg').on('click', function () {
    aCenter.style.display = 'none';
    oRegister.style.display = 'block';
    oOver.style.display = 'none';
    aCenter.style.display = 'none';
    oPhoto.style.display = 'none';

})
$("#login").on("click", function () {
    var indexs = layer.load(1, {
        shade: [0.5, '#000'],
        success: function (layero) {
            layero.find('.layui-layer-content').after(
                "<p style='position:absolute;left:-70px;color:#e5e5e5;white-space:nowrap;font-size:22px'>正在登录请稍等!</p>"
            )
        }
    });
    
    if($('#user').val() == '' && $('#password').val() == '') {
        layer.close(indexs)
        var text = '请输入用户名';
        speckText(text)
    }else if ($('#user').val() == '' && $('#password').val() !== '') {
        layer.close(indexs)
        var text = '请输入用户名';
        speckText(text)
    } else if ($('#user').val() !== '' && $('#password').val() == '') {
        layer.close(indexs)
        var text = '请输入密码';
        speckText(text)
    } else if ($('#user').val() !== '' && $('#password').val() !== '') {
        $.ajax({
            type: "post",
            url: baseurl + "/user/userLogin.do",
            data: {
                uname: $('#user').val(),
                password: $('#password').val()
            },
            timeout: 10000,
            async: true,
            success: function (suc) {
                $('#password').focus()
                if (suc.status == '1') {
                    layer.close(indexs)
                    var text = suc.data;
                    speckText(text)
                    window.location.href = './shouye.html'
                    layer.msg(suc.data);
                } else if (suc.status == '-1') {
                    //用户禁用还是失败
                    layer.close(indexs)
                    layer.msg(suc.data);
                    var text = suc.data;
                    speckText(text)
                } else if (suc.data == undefined) {
                    layer.close(indexs)
                    layer.msg('登录受限，请在物联柜终端操作！');
                    var text = '登录受限，请在物联柜终端操作！';
                    speckText(text)
                } else {
                    layer.close(indexs)
                    layer.msg(suc.data);
                    var text = suc.data;
                    speckText(text)
                }
            },
            error: function (data) {
                layer.close(indexs)
                layer.msg('登录失败!')
            },
        });
    }


})
$("#password").keydown(function (event) {
    if (event.keyCode == 13) {
        $.ajax({
            type: "post",
            url: baseurl + "/user/userLogin.do",
            data: {
                uname: $('#user').val(),
                password: $('#password').val()
            },
            timeout: 10000,
            async: true,
            success: function (suc) {
                $('#password').focus()
                if (suc.status == '1') {
                    window.location.href = './shouye.html'
                    layer.msg(suc.data);
                } else {
                    layer.msg(suc.data);
                }
            },
        });
    }
})
function facetestlogin() {
    oRegister.style.display = 'none';
    oRemake.style.display = 'none';
    oSend.style.display = 'none';
    // oVideo.style.display='block';
    // oCanvas.style.display='none';
    oZhuce.style.display = 'none';
    var text = '请将脸部对准摄像头，并保持静止';
    speckText(text)
    facelogin()
}
$('#face').on("click", function () {

    getUserMedia1(facetestlogin)
})

$('#paizhao').click(function () {
    oRegister.style.display = 'none';
    oPhoto.style.display = 'block';
    cApture.style.display = 'block';
    oRemake.style.display = 'block';
    oSend.style.display = 'block';
    oZhuce.style.display = 'none'
})
function casualLogin() {
    oPhoto.style.display = 'block';
    oOver.style.display = 'none';
    aCenter.style.display = 'none';
    cApture.style.display = 'block';
    oRegister.style.display = 'none';
    oRemake.style.display = 'block';
    oSend.style.display = 'none';
    oZhuce.style.display = 'block';
    var text = '请将脸部对准摄像头，并保持静止，点击拍照按钮，然后点击注册按钮！';
    speckText(text)
    var allowDemoRun = true;
    if (!window.cavpop) {
        videotocanvas();
    }
}
$('#casual').on("click", function () {
    getUserMedia1(casualLogin)
})
$('#capture').on("click", function () {
    clearcanvas();
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
})
$('#remake').on('click', function () {
    if (!window.cavpop) {
        videotocanvas();
    }
})
$('#send').on('click', function () {
    oRegister.style.display = 'block';
    oPhoto.style.display = 'none';
    var imgData = convertCanvasToImage(canvas);
    blobimg = dataURLtoBlob(imgData.src)
    if (blobimg) {
        a++;
        var text = '信息全部填写完毕后，再点击注册按钮';
        speckText(text)
    }
    sendimg = URL.createObjectURL(dataURLtoBlob(imgData.src));
    if (sendimg) {
        $(".showimg").append(
            `<img src='${sendimg}' style="width:100px;height:100px;display:block;position: absolute;top:380px;left:150px">`
        )
    }
})
$('#zhuce').on('click', function () {
    $('#zhuce').attr('disabled', 'true')
    var imgData = convertCanvasToImage(canvas);
    const blob = dataURLtoBlob(imgData.src);
    var formdata = new FormData();
    formdata.append("file", blob)
    //上传到后台。
    var uploadAjax = $.ajax({
        type: "post",
        //后端需要调用的地址
        url: baseurl + "/user/guestAdd.do",
        data: formdata,
        processData: false, //tell jQuery not to process the data
        contentType: false, //tell jQuery not to set contentType   
        //设置超时
        timeout: 10000,
        async: true,
        success: function (suc) {
            console.log('111', suc)
            // 成功后回调
            if (suc.status == 1) {
                // clearInterval(this.settime)
                layer.msg(suc.data + '请联系管理员激活!', { time: 3000 });
                var text = suc.data + '请联系管理员激活！';
                speckText(text)
                setTimeout(function () {
                    window.location.reload()
                }, 3000)
            } else {
                // clearInterval((this.settime), 10000)
                layer.msg(suc.data);
                $('#zhuce').removeAttr('disabled')
            }
        },
    });
})

function centerFace() {
    cApture.style.display = 'none';
    oRemake.style.display = 'none';
    oSend.style.display = 'none';
    oZhuce.style.display = 'none';
    var text = '请将脸部对准摄像头，并保持静止';
    speckText(text)
    facelogin()
}
$("#center").on("click", function () {
    getUserMedia1(centerFace)
})
function facelogin() {
    oPhoto.style.display = 'block';
    oOver.style.display = 'none';
    aCenter.style.display = 'none';
    cApture.style.display = 'none';
    if (!window.cavpop) {
        videotocanvas();
    }
    logincount = 0;
    psotcount(time, 2)
}
let logincount = 0;

function psotcount(fn, count) {
    let start = 0;
    return time(start, count);
}

function time(logincount, end) {
    //等待图像加载两秒再抓取
    setTimeout(function () {
        let imgData = convertCanvasToImage(canvas);
        const blob = dataURLtoBlob(imgData.src);
        let formdata = new FormData();
        formdata.append("file", blob);
        //上传到后台。
        // console.log(blob,'22222')
        $.ajax({
            type: "post",
            //后端需要调用的地址
            url: baseurl + "/user/faceLogin.do",
            data: formdata,
            processData: false, //tell jQuery not to process the data
            contentType: false, //tell jQuery not to set contentType   
            //设置超时
            timeout: 10000,
            async: true,
            success: function (suc) {
                //成功后回调
                console.log(suc)
                if (oPhoto.style.display == 'none') {
                    return false;
                }
                if (suc.status == '1') {
                    layer.msg(suc.data);
                    window.location.href = './shouye.html'
                } else {
                    if (logincount == end) {
                        var text = suc.data;
                        speckText(text)
                        layer.msg("人脸识别超时.请使用密码登录");
                        $("#btn").click();
                        clearcanvas();
                        return false;
                    }
                    layer.msg(suc.data);
                    return time(logincount + 1, end);
                }
            },
        });
    }, 3000)


}

function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
}
//访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error)
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}

let video = document.getElementById('video');
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

function getUserMedia1(fn) {
    function success(stream) {
        fn()
        //兼容webkit核心浏览器
        let CompatibleURL = window.URL || window.webkitURL;
        //将视频流设置为video元素的源
        video.srcObject = stream;
        video.play();
    }

    function error(error) {
        speckText("无法获取视频,请检查摄像头连接")
        console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    }

    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator
        .mozGetUserMedia) {
        //调用用户媒体设备, 访问摄像头
        getUserMedia({
            video: {
                width: 596,
                height: 579,
            }
        }, success, error);
    } else {
        alert('不支持访问用户媒体');
    }
}
function getInfo(event) {

    let reader = new FileReader();
    //这里把一个文件用base64编码
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
        let newImg = new Image();
        //获取编码后的值,也可以用this.result获取
        newImg.src = e.target.result;
        newImg.onload = function () {
            /* 获取  this.height tthis.width*/
            var dataURL = compress(newImg, this.width, this.height, 1);
            /*为了兼容ios 需要 dataURL-> blob -> file */
            var blob = dataURLtoBlob(dataURL); // dataURL-> blob 
            var file = blobToFile(blob, '999'); // blob -> file
            $("body").append("<img src='" + dataURL + "' />");
        }
    }

}

function compress(img, width, height, ratio) {
    if (width > 750) {
        var ratio = width / height;
        width = 750;
        height = 750 / ratio;
    }
    var canvas, ctx, img64;
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    img64 = canvas.toDataURL("image/jpeg", ratio);
    return img64;
}
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}
function blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
let drawBackgroupimg = 0;
var scranImg = document.getElementById("scranImg1");
function videotocanvas() {
    if (!window.cavpop) {
        window.cavpop = window.setInterval(function () {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            context.drawImage(scranImg, 0, drawBackgroupimg, canvas.width, 200);
            drawBackgroupimg = drawBackgroupimg > canvas.height ? -200 : (drawBackgroupimg + 4);
        }, 40)
    }
}
function clearcanvas() {
    window.clearInterval(window.cavpop)
    window.cavpop = null;
    drawBackgroup = 0;
}
videotocanvas();