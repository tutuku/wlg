window.oncontextmenu = function () {
    return false;
}

const qujian = new Vue({
    el: '#content',
    data() {
        return {
            list1: ['图片', '物品名称', '型号', '尺寸', '数量', '操作'],
            list2: [],
            disabled: false,
            showcontrol: true,
            text: '',
            userList:[]
        }
    },
    created() {
        // 页面挂载请求用户添加到取件车的列表
        this.text = '取件车'
        this.speckText(this.text)
        var that = this
        that.attrGoods();
        // that.allUser();
    },
    computed: {
        // 页面挂载前请求数据重新赋值
        total() {
            var total = 0;
            // console.log('ooo', this.list2)
            if (this.list2.length !== 0) {
                this.list2.map((item, index) => {
                    total += Number(item.bookamount);
                })
            }
            return total;
        },
        itemchecked() {
            return this.list2.filter(item => item.checked == true)
        }
    },
    methods: {
        // 物品信息过长的处理
        gName(item){
            layer.tips("<span style='font-size:20px;line-height:25px'>"+item.gname+"</span>", '.Gname',{time: 3000,area:['auto','auto']});
        },
        // 请求所用用户
        allUser(){
            $.ajax({
                url: baseurl + '/user/findAllUser',
                type:'post',
                success(res){
                    // console.log(res,'alluser')
                    this.userList = res.data
                    // console.log(this.userList)
                }
            })
            
        },
        // 刷新按钮
        refresh() {
            window.location.reload()
        },
        // 全选按钮
        selectAll() {
            this.list2.forEach(item => item.checked = true)
            this.text = '全选'
            this.speckText(this.text)
        },
        // 全不选按钮
        unselectAll() {
            this.list2.forEach(item => item.checked = false)
            this.text = '全不选'
            this.speckText(this.text)
        },
        attrGoods() {
            let _this = this;
            $.ajax({
                type: 'post',
                url: baseurl + '/cart/cartGoodsList',
                success: function (suc) {
                    _this.list2 = suc.data.map(iem => {
                        iem.checked = true;
                        return iem;
                    })
                    // _this.UniquePay(suc.data)
                    // _this.list2 = payArr.map(iem => {
                    //         iem.checked = true;
                    //         return iem;
                    //     })
                }
            })
        },
        // 修改数量保存按钮
        handleSaveNums(item) {
            var that = this
            // console.log(item, '4556456456')
            // console.log(item.bookamount, item.usageNum, item.cid)
            $.ajax({
                url: baseurl + '/cart/updateGamount',
                data: {
                    gamount: item.bookamount || item.usageNum,
                    id: item.cid
                },
                type: 'post',
                success: function (suc) {
                    // // console.log('454545',suc)
                    if (suc.success === true) {
                        layer.msg(suc.data);
                    } else {
                        layer.msg(suc.data)
                        setTimeout(function () { window.location.reload() }, 1000)
                    }

                },
                error: function (error) {

                }
            })
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
        goShop() {
            window.location.href = "./shop.html"
        },
        // 删除此物品
        handleDeleteitems() {
            const that = this;
            const itemlist = this.itemchecked.map(item => item.cid).join(",")
            $.ajax({
                type: 'get',
                url: baseurl + '/cart/deleteById',
                data: {
                    ids: itemlist
                },
                success: function (suc) {
                    // console.log(suc)
                    that.list2 = that.list2.filter(ite => {
                        return !ite.checked
                    })
                    if (suc.status == 1) {
                        layer.msg('删除成功!')
                        that.text = "删除成功！"
                        that.speckText(that.text)
                        setTimeout(function () { window.location.reload() }, 500)
                    }
                    // // console.log('444',that.list2)
                }
            })
        },
        // 删除物品
        handleDelete(item, index) {
            // // console.log('1111',item)
            const that = this;
            $.ajax({
                type: 'get',
                url: baseurl + '/cart/deleteById',
                data: {
                    ids: item.cid
                },
                success: function (suc) {
                    // console.log(suc)
                    that.list2 = that.list2.filter(ite => {
                        return ite.cid !== item.cid
                    })
                    if (suc.status == 1) {
                        layer.msg('删除成功!')
                        that.text = '删除成功！'
                        that.speckText(that.text)
                    }
                    // // console.log('444',that.list2)

                }
            })
        },
        // 加1按钮
        numplus(item, index) {
            // console.log(item.bookamount)
            item.bookamount = item.bookamount + 1;
        },
        // 减1按钮
        numcomit(item, index) {
            let _this = this;
            if (item.bookamount > 0) {
                item.bookamount--;
                // console.log('00', item.bookamount)
                this.disabled = false;
                if (item.bookamount === 0) {
                    layer.confirm('确认要删除吗?', {
                        btn: ['确定', '取消'],closeBtn: 0
                    }, function () {
                        $.ajax({
                            type: 'get',
                            url: baseurl + '/cart/deleteById',
                            data: {
                                ids: item.cid
                            },
                            success: function (suc) {
                                if (suc.success === true) {
                                    layer.msg('删除成功!')
                                    _this.attrGoods()
                                } else {
                                    layer.msg('删除失败!')
                                }
                            }
                        })
                    },
                    function(){
                        window.location.reload()
                    })
                }
            } else {
                this.disabled = true;
                var that = this
                $.ajax({
                    type: 'get',
                    url: baseurl + '/cart/deleteById',
                    data: {
                        id: that.list2[index].cid
                    },
                    success: function (suc) {
                        // console.log(suc)

                        that.list2 = that.list2.filter(item => {
                            return !item == that.list2[index].cid
                        })
                    }
                })
            }
        },
        handleClick(item, index, type) {

            if (type === "plus") {
                this.numplus(item, index);
            } else {
                this.numcomit(item, index);
            }
        },
        UniquePay(paylist) {
            payArr = [paylist[0]];
            for (var i = 1; i < paylist.length; i++) {
                var payItem = paylist[i];
                var repeat = false;
                for (var j = 0; j < payArr.length; j++) {
                    if (payItem.sids == payArr[j].sids) {
                        // console.log(payItem.sids)
                        // payArr[j].cid = payArr[j].cid + ',' + payItem.cid;
                        // payArr[j].gid = payArr[j].gid + ',' + payItem.gid;
                        if (payItem.gname == payArr[j].gname) {
                            payArr[j].gname = payItem.gname
                            payArr[j].bookamount = payArr[j].bookamount + payItem.bookamount;
                        } 
                        // else {
                        //     payArr[j].gname = payArr[j].gname + ',' + payItem.gname;
                        //     payArr[j].bookamount = payArr[j].bookamount + ',' + payItem.bookamount
                        // }
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    payArr.push(payItem);
                }
            }
            // console.log('payArr', payArr)
            return payArr;
        },
        // 询问当前开锁的状态
        guansuo(item, newitem, index, indexs) {
            // console.log('guan item', item.sids)

            var that = this
            $.ajax({
                type: 'post',
                url: baseurl + '/cart/check',
                data: {
                    sids: item.sids
                },
                success: function (res) {
                    // console.log('guan', res)
                    var suostatus
                    if (res.status == 1) {
                        clearTimeout(suostatus)
                        if (newitem == false) {
                            // console.log(000)
                            layer.close(indexs)
                            layer.msg('取件成功！')
                            var text = "取件成功"
                            that.speckText(text)
                            layer.open({
                                type: 1,
                                title: false,
                                closeBtn: 0,
                                skin: 'layui-layer-rim myclass',
                                area: ['900px', '700px'],
                                content: $('#tong')
                                , btnAlign: 'c'
                                , btn: ['确定']
                                , yes: function (index, layero, content) {
                                    // layer.msg('信息已确认！')
                                    // that.text = '信息已确认！'
                                    // that.speckText(that.text)
                                    // // console.log(index,'888888', layero, 'besure', content)
                                    // setTimeout(function () {}, 1000)
                                    window.location.reload()
                                }
                            });
                        } else {
                            that.quwu(newitem)
                            // console.log(111)
                        }
                    } else {
                        if (index == 100) {
                            clearTimeout(suostatus)
                            that.quwu(newitem)
                        }
                        index = index || 1;
                        index++
                        suostatus = setTimeout(function () {
                            that.guansuo(item, newitem, index)
                            var text = "请关柜门"
                            that.speckText(text)
                        }, 3000)
                    }
                }

            })
        },
        // 发送开锁请求
        kaisuo(item, newitem, indexs) {
            // // console.log('kai item', item)
            // // console.log('newitem', newitem)
            // // console.log('kai', this)
            var that = this
            if (!item) {
                // console.log(2)
            } else {
                $.ajax({
                    type: 'post',
                    url: baseurl + '/cart/fetchGoods',
                    data: {
                        id: item.gid,
                        cids: item.cid,
                        goodsNum: item.bookamount
                    },
                    success: function (suc) {
                        // console.log(suc)
                        if (suc.status == 1) {
                            that.text = "柜门已开,请取" + item.gname + ',数量为' + item.bookamount + "件"
                            // console.log(that.text)
                            that.speckText(that.text)
                            setTimeout(function () { that.guansuo(item, newitem, indexs) }, 3000)
                        } else if (suc.status == -1) {
                            // layer.msg(suc.data, {
                            //     icon: 2,
                            //     time: 2000
                            // });
                            // layer.close(indexs);
                            let confirm = layer.confirm(item.gname + "取件失败，确定重新取件吗？", {
                                type: 0,
                                closeBtn: 0,
                                title: '温馨提示',
                                area: ['450px', '300px'],
                                skin: 'demo-class',
                                btn: ['确定', '取消']
                            },
                                function () {
                                    layer.close(confirm)
                                    setTimeout(function () { that.kaisuo(item, newitem, indexs) }, 1000)
                                },
                                function () {
                                    window.location.reload()
                                });
                        }
                    }
                })
            }
        },
        // 勾选需要取的物品
        quwu(list) {
            var indexs = layer.load(1, {
                shade: [0.8, '#000'],
                success: function (layero) {
                    layero.find('.layui-layer-content').after(
                        "<p style='position:absolute;left:-95px;color:#e5e5e5;white-space:nowrap;font-size:22px'>取完物品,记得关闭柜门哦!</p>"
                    )
                }
            });
            // this.UniquePay(list)
            if (!list) {
                layer.close(indexs)
                clearTimeout(suostatus)
                // console.log(last)
            } else {
                // console.log('list', list)
                let sids = []
                let sidss = list.map(item => {
                    return item.sids
                }).join(',')
                // console.log(sidss)
                var that = this
                // $.ajax({
                //     type: 'post',
                //     url: baseurl + '/cart/check',
                //     data: {
                //         sids: sidss
                //     },
                //     success: function (res) {
                //         // console.log(res)
                //         if (res.status == 1) {
                //             // console.log(list, '555555555')
                // that.text = "柜门已开,请取件,您正在取" + list[list.length - 1].gname + '数量为' + list[list.length - 1].bookamount + "件，请仔细核对"
                // // console.log(that.text)
                // that.speckText(that.text)
                that.kaisuo(list.pop(), list, indexs)
                //         } else if (res.status == -1) {
                //             layer.msg('柜门已开!')
                //             var text = "柜门已开"
                //             that.speckText(text)
                //             layer.close(indexs)
                //         }
                //     }
                // })
            }
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
        // 用户去的物品列表清单
        postwupin() {
            const _this = this;
            layui.use('table', function () {
                var table = layui.table;
                table.render({
                    elem: '#test'
                    , data: _this.itemchecked
                    , cellMinWidth: 80
                    , cols: [[
                        { field: 'gname', width: 180, title: '物品名称', align: 'center' }
                        , { field: 'gfactory', width: 180, title: '厂家', align: 'center' }
                        , { field: 'gsize', width: 180, title: '尺寸', align: 'center' }
                        , { field: 'measurement', width: 180, title: '型号', align: 'center' }
                        , { field: 'bookamount', width: 180, title: '数量', align: 'center' }
                        // , { field: 'right', width: 140, title: '操作', align: 'center', toolbar: '#barDemo' }
                    ]]
                });
                table.on('tool(test1)', function (obj) {
                    var data = obj.data
                    var layEvent = obj.event;
                    if (layEvent === 'edit') {
                        // console.log('edit', obj.data)
                        // $.ajax({
                        //     url:baseurl+'',
                        //     type:'post',
                        //     success:function(res){
                        //         // console.log(res)
                        //     }
                        // })
                    }
                });
            });
            let sendlist = [];
            sendlist = _this.itemchecked;
            // var list = _this.itemchecked
            let total = 0;
            for (var i = 0; i < _this.itemchecked.length; i++) {
                total += Number(_this.itemchecked[i].bookamount)
            }
            // 修改数量的判断
            if ($('.vall').val() < '0') {
                layer.msg('请输入正确数量!');
                var text = "请输入正确的数量"
                _this.speckText(text)
            } else if (total == 0) {
                layer.msg('请勾选需要取的物品！')
                var text = "请勾选需要取的物品"
                _this.speckText(text)
            } else {
                _this.text = '本次共计' + total + '件物品,确定要取出吗?'
                _this.speckText(_this.text)
                let confirm = layer.confirm("本次共计" + total + "件物品<br>确定要取出吗?", {
                    type: 0,
                    title: '温馨提示',
                    area: ['450px', '300px'],
                    skin: 'demo-class',
                    btn: ['确定', '取消']
                },
                    function () {
                        layer.close(confirm)
                        setTimeout(function () { _this.quwu(sendlist) }, 1000)
                    },
                    function () {
                        _this.text = '已取消取件!'
                        _this.speckText(_this.text)
                        layer.msg('已取消取件!', {
                            time: 2000,
                        });
                    });
            }
        }
    }
    })

var aGetmate = document.getElementsByClassName('get-mate')
// 回退按钮
$('#back').on('click', () => {
    window.location.href = "./search.html"
})

// 全选按钮
$("#all").click(function () {
    var oin = $("input[type='checkbox']")
    oin.each(function () {
        $(this).prop("checked", true)
    })
});
// 全删按钮
$("#delAll").click(function () {
    var oin = $("input[type='checkbox']")
    oin.each(function () {
        $(this).prop("checked", true)
    })
});

// 删除按钮
$(".delete").on("click", function () {
    var sele = $(":checkbox:checked")
    if (sele.length > 0) {
        sele.each(function () {
            $(this).parent().remove()
        })
    } else {
        layer.msg('请选择至少一条数据!');
    }
})
$('.vall').bind("input propertychange", function (event) { });
$('.vall').keydown(function (event) {
    if (event.keyCode == 13) {
        if ($('.vall').val() < '0') {
            layer.msg('请输入正确数量!');
        }
    }
})