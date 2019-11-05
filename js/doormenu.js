window.oncontextmenu = function () {
    return false;
}
const qujian = new Vue({
    el: '#content',
    data() {
        return {
            list:[],
            text:'',
            num:''
        }
    },
    created(){
        // 页面挂载请求箱子列表
        var that = this
        that.num = localStorage.getItem('num')
        $.ajax({
            url:baseurl+'/sark/findByNum',
            type:'post',
            data:{
                num:that.num
            },
            success:function(res){
                console.log(res,'res')
                that.list=res.data
            }
        })
        that.text = that.num+'号柜门列表'
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
        // 点击跳转
        door(item) {
            localStorage.setItem('did',item.sarkNum)
            window.location.href="./doorlist.html"
        }
    },
})
$('#back').on('click', () => {
    window.location.href = "./door.html"
})