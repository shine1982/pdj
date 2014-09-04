var msgLevelConstants=["success","info","warning","danger"];
function showMsg(level, msg){
    $("#msgPanel").html(_.template($("#msgPanel").html())({level:msgLevelConstants[level], msg:msg}));
    $('html, body').animate(
        {scrollTop: 0},
        'fast',
        function(){
            $("#msgPanel").fadeIn();
        }
    );
}

//for traitement photo
function getResizedImageBase64Data(img){
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 1024;
    var MAX_HEIGHT = 768;
    var width = img.width;
    var height = img.height;

    if (width > height) {
        if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
        }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    var dataurl = canvas.toDataURL("image/jpeg");
    return dataurl.substring(23);
}