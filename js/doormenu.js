window.oncontextmenu = function () {
    return false;
}
const qujian = new Vue({
    el: '#content',
    data() {
        return {
            list:[],
            text:''
        }
    },
    created(){
        var that = this
        $.ajax({
            url:baseurl+'/sark/sarkList',
            type:'post',
            data:{},
            success:function(res){
                console.log(res)
                that.list=res.data
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
                    console.log(data)
                },
            });
        },
        door(item) {
            localStorage.setItem('did',item.id)
            window.location.href="./doorlist.html"
        }
    },
})
$('#back').on('click', () => {
    window.location.href = "./shouye.html"
})