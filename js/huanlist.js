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
                    val:'',
                    nun:'(空)',
                    text:''
                }
            },
            created() {
                var newId=localStorage.getItem('id')
                this.text = '还件列表'
                this.speckText(this.text)
                var that=this
                console.log(newId)
                $.ajax({
                    url:baseurl+'/newGoods/findBorrowed',
                    type:'post',
                    data:{
                        parentid:newId
                    },
                    success:function(res){
                        console.log(res.data)
                        for (var i=0;i<res.data.length;i++){
                            if (res.data[i].gname == "") {
                            res.data[i].gname = that.nun
                        } else { 
                            res.data[i].gname == res.data[i].gname 
                            }
                        if (res.data[i].gfactory == "") {
                            res.data[i].gfactory = that.nun
                        } else { 
                            res.data[i].gfactory == res.data[i].gfactory 
                            }
                        if (res.data[i].gsize == "") {
                            res.data[i].gsize = that.nun
                        } else {
                            res.data[i].gsize == res.data[i].gsize
                        }
                        if (res.data[i].measurement == "") {
                            res.data[i].measurement = that.nun
                        } else {
                            res.data[i].measurement == res.data[i].measurement
                        }
                        if (res.data[i].uname == null) {
                            res.data[i].uname = that.nun
                        } else {
                            res.data[i].uname == res.data[i].uname
                        }
                        if (res.data[i].gnum == "") {
                            res.data[i].gnum = that.nun
                        } else {
                            res.data[i].gnum == res.data[i].gnum
                        }
                        }
                        that.list2=res.data
                        // if(res.data[0].isConsumables==2){
                        //     that.list1=["名称","厂家","型号","尺寸", "数量"]
                        // }else{
                            that.list1=["名称","厂家","尺寸", "型号", "数量","借件人"]
                        // }
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
                    window.location.href='./huansearch.html'
                },
                handleClose (){
                    this.showbox=false
                },
                back(){
                    window.location.href='./shouye.html'
                },
                addShop(item,index){
                    var that = this
                    sessionStorage.setItem('bid',item.gid)
                    sessionStorage.setItem('ids',item.sids)
                    console.log('00',item)
                        that.besure1()
                },
                goShop(){
                    window.location.href = "./shop.html"
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
                guansuo1(ids,indexs,index) {
                    console.log('guan ids', ids)
                    var that = this
                    $.ajax({
                        type: 'post',
                        url: baseurl + '/cart/check',
                        data: {
                            sids: ids
                        },
                        success: function (res) {
                            console.log('guan', res)
                            var suostatus
                            if (res.status == 1) {
                                clearTimeout(suostatus)
                                layer.msg('还件成功!')
                                var text="归还成功"
                                that.speckText(text)
                                setTimeout(function(indexs){
                                    layer.close(indexs)
                                    window.location.reload()
                                },2000)
                            } else {
                                if (index == 100) {
                                    clearTimeout(suostatus)
                                    window.location.reload()
                                }
                                index = index || 1;
                                index++
                                suostatus = setTimeout(function () {
                                    that.guansuo1(ids, indexs,index)
                                    var text="请关柜门"
                                    that.speckText(text)
                                }, 3000)
                            }
                        }

                    })
                },
                besure1() {
                    var id=sessionStorage.getItem('bid')
                    var ids=sessionStorage.getItem('ids')
                        var that = this
                        console.log(id,ids)
                        var indexs = layer.load(1, {
                        shade: [0.8,'#000'] ,
                            success:function(layero){
                                layero.find('.layui-layer-content').after("<p style='position:absolute;left:-95px;color:#e5e5e5;white-space:nowrap;font-size:22px'>还完物品,记得关闭柜门哦!</p>")
                            }
                        })  
                    $.ajax({
                            type: 'post',
                            url: baseurl + '/newGoods/returnGoods',
                            data: {
                                gamount: 1,
                                id: id
                            },
                            success: function (suc) {
                                console.log(suc)
                                if(suc.status==1){
                                    that.text = '柜门已开，请还件'
                                    that.speckText(that.text)
                                    setTimeout(function(){that.guansuo1(ids,indexs)},3000)
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
            }  
        }) 