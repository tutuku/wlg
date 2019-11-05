window.oncontextmenu = function () {
    return false;
}
var recorder;
var audio = document.querySelector('audio');
const shouye = new Vue({
    el: "#concent",
    data() {
        return {
            list: [],
            value: '',
            id: [],
            goodsImg: '',
            searchlist: [],
            searchbox: false,
            src: "./image/voice.png"
        }
    },
    created() {
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
        goShou() {
            window.location.href = './shouye.html'
        },
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
        sendId: function (item) {
            // console.log(item)
            localStorage.setItem('b', item.id)
            localStorage.setItem('gname',item.goodsName)
            window.location.href = './huanjian.html'
        },
        play(mp3) {
            var mp3 = new Audio(mp3);
            mp3.play();
        },
        speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
            var n = new Audio(url);
            n.src = url;
            n.play();
        },
        search: function () {
            var that = this
            if (that.value == '') {
                var text = "请输入物品名称"
                that.speckText(text)
            } else {
                $.ajax({
                    url: baseurl + '/newGoods/goodsList',
                    type: 'post',
                    data: {
                        goodsName: that.value
                    },
                    success: function (success) {
                        // // console.log(success, "--------")
                        if (success.data.length > 0) {
                            localStorage.setItem('id', JSON.stringify(success.data[0].parentid))
                            localStorage.setItem('igname',success.data[0].goodsName)
                            window.location.href = './huanlist.html'
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
        searchnew(item) {
            // console.log(item)
            $.ajax({
                url: baseurl + '/newGoods/goodsList',
                type: 'post',
                data: {
                    goodsName: item
                },
                success: function (res) {
                    // console.log(res.data, "sernew")
                    if (res.data.length > 0) {
                        localStorage.setItem('id', JSON.stringify(res.data[0].parentid))
                        localStorage.setItem('igname',res.data[0].goodsName)
                        // console.log(res.data[0].parentid)
                        window.location.href = './huanlist.html'
                    }
                },
                error: function (err) {
                    // console.log(err)
                }
            })
        },
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
            $.ajax({
                url: baseurl + '/newGoods/findGoodsByVoice',
                type: 'post',
                processData: false,
                contentType: false,
                timeout: 10000,
                async: true,
                data: formdata,
                success: function (res) {
                    // console.log(res.obj[0].parentid)
                    if (res.code === 1) {
                        localStorage.setItem('id', JSON.stringify(res.obj[0].parentid))
                        window.location.href = './huanlist.html'
                    } else {
                        var text = res.msg+"请重新语音搜索"
                        that.speckText(text)
                    }
                }
            })
        },
        playRecording() {
            if (!recorder) {
                layer.msg('未录音')
            } else {
                recorder.play(audio);
            }

        }
    },
    watch: {
        value() {
            var that = this
            if (that.value == '') {
                // // console.log(that.value)
                that.searchbox = false
            } else {
                // // console.log(that.value)
                that.searchlist = []
                $.ajax({
                    url: baseurl + '/newGoods/goodsList',
                    type: 'post',
                    data: {
                        goodsName: that.value
                    },
                    success: function (res) {
                        // // console.log(res, "564")
                        if (res.data.length > 0) {
                            for (var i = 0; i < res.data.length; i++) {
                                that.searchlist.push(res.data[i].goodsName)
                                // // console.log(res.data[i].goodsName)
                                that.searchbox = true
                            }
                            // // console.log(that.searchlist)
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
$('#ul li').on('click', function () {
    window.location.href = "./huanjian.html"
})
$('#back').on('click', () => {
    window.location.href = "./shouye.html"
})
$('#shop').click(function () {
    window.location.href = "./shop.html"
})