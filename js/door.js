window.oncontextmenu = function () {
    return false;
}
const qujian = new Vue({
    el: '#content',
    data() {
        return {
            list: [],
            text: '',
        }
    },
    created() {
        // 页面挂载请求数据
        var that = this
        $.ajax({
            url: baseurl + '/sark/sarkGroup',
            type: 'post',
            data: {},
            success: function (res) {
                $.each(res.data, function (i, val) {
                    console.log('val', val)
                    switch (val.sAmount) {
                        case 16:
                            val.src = './image/gui-1.png'
                            break;
                        case 12:
                            val.src = './image/gui-2.png'
                            break;
                        case 4:
                            val.src = './image/gui-3.png'
                            break;
                        case 1:
                            val.src = './image/gui-4.png'
                            break;
                    }
                    that.list.push(val)
                })
            }
        })
        that.text = '柜门列表'
        that.speckText(this.text)
    },
    methods: {
        speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
            var n = new Audio(url);
            n.src = url;
            n.play();
        },
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
        door(item) {
            console.log('3333',item)
            localStorage.setItem('num', item.sNum)
            window.location.href = "./doormenu.html"
        }
    },
})
$('#back').on('click', () => {
    window.location.href = "./shouye.html"
})
// 点击跳转页面
function door(item) {
    console.log(($(item).find("span")[0].childNodes[0].nodeValue).toString().substring(0,1))
    localStorage.setItem('num', ($(item).find("span")[0].childNodes[0].nodeValue).toString().substring(0,1))
    window.location.href = "./doormenu.html"
}