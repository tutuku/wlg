window.oncontextmenu = function(){
    return false;
}
        var oDetails = document.getElementById('details')
        var ozhezhao=document.getElementById('zhezhao') 
              
        const huanjian = new Vue({
            el: '#content',
            data() {
                return {
                    arr: [],
                    list1: [],
                    list2: [],
                    showbox:false,
                    val:'',
                    nun:'(空)',
                    text:''
                }
            },
            created() {
                this.text = '消耗品补充'
                this.speckText(this.text)
                var that=this
                $.ajax({
                    url:baseurl+'/newGoods/findAllXHP',
                    type:'post',
                    data:{},
                    success:function(res){
                        console.log(res.data)
                        for (var i=0;i<res.data.length;i++){
                            if (res.data[i].goodsName == "") {
                            res.data[i].goodsName = that.nun
                        } else { 
                            res.data[i].goodsName == res.data[i].goodsName 
                            }
                        if (res.data[i].goodsFactory == "") {
                            res.data[i].goodsFactory = that.nun
                        } else { 
                            res.data[i].goodsFactory == res.data[i].goodsFactory 
                            }
                        if (res.data[i].goodsSize == "") {
                            res.data[i].goodsSize = that.nun
                        } else {
                            res.data[i].goodsSize == res.data[i].goodsSize
                        }
                        if (res.data[i].measurement == "") {
                            res.data[i].measurement = that.nun
                        } else {
                            res.data[i].measurement == res.data[i].measurement
                        }
                        }
                        that.list2=res.data
                            that.list1=["名称","厂家","尺寸","型号", "数量"]
                    },
                    error:function(err){
                        console.log(err)
                    }
                })
            },
            methods: {
                goShou(){
                    window.location.href ='./shouye.html'
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
                goBack:function(){
                    window.location.href='./shouye.html'
                },
                handleClose (){
                    this.showbox=false
                },
                back(){
                    window.location.href='./shouye.html'
                },
                addShop(item,index){
                    var that = this
                    sessionStorage.setItem('bid',item.id)
                    sessionStorage.setItem('ids',item.sids)
                    console.log('00',item)
                       this.showbox=true 
                    
                },
                play(mp3){
                    var mp3 = new Audio(mp3);
                    mp3.play(); //播放 mp3这个音频对象
                },
                speckText(str) {
                    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
                    var n = new Audio(url);
                    n.src = url;
                    n.play();
                },
                besure(){
                    var that = this
                    if ($('#backs input').val() < '0') {
                        layer.msg('请输入正确的还件数量!');
                        var text="请输入正确的数量"
                        that.speckText(text)
                    } else {
                        var id=sessionStorage.getItem('bid')
                        var ids=sessionStorage.getItem('ids')
                        console.log(id)
                        var indexs = layer.load(1, {
                        shade: [0.8,'#000'] ,
                            success:function(layero){
                                layero.find('.layui-layer-content').after("<p style='position:absolute;left:-95px;color:#e5e5e5;white-space:nowrap;font-size:22px'>补充完物品,记得关闭柜门哦!</p>")
                            }
                        })  
                        $.ajax({
                            type: 'post',
                            url: baseurl + '/newGoods/returnXHP',
                            data: {
                                gamount: that.val,
                                id: id
                            },
                            success: function (suc) {
                                console.log(suc)
                                if(suc.status==1){
                                    that.text = '柜门已开，请补充物品'
                                    that.speckText(that.text)
                                    setTimeout(() => {
                                        that.guansuo(ids,indexs)
                                    }, 3000);
                                    $('#backs input').val('')
                                    that.showbox=false
                                }else{
                                    layer.msg(suc.data);
                                    layer.close(indexs)
                                    that.text = suc.data
                                    that.speckText(that.text)
                                }
                            }
                        })

                    }
                },
                guansuo(ids,indexs,index) {
                    console.log('guan ids', ids)
                    var that = this
                    $.ajax({
                        type: 'post',
                        url: baseurl + '/cart/check',
                        data: {
                            sids: ids
                        },
                        success: function (res) {
                            // var flax=0;
                            console.log('guan', res)
                            var suostatus
                            if (res.status == 1) {
                                // flax++
                                clearTimeout(suostatus)
                                layer.msg('补充成功!')
                                var text="补充成功"
                                that.speckText(text)
                                setTimeout(function(){
                                    layer.close(indexs)
                                    window.location.reload()
                                },2000)
                            } else {
                                if (index == 100) {
                                    clearTimeout(suostatus)
                                }
                                index = index || 1;
                                index++
                                suostatus = setTimeout(function () {
                                    that.guansuo(ids, indexs)
                                    var text="请关柜门"
                                    that.speckText(text)
                                }, 3000)
                            }
                        }

                    })
                }
            }  
        }) 