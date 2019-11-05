layui.use(['form', 'upload', 'layer'], function () {
    var form = layui.form;
    //检查项目添加到下拉框中
    $.ajax({
        url: baseurl + '/user/findAllUser',
        dataType: 'json',
        type: 'post',
        success: function (data) {
            // console.log(data,'ooooooooo')
            $.each(data.data, function (index, item) {
                // console.log('sssssssss',item)
                $('#xm').append(new Option(item.realname, item.id));// 下拉菜单里添加元素
            });
            layui.form.render("select");
            //重新渲染 固定写法
        }
    })
    form.on('select(xmFilter)', function(data){
        // // console.log(data.id); //得到select原始DOM对象
        // console.log(data.value); //得到被选中的值
        // // console.log(data.othis); //得到美化后的DOM对象
        $.ajax({
            url:baseurl + '/cart/sendCart/',
            type:'post',
            data:{
                uid:data.value
            },
            success(res){
                // console.log(res)
                if(res.status==1){
                    layer.msg(res.data)
                    setTimeout(function(){window.location.reload()},1000)
                }
            }
        })
      });      
});