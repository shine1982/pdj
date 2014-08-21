var msgLevelConstants=["success","info","warning","danger"];
function showMsg(level, msg){
    $("#msgPanel").html(_.template($("#msgPanel").html())({level:msgLevelConstants[level], msg:msg}));
    $("#msgPanel").fadeIn();
}