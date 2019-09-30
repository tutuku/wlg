window.oncontextmenu = function () {
    return false;
}
var oDetails = document.getElementById('details')
const qujian = new Vue({
    el: '#content',
    data() {
        return {
            bookAmount: 0,
            arr: [],
            list1: ["名称", "尺寸","型号", "数量", "状态"],
            list2: [],
            showbox: false,
            disabled: false,
            isConsumables: null,
            disabledshop: 'auto',
            color: '#37d69e',
            fontcolor: '#fff',
            border: 'none',
            statuslist: ["正常", "被预约", "被借走", "无物品"],
            nun: '(空)',
            zor: '0',
            classenable: false,
            text:''
        }
    },
    computed: {
        newdata() {
            const _this = this;
            return this.list2.map(ele => {
                console.log('000', ele)
                if (ele.goodsName == "") {
                    ele.goodsName = _this.nun
                } else {
                    ele.goodsName == ele.goodsName
                }
                if (ele.goodsSize == "") {
                    ele.goodsSize = _this.nun
                } else {
                    ele.goodsSize == ele.goodsSize
                }
                if (ele.usageNum == "") {
                    ele.usageNum = _this.zor
                } else {
                    ele.usageNum == ele.usageNum
                }
                if (ele.measurement == "") {
                    ele.measurement = _this.zor
                } else {
                    ele.measurement == ele.measurement
                }
                if (ele.gamount==null){
                    console.log(ele.gamount)
                    ele.gamount= 1
                }
                if (ele.usageNum == "0"&& ele.isConsumables=='1') {
                    console.log(_this.statuslist[3])
                    ele.goodsStatus1 = _this.statuslist[3]
                } else {
                    ele.goodsStatus1 = _this.statuslist[ele.goodsStatus - 1];
                }
                return ele;
            });
        }
    },
    created() {
        var newId = JSON.parse(localStorage.getItem('b'));
        var goodsName = localStorage.getItem('bname')
        this.text = goodsName + '列表'
        this.speckText(this.text)
        var that = this
        if (typeof newId == "object") {
            that.list2 = newId
        } else {
            $.ajax({
                url: baseurl + '/newGoods/goodsMenuList',
                type: 'post',
                cache: true, //推荐使用缓存
                data: {
                    parentid: newId
                },
                success: function (success) {
                    let data = success.data;
                    that.list2 = success.data
                    for (var i = 0; i < data.length; i++) {
                        if (that.list2[i].isConsumables == 1) {
                            console.log(that.list2.status)
                            if (that.list2[i].status > 1) {
                                console.log(that.list2[i].goodsStatus1, '2222')
                                that.list2[i].goodsStatus1 == '正常'
                                console.log(that.list2[i].goodsStatus1, '3333')
                            }
                        }
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    },
    methods: {
        speckText(str) {
            var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
            var n = new Audio(url);
            n.src = url;
            n.play();
        },
        shopcarshtyle(item) {
            // console.log(item, '44445545')
            let disabledshop, color, fontcolor, border;
            if (item.goodsStatus == 1) {
                disabledshop = 'auto';
                color = '#37d69e';
                fontcolor = '#fff';
                border = "1px solid #37d69e"
            } else if (item.goodsStatus == 2) {
                disabledshop = 'none';
                color = '#eee';
                fontcolor = '#393939';
                border = "none"
            } else {
                disabledshop = 'none';
                color = '#eee';
                fontcolor = '#393939';
                border = "none"
            }
            if(item.usageNum==0){
                disabledshop = 'none';
                color = '#eee';
                fontcolor = '#393939';
                border = "none"
            }
            return {
                'pointer-events': disabledshop,
                backgroundColor: color,
                color: fontcolor,
                border: border,
                padding: '5px'
            };
        },
        changeActive(index) {
            this.classenable = true
            this.current = index;
        },
        removeActive(index) {
            this.classenable = false
            this.current = index;
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
        send(item, index) {
            this.arr.name = this.list2[index].name;
            this.arr.manufacturer = this.list2[index].manufacturer;
            this.arr.size = this.list2[index].size;
            this.arr.note = this.list2[index].note;
            this.arr.number = this.list2[index].number;
            this.arr = [];
            this.arr.push(item);
        },
        goGet: function () {
            window.location.href = './search.html'
        },
        headlopen() {
            this.showbox = true;
        },
        headlclose() {
            this.showbox = false
        },

        handleClick(item, index) {
            console.log('55', item)
            item.gamount++;
            console.log(item.gamount)
        },
        handleClick1(item, index) {
            if (item.gamount > 0) {
                item.gamount--;
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
        addShop(item, index) {
            console.log(item.gamount)
            var that = this;
            if (item.usageNum <= 0) {
                layer.msg("没有物品可以取用了");
                var text = "取件数量大于库存数量"
                that.speckText(text)
                return false;
            }
            if (item.gamount <= 0 || item.gamount == '') {
                layer.msg('请输入正确的取件数量!');
                var text = "请输入正确的数量"
                that.speckText(text)
            } else {
                console.log(item.gamount)
                $.ajax({
                    url: baseurl + '/cart/addCart',
                    data: {
                        gamount: item.gamount || item.usageNum,
                        id: item.id
                    },
                    type: 'post',
                    success: function (suc) {
                        if (suc.success === true) {
                            layer.msg(suc.data);
                            var text = '添加成功'
                            that.speckText(text)
                            item.goodsStatus = item.goodsStatus + 1;
                            if (item.gamount == undefined) {
                                item.usageNum = item.usageNum - 1
                            } else {
                                item.usageNum = item.usageNum - item.gamount
                            }
                        } else {
                            layer.msg(suc.data)
                            var text = suc.data
                            that.speckText(text)
                        }

                    },
                    error: function (error) {
                        var text = "加入取件车失败"
                        that.speckText(text)
                    }
                })
            }
            

        }
    }
})
$('#back').on('click', () => {
    window.location.href = "./search.html"
})
$('#shop').click(function () {
    window.location.href = "./shop.html"
})