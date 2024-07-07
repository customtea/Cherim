function GetMode(){ return Editor.GetCookie("document", "CherimMode") }
function GetCommandBuffer(){ return Editor.GetCookieDefault("document", "CherimCmdBuf", "") }
function GetSearchBuffer(){ return Editor.GetCookieDefault("document", "CherimSearchBuf", "") }


(function(){
    var mode = GetMode();
    var cbuf = GetCommandBuffer();
    var sbuf = GetSearchBuffer();
    Editor.InfoMsg("Mode: " + mode + ", CmdBuf: " + cbuf + ",Search: " + sbuf)
})();
