window.oncontextmenu = function(){
    return false;
}
        const qujian = new Vue({
            el: '#content',
            data() {
                return {
                    list: [],
                    showbox: false,
                    id: '',
                    val: '',
                    text:''
                }
            },
            created() {
                var newId = localStorage.getItem('b')
                var gname = localStorage.getItem('gname')
                this.text = gname + '物品'
                this.speckText(this.text)
                var that = this
                console.log(newId)
                $.ajax({
                    url: baseurl+'/newGoods/newMenu',
                    type: 'post',
                    cache: true, //推荐使用缓存
                    data: {
                        parentid: newId
                    },
                    success: function (success) {
                        console.log(success.data)
                        that.list = success.data
                        that.id = success.data.id
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            },
            methods: {
                speckText(str) {
                    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
                    var n = new Audio(url);
                    n.src = url;
                    n.play();
                },
                block: function (index) {
                    console.log(this)
                },
                handleToggle(item) {
                    console.log(item)
                    localStorage.setItem('id', item.id)
                    localStorage.setItem('igname',item.goodsName)
                    window.location.href='./huanlist.html'
                },
                // 叉号按钮点击事件
                handlleClose() {
                    this.showbox = false;
                },
                goHsearch(){
                    window.location.href='./huansearch.html'
                },
                goShop(){
                    window.location.href = "./shop.html"
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
                back(){
                    window.location.href = "./huansearch.html"
                },
                goShou(){
                    window.location.href ='./shouye.html'
                }
            },
        })