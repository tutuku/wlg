var did=localStorage.getItem('did')
console.log(did)
 layui.use('table', function () {
    var table = layui.table;
    console.log(baseurl + '/newGoods/findGoodsBySarkId')
    var w=$(parent.window).width()
    table.render({
        elem: '#test'
        , url: baseurl + '/newGoods/findGoodsBySarkId?id='+did
        , method: 'post'
        ,width:w//在此处添加width参数
        , page: {
            //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
            //,curr: 5 //设定初始在第 5 页
            , groups: 1 //只显示 1 个连续页码
            , first: false //不显示首页
            , last: false //不显示尾页
        }
        , parseData: function (res) {
            console.log(res, '00000')
            return {
                "code": 0,
                "data": res.data.rows
                ,count:res.data.total
            }
        }
        , toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
        , defaultToolbar: [,{//'filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
            title: '提示'
            , layEvent: 'LAYTABLE_TIPS'
            , icon: 'layui-icon-tips'
        }]
        , title: '用户数据表'
        , cols: [[
            // { type: 'checkbox', width: '2%', fixed: 'left' }
             { field: 'zizeng', width: '5.5%', title: '序号', fixed: 'left', sort: true, align: 'center', templet: '#zizeng',}
            , { field: 'goodsImgThumbnail', width: '7%', title: '图片',event: 'setSign', align: 'center',templet: function (d) { return '<div style="padding:0px;width:100%"><img style="width:100%;height:60px;" src="' + d.goodsImgThumbnail + '"></div>' } }
            , { field: 'goodsName', width: '12%', title: '物品名称', align: 'center' }
            , { field: 'goodsSize', width: '8.5%', title: '尺寸', align: 'center' }
            , { field: 'isConsumables', width: '10%', title: '是否为消耗品', align: 'center', templet: function (d) {
                    switch (d.isConsumables) {
                        case 1:
                            return "是"
                            break;
                        case 2:
                            return "不是"
                            break;
                    }
                } 
            }
            , { field: 'isbig', width:'10%', title: '是否大件', align: 'center' , templet: function (d) {
                    switch (d.isbig) {
                        case 1:
                            return "是"
                            break;
                        case 2:
                            return "不是"
                            break;
                        case null:
                            return ""
                            break;
                    }
                } 
            }
            , { field: 'usageNum', width: '9%', title: '数量', align: 'center' }
            , { field: 'measurement', width: '10%', title: '型号', align: 'center' }
            , { field: 'goodsFactory', width: '10%', title: '厂家', align: 'center' }
            , { field: 'factoryPhone', width: '10%', title: '联系电话', align: 'center' }
            , {
                field: 'goodsStatus', width: '8.2%', title: '状态', align: 'center', templet: function (d) {
                    switch (d.goodsStatus) {
                        case 1:
                            return "<span style='color:#009688'>正常</span>"
                            break;
                        case 2:
                            return "<span style='color:orange'>被预约</span>"
                            break;
                        case 3:
                            return "<span style='color:red'>被借走</span>"
                            break;
                    }
                }
            }
        ]]
    });
    table.on('tool(demoEvent)', function (obj) {
        var data = obj.data;
        if (obj.event === 'setSign') {
            console.log(data)
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: [600,400],
                skin: 'layui-layer-nobg',
                shadeClose: true,
                content: '<img style="width:600px;height:400px;" src="'+data.goodsImg+'">'
            });
        }
    });
});