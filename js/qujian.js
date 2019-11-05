window.oncontextmenu = function(){
    return false;
}
        const qujian = new Vue({
            el: '#content',
            data() {
                return {
                    list: [],
                    text:''
                }
            },
            created() {
                // 页面挂载请求二级菜单
                var newId=localStorage.getItem('a')
                var goodsName = localStorage.getItem('name')
                this.text = goodsName + '物品'
                this.speckText(this.text)
                var that=this
                // // console.log(newId)
                $.ajax({
                    url:baseurl+'/newGoods/newMenu',
                    type:'post',
                    data:{
                        parentid:newId
                    },
                    success:function(res){
                       // console.log(res)
                        that.list=res.data
                    },
                    error:function(err){
                        // console.log(err)
                    }
                })
            },
            methods: {
                // 语音播报
                speckText(str) {
                    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
                    var n = new Audio(url);
                    n.src = url;
                    n.play();
                },
                // 回退按钮
                goGet:function(){
                    window.location.href='./search.html'
                },
                // 取件车按钮
                goShou(){
                    window.location.href ='./shouye.html'
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
                // 点击进入三级菜单
                sendId:function(item){
                    // console.log(item)
                    localStorage.setItem('b',JSON.stringify(item.id))
                    localStorage.setItem('bname',JSON.stringify(item.goodsName))
                    // console.log('b',item.id)
                        window.location.href='./qulist.html'
                }
            },
        })
        var oZhezhao = document.getElementById('zhezhao')
        $("#center li").on("click", function () {
            window.location.href = "./qulist.html"
        })
        $("#img").on("click", function () {
            oZhezhao.style.display = 'none'
        })
        $('#back').on('click', () => {
            window.location.href = "./search.html"
        })
        $('#shop').click(function(){
            window.location.href="./shop.html"
        })