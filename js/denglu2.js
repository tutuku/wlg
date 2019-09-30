layui.use('upload', function () {
    var $ = layui.jquery,
        upload = layui.upload;
    var uploadInst = upload.render({
        elem: '#test1',
        before: function (obj) {
            obj.preview(function (index, file, result) {
                $('#demo1').attr('src', result); 
            });
        },
        done: function (res) {
            if (res.code > 0) {
                return layer.msg('上传失败');
            }
        },
        error: function () {
            var demoText = $('#demoText');
            demoText.html(
                '<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>'
            );
            demoText.find('.demo-reload').on('click', function () {
                uploadInst.upload();
            });
        }
    });
})