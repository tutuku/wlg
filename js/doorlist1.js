window.oncontextmenu = function () {
    return false;
}
const qujian = new Vue({
    el: '#content',
    data() {
        return {
            text:''
        }
    },
    created(){
        // 页面挂载
        var dd=localStorage.getItem('did')
        this.text = dd + '号箱内物品列表'
        this.speckText(this.text)
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
        }
    },
})
// 回退按钮
$('#back').on('click', () => {
    window.location.href = "./doormenu.html"
})