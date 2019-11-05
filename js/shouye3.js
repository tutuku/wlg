var recorder;
var imgsrc = document.getElementById("changePic");
var audio = document.querySelector('audio');
function startRecording() {
    HZRecorder.get(function (rec) {
        recorder = rec;
        recorder.start();
    }, {
        sampleBits: 16,
        sampleRate: 16000
    });

    imgsrc.src = "./image/d-1.gif"
}
function stopRecording() {
    imgsrc.src = "./image/voice.png"
    recorder.stop();
    var blob = recorder.getBlob();
    // console.log(blob);
    var url = URL.createObjectURL(blob);
    var div = document.createElement('div');
    var au = document.createElement('audio');
    var hf = document.createElement('a');
    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    let formdata = new FormData();
    formdata.append("file", blob);
    // console.log(blob)
    $.ajax({
        url: baseurl + '/newGoods/findGoodsByVoice',
        type: 'post',
        processData: false,
        contentType: false,
        timeout: 10000,
        async: true,
        data: formdata,
        success: function (res) {
            // console.log(res)
        }
    })
}
function playRecording() {
    recorder.play(audio);
}