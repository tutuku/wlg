$(function () {
    // layui.form.val('example1', shouye.realdata); 
    //表单初始赋值
    layui.form.val('example1', JSON.parse(sessionStorage.getItem('persondata')))
})
layui.use(['element', 'laydate'], function () {
    var element = layui.element;
    var laydate = layui.laydate;

    //执行一个laydate实例
    laydate.render({
        elem: '#date' //指定元素
    });
});
layui.use('table', function () {
    var table = layui.table;

    table.render({
        elem: '#test'
        , url: baseurl + '/usergoods/userGoodsList'
        , page: false
        , method: 'post'
        , parseData: function (res) {
            // console.log(res, '2323132')
            return {
                "code": 0,
                "data": res.data
            }
        }
        , cellMinWidth: 80
        // 表格渲染
        , cols: [[
            { field: 'id', width: 80, title: 'ID', sort: true }
            , { field: 'goodsName', width: 130, title: '物品名称' }
            , { field: 'createTime', width: 200, title: '创建时间', sort: true }
            , {
                field: 'status', width: 100, title: '用户类型', templet: function (d) {
                    if (d.status == '1') {
                        return "<p style='color:#409efe'>普通用户</p>"
                    } else {
                        return "<p style='color:red'>临时用户</p>"
                    }
                }
            }
            , { field: 'updateTime', width: 200, title: '最后操作时间' }
            , { field: 'userRealname', width: 80, title: '用户名', align: 'center' }
        ]],
    });
});
// 监测用户是否填写信息
function checkPhone() {
    var realname = document.getElementById('realname').value;
    if (!realname) {
        layer.tips('请输入真实姓名!', '#realname', {
            tips: [2, '#c00']
        });
        return false;
    }
    var phone = document.getElementById('phone').value;
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
        layer.tips('请输入正确的手机号!', '#phone', {
            tips: [2, '#c00']
        });
        return false;
    }
    var userId = document.getElementById('userId').value
    var that = this
    $.ajax({
        type: 'post',
        url: baseurl + '/user/updateUser.do',
        data: {
            id: userId
        },
        success: function (suc) {
            // console.log('2555', suc)
            if (suc.success == true) {
                that.showbox = false;
                $.ajax({
                    type: 'post',
                    url: baseurl + '/user/getLoginUser',
                    success: function (suc) {
                        // 判断重新赋值
                        // console.log('00', suc.data)
                        that.imgsrc = suc.data.faceimg
                        if (suc.data.status === 1) {
                            suc.data.status = "未激活";
                        } else if (suc.data.status === 2) {
                            suc.data.status = "激活";
                        } else {
                            suc.data.status = "禁用";
                        }
                        if (suc.data.type === 1) {
                            suc.data.type = '普通用户'
                        } else {
                            suc.data.type = '临时用户'
                        }
                        layui.form.val('example1', suc.data)
                    }
                })
                layer.msg('修改成功!')
            }

        }
    })
}
// 用户修改密码表格
layui.form.on('submit(demo1)', function (data) {
    // console.log(data)
    // 判断是否填写信息
    var oZhezhao = document.getElementById('zhezhao');
    if (!data.field.oldPassword || !data.field.newPassword) {
        return false;
    }
    $.ajax({
        type: 'post',
        url: baseurl + '/user/updatePassword.do',
        data: {
            oldPassword: data.field.oldPassword,
            newPassword: data.field.newPassword
        },
        success: function (suc) {
            if (suc.status == 1) {
                layer.msg("修改成功,请重新登陆！")
                setTimeout(function () {
                    window.location.href = "./denglu.html";
                }, 1500)

            } else {
                layer.msg(suc.data)
            }
        }
    })
    return false;
});