$(function () {
    var askUser = setInterval(function () {
        $.ajax({
            url: baseurl + "/user/getLoginUser",
            type: "post",

            success: function (res) {
                if (res.status === "-1") {
                    $.ajax({
                        type: 'post',
                        url: baseurl + '/light//TenPercent',
                        success(res) {
                            // console.log(res)
                        }
                    })
                    window.location.href = "./denglu.html"
                }
            },
            error: function (error) {
                window.location.href = "./denglu.html"
            }
        })
    }, 600000)
});
// const dingshiqi = null;
// const redcit = function () {
//     window.location.href = "./denglu.html"
// };
// const dingshiqifangfa = function () {
//     if (!dingshiqi) {
//         window.clearTimeout(dingshiqi);
//         dingshiqi = null;
//         dingshiqi = setTimeout(redcit, 69000);
//     }
// }

// window.addEventListener('onclick', dingshiqifangfa);
// window.addEventListener('onresize', dingshiqifangfa);
// window.addEventListener('onscroll', dingshiqifangfa);
// window.addEventListener('onmouseover', dingshiqifangfa);
// window.addEventListener('onload', dingshiqifangfa);