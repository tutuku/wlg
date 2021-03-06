layui.use(['table','element','form', 'upload', 'layer'], function () {
    var form = layui.form;
    var table = layui.table;
    var $ = layui.jquery
    var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
    var w = $(parent.window).width()
    table.render({
        elem: '#test'
        , url: baseurl + '/newGoods/queryList/'
        , method: 'post'
        , width: w//在此处添加width参数 
        , page: {
            //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
            layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
            //,curr: 5 //设定初始在第 5 页
            , groups: 1 //只显示 1 个连续页码
            , first: false //不显示首页
            , last: false //不显示尾页
        }
        , parseData: function (res) {
            // console.log(res, '2323132')
            return {
                "code": 0,
                "data": res.data.rows
                , count: res.data.total
            }
        }

        , toolbar: '#toolbarDemo' //开启头部工具栏，并为其绑定左侧模板
        , defaultToolbar: [, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
            title: '提示'
            , layEvent: 'LAYTABLE_TIPS'
            , icon: 'layui-icon-tips'
        }]
        , title: '用户数据表'
        // 渲染列表
        , cols: [[
            // { type: 'checkbox', width: '2%', fixed: 'left' }
            { field: 'zizeng', width: '10%', title: '序号', fixed: true, sort: true, align: 'center', templet: '#zizeng', }
            , { field: 'limg', width: '7%', title: '图片', event: 'setSign', align: 'center', templet: function (d) { return '<div style="padding:0px;width:100%"><img style="width:100%;height:60px;" src="' + d.limg + '"></div>' } }
            , { field: 'menuname', width: '7%', title: 'Ⅰ级类别', align: 'center' }
            , { field: 'menuname2', width: '7%', title: 'Ⅱ级类别', align: 'center' }
            , { field: 'gname', width: '15%', title: '物品名称', align: 'center' }
            // , { field: 'gtime', width: '10%', title: '创建时间', align: 'center' }
            , { field: 'gnum', width: '9%', title: '数量', align: 'center' }
            , { field: 'gsize', width: '12%', title: '尺寸', align: 'center' }
            , { field: 'measurement', width: '13%', title: '型号', align: 'center' }
            , { field: 'gfactory', width: '11%', title: '厂家', align: 'center' }
            // , { field: 'fphone', width: '8%', title: '联系电话', align: 'center' }
            , {
                field: 'gstatus', width: '8.8%', title: '状态', align: 'center', templet: function (d) {
                    switch (d.gstatus) {
                        case 1:
                            return "<span style='color:#009688'>正常</span>"
                            break;
                        case 2:
                            return "<span style='color:orange'>预约</span>"
                            break;
                        case 3:
                            return "<span style='color:red'>借出</span>"
                            break;
                    }

                }
            },
        ]]
        , id: 'testReload'
    });
    table.on('tool(demoEvent)', function (obj) {
        var data = obj.data;
        if (obj.event === 'setSign') {
            // console.log(data)
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                area: [600, 400],
                skin: 'layui-layer-nobg', //没有背景色
                shadeClose: true,
                content: '<img style="width:600px;height:400px;" src="' + data.gimg + '">'
            });
        }
    });
    var status=''
    layui.form.render("select");
    form.on('select(xmFilter)', function(data){
        // // console.log(data.id); //得到select原始DOM对象
        console.log(data.value); //得到被选中的值
        // // console.log(data.othis); //得到美化后的DOM对象
        status=data.value
      }); 
    var $ = layui.$, active = {
        reload: function () {
            var demoReload = $('#demoReload');
            var demoReloadSize = $('#demoReloadSize');
            var demoReloadFactory = $('#demoReloadFactory');
            var demoReloadMeasurement = $('#demoReloadMeasurement')
            var demoReloadFphone = $('#demoReloadFphone');
            var demoReloadGstatus =$('demoReloadGstatus')

            //执行重载
            console.log(demoReload)
            table.reload('testReload', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
                , where: {
                        gname: demoReload.val(),
                        gsize: demoReloadSize.val(),
                        gfactory: demoReloadFactory.val(),
                        measurement: demoReloadMeasurement.val(),
                        fphone:demoReloadFphone.val(),
                        gstatus:status
                }
            }, 'data');
        }
    };
    $('.demoTable .layui-btn').on('click', function () {
        console.log(this)
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });
    
});