// 禁止用户复制
window.oncontextmenu = function () {
    return false;
}
const shouye = new Vue({
    el: "#concent",
    data() {
        return {
            admin: [],
            showbox: false,
            showChang: false,
            realname: "",
            realdata: "",
            imgsrc: "",
            showreturn: false,
            text: ''
        }
    },
    created() {
        // 页面挂载请求当前用户的信息
        this.text = '欢迎使用物联柜操作系统！'
        this.speckText1(this.text)
        this.text = ''
        const that = this;
        $.ajax({
            type: 'post',
            url: baseurl + '/user/getLoginUser',
            cache: true, //推荐使用缓存
            success: function (suc) {
                // // console.log('6666666', suc.data)
                that.imgsrc = suc.data.faceimg
                if (suc.data.status === 1) {
                    suc.data.status = "未激活";
                } else if (suc.data.status === 2) {
                    suc.data.status = "激活";
                } else if (suc.data.status === 3) {
                    suc.data.status = "禁用";
                }
                if (suc.data.type === 1) {
                    that.admin.type = 1
                    suc.data.type = '普通用户'
                } else if (suc.data.type === 2) {
                    that.admin.type = 2
                    suc.data.type = '临时用户'
                }
                // console.log('000', that.admin.type)
                sessionStorage.setItem('persondata', JSON.stringify(suc.data));
                // layui.form.val('example1',JSON.parse(sessionStorage.getItem('persondata')))
                shouye.realname = suc.data.realname;
                sessionStorage.setItem('userId', suc.data.id)
                if (suc.code === -1) {
                    window.location.href = "./denglu.html"
                }
            }
        })
    },
    methods: {
        // 消耗品补充按钮
        supplement(){
            window.location.href='./supplement.html'
        },
        // 百度语音播报
        speckText1(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
            var n = new Audio(url);
            n.src = url;
            n.play();
        },
        yuyin() {
            let blob = "./yuyin/密码.wav"
            let formdata = new FormData();
            formdata.append("file", blob);
            // console.log(blob)
            $.ajax({
                url: baseurl + '/newGoods/findGoodsByVoice',
                type: 'post',
                processData: false, //tell jQuery not to process the data
                contentType: false, //tell jQuery not to set contentType   
                //设置超时
                timeout: 10000,
                async: true,
                data: formdata,
                success: function (res) {
                    // console.log(res)
                }
            })
        },
        // 物品列表按钮
        goodsList() {
            window.location.href = './menulist.html'
        },
        // 柜门列表按钮
        doorlist() {
            window.location.href = './door.html'
        },
        // 刷新按钮
        refresh() {
            window.location.reload()
        },
        // 控住菜单是否显示
        handleCloseModal() {
            this.showbox = false;
            this.showreturn = false
        },
        handleCloseModal1() {
            this.showChang = false;
            this.showreturn = false
        },
        // 未还信息按钮
        returnInformation() {
            this.text = '未还信息'
            this.speckText1(this.text)
            layer.open({
                type: 1,
                title: false,
                // closeBtn: 0,
                shadeClose: true,
                skin: 'layui-layer-rim',
                area: ['814px', '500px'],//宽高
                content: $('#returnmsg')
            });
        },
        // 关闭按钮
        closereturn() {
            this.showreturn = false
        },
        // 退出登录按钮
        handleSave() {
            $.ajax({
                type: "post",
                url: baseurl + "/user/logout.do",
                data: {
                    name: ''
                },
                success: function (suc) {
                    if (suc.status == '1') {
                        window.location.href = './denglu.html'
                    } else {
                        layer.msg(suc.data);
                    }
                },
                error: function (data) {
                    // console.log(data)
                },
            });
        },
        // 判断性别
        sexval() {
            var genderval = myform.gender.value
            sessionStorage.setItem('genderval', genderval)
        },
        // 确认修改按钮
        headClose() {
            var realname = document.getElementById('realname').value;
            // 判断用户是否填写信息
            if (!realname) {
                layer.tips('请输入真实姓名!', '#realname', {
                    tips: [2, '#c00']
                });
                return false;
            }
            var phone = document.getElementById('phone').value;
            if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
                layer.tips('请输入正确的手机号!', '#phone', {
                    tips: [2, '#c00']
                });
                return false;
            }
            var uname = document.getElementById('uname').value
            var realname = document.getElementById('realname').value
            var phone = document.getElementById('phone').value
            var that = this
            var userId = sessionStorage.getItem('userId')
            var genderval = sessionStorage.getItem('genderval')
            $.ajax({
                type: 'post',
                url: baseurl + '/user/updateUser.do',
                data: {
                    id: userId,
                    gender: genderval,
                    uname: uname,
                    realname: realname,
                    phone: phone,
                },
                success: function (suc) {
                    // console.log('22', suc)
                    if (suc.success == true) {
                        that.showbox = false;
                        layer.msg(suc.data)
                        // setTimeout(function () { window.location.reload() }, 2000)
                    }

                }
            })

        },
        // 个人信息按钮
        headOpen() {
            this.text = '个人信息'
            this.speckText1(this.text)
            // this.speckText1(this.text)
            this.showbox = true
            this.showChang = false
        },
        // 修改密码按钮
        changWord() {
            var text = '修改密码'
            this.speckText1(text)
            this.showChang = true
            this.showbox = false
        },
        // 确定修改密码按钮
        closeChange() {
            var oldPassword = document.getElementById('oldPassword').value;
            if (!oldPassword) {
                layer.tips('密码不能为空!', '#oldPassword', {
                    tips: [2, '#c00']
                });
                return false;
            }
            var newPassword = document.getElementById('newPassword').value;
            if (!newPassword) {
                layer.tips('密码不能为空!', '#newPassword', {
                    tips: [2, '#c00']
                });
                return false;
            }
        },

    },
})
const oZhezhao = document.getElementById('zhezhao')
// 取件按钮
$('#take').on('click', () => {
    window.location.href = "./search.html";
})
// 还件按钮
$('#also').mouseenter(function () {
    $(this).find($('.itemmeu')).show(400)
}).mouseleave(function () {
    $(this).find($('.itemmeu')).hide(400)

})
function play(mp3) {
    var mp3 = new Audio(mp3);
    mp3.play(); //播放 mp3这个音频对象
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
// 二维码还件
var indexs ;  
$('#code').click(function () {
     indexs = layui.layer.load(1, {
        shade: [0.5, '#000'],
        success: function (layero) {
            layero.find('.layui-layer-content').after(
                "<div style='position:absolute;left:-100px;color:#e5e5e5;white-space:nowrap;font-size:22px'>请将物品二维码对准扫码框!<br>还完物品,记得关闭柜门哦!</div>"
            )
        }
    })
    var text = '请将物品二维码对准扫码框';
    speckText(text)
    $.ajax({
        type: 'post',
        url: baseurl + '/newGoods/codeBackGoods',
        success: function (res) {
            // console.log(res)
            if (res.status == 1) {
                setTimeout(function () { guansuo(res.data.sids, indexs) }, 3000)
            } else if(res.status==-1) {
                layer.close(indexs);
                var text =res.data
                speckText(text)
                layer.msg(res.data, {
                    icon: 6,
                    anim: 6,
                    time: 3000,
                });
            }
        },
        error: function (err) {
            // console.log(err)
            layer.close(indexs);
            layer.msg(err.data, {
                icon: 6,
                anim: 5,
                time: 3000,
            });
        }
    })
})
// 二维码换件请求函数
function guansuo(ids, indexs, index) {
    // console.log('guan item', ids)
    var that = this
    $.ajax({
        type: 'post',
        url: baseurl + '/cart/check',
        data: {
            sids: ids
        },
        success: function (res) {
            // console.log('guan', res)
            var suostatus
            if (res.status == 1) {
                layer.close(indexs)
                //二维码还件播报
                that.text = res.data
                that.speckText(that.text)
                layer.msg('还件成功!', {
                    icon: 6,
                    anim: 5,
                    time: 3000,
                })
                clearTimeout(suostatus)
            } else {
                if (index == 100) {
                    clearTimeout(suostatus)
                    layer.close(indexs)
                }
                index = index || 1;
                index++
                suostatus = setTimeout(function () {
                    guansuo(ids, indexs, index)
                    var text = "请关柜门"
                    that.speckText(text)
                }, 3000)
            }
        }

    })
}
// 还件按钮
$('#picture').click(function () {
    window.location.href = './huanlist.html'
})