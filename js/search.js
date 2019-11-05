window.oncontextmenu = function () {
    return false;
}
var recorder;
var audio = document.querySelector('audio');
const shouye = new Vue({
    el: "#concent",
    data() {
        return {
            value: '',
            list: [],
            id: [],
            goodsImg: [],
            searchlist: [],
            searchbox: false,
            src: "./image/voice.png"
        }
    },
    created() {
        // 页面挂载请求物品一级类别
        var that = this
        var text = "请选择物品分类"
        that.speckText(text)
        $.ajax({
            type: 'post',
            url: baseurl + '/newGoods/newMenu',
            cache: true, //推荐使用缓存
            data: {
                parentid: 0
            },
            success: function (success) {
                // console.log(success.data)
                that.list = success.data
                for (var i = 0; i < success.data.length; i++) {
                    that.list.goodsImg = success.data[i].goodsImg
                    if (success.data[i].goodsImg) {
                        that.goodsImg = success.data[i].goodsImg
                    } else {
                        that.goodsImg = './image/err.png'
                    }
                }
            },
            error: function (err) {
                // console.log(err)
            }
        })
    },
    methods: {
        // 购物车页面跳转
        goShou() {
            window.location.href = './shouye.html'
        },
        // 退出登录
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
        // 点击进入二级菜单
        sendId: function (item) {
            // console.log(item)
            localStorage.setItem('a', JSON.stringify(item.id))
            localStorage.setItem('name', JSON.stringify(item.goodsName))
            window.location.href = './qujian.html'
        },
        play(mp3) {
            var mp3 = new Audio(mp3);
            mp3.play();
        },
        speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
            var n = new Audio(url);
            n.src = url;
            n.play();
        },
        // 搜索按钮
        search: function () {
            var that = this
            // 判断是否输入搜索内容
            if (that.value == '') {
                var text = "请输入物品名称";
                that.speckText(text)
            } else {
                // 搜索请求
                $.ajax({
                    url: baseurl + '/newGoods/goodsList',
                    type: 'post',
                    data: {
                        goodsName: that.value
                    },
                    success: function (res) {
                        // console.log(res, "--------")
                        if (res.data.length > 0) {
                            localStorage.setItem('b', JSON.stringify(res.data))
                            localStorage.setItem('bname',res.data[0].goodsName)
                            window.location.href = './qulist.html'
                        } else {
                            var text = "搜索的物品不存在，请重新输入"
                            that.speckText(text)
                        }
                    },
                    error: function (err) {
                        // console.log(err)
                    }
                })
            }

        },
        // 物品缩写搜索
        searchnew(item) {
            $.ajax({
                url: baseurl + '/newGoods/goodsList',
                type: 'post',
                data: {
                    goodsName: item
                },
                success: function (res) {
                    if (res.data.length > 0) {
                        localStorage.setItem('b', JSON.stringify(res.data))
                        localStorage.setItem('bname',res.data[0].goodsName)
                        window.location.href = './qulist.html'
                    }
                },
                error: function (err) {
                    // console.log(err)
                }
            })
        },
        // 语音搜索
        startRecording() {
            HZRecorder.get(function (rec) {
                recorder = rec;
                recorder.start();
            }, {
                sampleBits: 16,
                sampleRate: 16000
            });

            this.src = "./image/d-1.gif"
        },
        stopRecording() {
            this.src = "./image/voice.png"
            var that = this
            recorder.stop();
            var blob = recorder.getBlob();
            // console.log(blob);
            var url = URL.createObjectURL(blob);
            var div = document.createElement('div');
            var au = document.createElement('audio');
            var hf = document.createElement('a');
            au.controls = true;
            au.src = url;
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = hf.download;
            let formdata = new FormData();
            formdata.append("file", blob);
            // console.log(blob)
            // 语音搜索请求
            $.ajax({
                url: baseurl + '/newGoods/findGoodsByVoice',
                type: 'post',
                processData: false,
                contentType: false,
                timeout: 10000,
                async: true,
                data: formdata,
                success: function (res) {
                    // console.log(res)
                    if (res.status == '1') {
                        localStorage.setItem('b', JSON.stringify(res.data))
                        window.location.href = './qulist.html'
                        // that.value = res.msg
                    } else {
                        var text = res.msg
                        that.speckText(text)
                    }
                }
            })
        },
        playRecording() {
            if (!recorder) {
                // console.log('未录音')
            } else {
                recorder.play(audio);
            }

        }
    },
    watch: {
        // 监听输入框信息
        value() {
            var that = this
            if (that.value == '') {
                that.searchbox = false
            } else {
                that.searchlist = []
                $.ajax({
                    url: baseurl + '/newGoods/goodsList',
                    type: 'post',
                    data: {
                        goodsName: that.value
                    },
                    success: function (res) {

                        if (res.data.length > 0) {
                            for (var i = 0; i < res.data.length; i++) {
                                that.searchlist.push(res.data[i].goodsName)
                                that.searchbox = true
                            }
                        } else {
                            that.searchbox = false
                        }
                    },
                    error: function (err) {
                        // console.log(err)
                    }
                })
            }
        }
    }
})
// 后退按钮
$('#back').on('click', () => {
    window.location.href = "./shouye.html"
})
// 取件车按钮
$('#shop').click(function () {
    window.location.href = "./shop.html"
})