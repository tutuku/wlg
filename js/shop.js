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
            text: ''
        }
    },
    created() {
        this.text = '取件车'
        this.speckText(this.text)
        var that = this
        that.attrGoods();
    },
    computed: {
        total() {
            var total = 0;
            console.log('ooo', this.list2)
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
        refresh() {
            window.location.reload()
        },
        selectAll() {
            this.list2.forEach(item => item.checked = true)
            this.text = '全选'
            this.speckText(this.text)
        },
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
                }
            })
        },
        handleSaveNums(item) {
            var that = this
            // console.log(item)
            console.log(item.bookamount || item.usageNum, item.cid)
            $.ajax({
                url: baseurl + '/cart/updateGamount',
                data: {
                    gamount: item.bookamount || item.usageNum,
                    id: item.cid
                },
                type: 'post',
                success: function (suc) {
                    // console.log('454545',suc)
                    if (suc.success === true) {
                        layer.msg(suc.data);
                    } else {
                        layer.msg(suc.data)
                    }

                },
                error: function (error) {

                }
            })
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
        goShop() {
            window.location.href = "./shop.html"
        },
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
                    console.log(suc)
                    that.list2 = that.list2.filter(ite => {
                        return !ite.checked
                    })
                    if (suc.status == 1) {
                        layer.msg('删除成功!')
                        that.text = "删除成功！"
                        that.speckText(that.text)
                        setTimeout(function () { window.location.reload() }, 500)
                    }
                    // console.log('444',that.list2)
                }
            })
        },
        handleDelete(item, index) {
            // console.log('1111',item)
            const that = this;
            $.ajax({
                type: 'get',
                url: baseurl + '/cart/deleteById',
                data: {
                    ids: item.cid
                },
                success: function (suc) {
                    console.log(suc)
                    that.list2 = that.list2.filter(ite => {
                        return ite.cid !== item.cid
                    })
                    if (suc.status == 1) {
                        layer.msg('删除成功!')
                        that.text = '删除成功！'
                        that.speckText(that.text)
                    }
                    // console.log('444',that.list2)

                }
            })
        },
        numplus(item, index) {
            console.log(item.bookamount)
            item.bookamount = item.bookamount + 1;
        },
        numcomit(item, index) {
            let _this = this;
            if (item.bookamount > 0) {
                item.bookamount--;
                console.log('00', item.bookamount)
                this.disabled = false;
                if (item.bookamount === 0) {
                    layer.confirm('确认要删除吗?', {
                        btn: ['确定', '取消']
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
                    })
                }
            } else {
                alert()
                this.disabled = true;
                var that = this
                $.ajax({
                    type: 'get',
                    url: baseurl + '/cart/deleteById',
                    data: {
                        id: that.list2[index].cid
                    },
                    success: function (suc) {
                        console.log(suc)

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
        guansuo(item, newitem, index, indexs) {
            console.log('guan item', item.sids)

            var that = this
            $.ajax({
                type: 'post',
                url: baseurl + '/cart/check',
                data: {
                    sids: item.sids
                },
                success: function (res) {
                    console.log('guan', res)
                    var suostatus
                    if (res.status == 1) {
                        clearTimeout(suostatus)
                        if (newitem == false) {
                            console.log(000)
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
                                    layer.msg('取件信息已确认！')
                                    that.text = '取件信息已确认！'
                                    that.speckText(that.text)
                                    console.log(index, layero, 'besure', content)
                                    setTimeout(function () { window.location.reload() }, 2000)   
                                }
                            });
                        } else {
                            that.quwu(newitem)
                            console.log(111)
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
        kaisuo(item, newitem, indexs) {
            // console.log('kai item', item)
            // console.log('newitem', newitem)
            // console.log('kai', this)
            var that = this
            if (!item) {
                console.log(2)
            } else {
                $.ajax({
                    type: 'post',
                    url: baseurl + '/cart/fetchGoods',
                    data: {
                        id: item.gid,
                        cids: item.cid,
                        goodsNum:item.bookamount
                    },
                    success: function (suc) {
                        console.log(suc)
                        if (suc.status == 1) {
                            setTimeout(function () { that.guansuo(item, newitem, indexs) }, 5000)
                        } else if (suc.status == -1) {
                            layer.msg(suc.data, {
                                icon: 2,
                                time: 2000
                            });
                            layer.close(indexs);
                        }
                    }
                })
            }
        },
        quwu(list) {
            var indexs = layer.load(1, {
                shade: [0.8, '#000'],
                success: function (layero) {
                    layero.find('.layui-layer-content').after(
                        "<p style='position:absolute;left:-95px;color:#e5e5e5;white-space:nowrap;font-size:22px'>取完物品,记得关闭柜门哦!</p>"
                    )
                }
            });

            if (!list) {
                layer.close(indexs)
                clearTimeout(suostatus)
                console.log(last)
            } else {
                console.log('list', list)
                let sids = []
                let sidss = list.map(item => {
                    return item.sids
                }).join(',')
                console.log(sidss)
                var that = this
                $.ajax({
                    type: 'post',
                    url: baseurl + '/cart/check',
                    data: {
                        sids: sidss
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.status == 1) {
                            console.log(list, '555555555')
                            that.text = "柜门已开,请取件,您正在取" + list[list.length - 1].gname + '数量为' + list[list.length - 1].bookamount + "件，请仔细核对"
                            console.log(that.text)
                            that.speckText(that.text)
                            that.kaisuo(list.pop(), list, indexs)
                        } else if (res.status == -1) {
                            layer.msg('柜门已开!')
                            var text = "柜门已开"
                            that.speckText(text)
                            layer.close(indexs)
                        }
                    }
                })
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
        postwupin() {
            const _this = this;
            layui.use('table', function () {
                var table = layui.table;
                table.render({
                    elem: '#test'
                    , data: _this.itemchecked
                    , cellMinWidth: 80
                    , cols: [[
                        { field: 'gname', width: 178, title: '物品名称', align: 'center' }
                        , { field: 'gfactory', width: 178, title: '厂家', align: 'center' }
                        , { field: 'gsize', width: 178, title: '尺寸', align: 'center' }
                        , { field: 'measurement', width: 178, title: '型号', align: 'center' }
                        , { field: 'bookamount', width: 178, title: '数量' }
                        // , { field: 'right', width: 140, title: '操作', align: 'center', toolbar: '#barDemo' }
                    ]]
                });
                table.on('tool(test1)', function (obj) {
                    var data = obj.data
                    var layEvent = obj.event;
                    if (layEvent === 'edit') {
                        console.log('edit', obj.data)
                        // $.ajax({
                        //     url:baseurl+'',
                        //     type:'post',
                        //     success:function(res){
                        //         console.log(res)
                        //     }
                        // })
                    }
                });
            });
            let sendlist = [];
            sendlist = _this.itemchecked;
            var list = _this.itemchecked
            let total = 0;
            for (var i = 0; i < _this.itemchecked.length; i++) {
                total += Number(_this.itemchecked[i].bookamount)
            }
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
    },
})

var aGetmate = document.getElementsByClassName('get-mate')

$('#back').on('click', () => {
    window.location.href = "./search.html"
})

$("#all").click(function () {
    var oin = $("input[type='checkbox']")
    oin.each(function () {
        $(this).prop("checked", true)
    })
});
$("#delAll").click(function () {
    var oin = $("input[type='checkbox']")
    oin.each(function () {
        $(this).prop("checked", true)
    })
});
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