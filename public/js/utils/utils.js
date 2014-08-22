var msgLevelConstants=["success","info","warning","danger"];
function showMsg(level, msg){
    $("#msgPanel").html(_.template($("#msgPanel").html())({level:msgLevelConstants[level], msg:msg}));
    $('html, body').animate(
        {scrollTop: 0},
        'slow',
        function(){
            $("#msgPanel").fadeIn();
        }
    );

}