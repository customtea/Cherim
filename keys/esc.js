function GetMode(){ return Editor.GetCookie("document", "CherimMode") };
function SetMode(str_mode){ Editor.SetCookie("document", "CherimMode", str_mode); show_status(); }
function GetCommandBuffer(){ return Editor.GetCookieDefault("document", "CherimCmdBuf", "") }
function AddCommandBuffer(str_cmd){ cmd = Editor.GetCookieDefault("document", "CherimCmdBuf", ""); Editor.SetCookie("document", "CherimCmdBuf", cmd + str_cmd); }
function SetCommandBuffer(str_cmd){ Editor.SetCookie("document", "CherimCmdBuf", str_cmd) }
function is_lineend(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); var line = Editor.GetLineStr(0); return nCurColumn >= line.length -1 }
function is_linehead(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); return nCurColumn == 1 }
function show_status(){
    var mode = GetMode();
    switch (mode){
        case "i": Editor.StatusMsg("Insert"); break;
        case "n": Editor.StatusMsg("Normal"); break;
        case "c": var cmd = GetCommandBuffer(); Editor.StatusMsg(cmd); break;
        case "v": Editor.StatusMsg("Visual"); break;
    }
}

(function(){
    mode = GetMode()
    switch(mode){
        case "i": SetMode("n"); break;
        case "n": break;
        case "c": SetMode("n"); SetCommandBuffer(""); break;
        case "v": CancelMode(); SetMode("n"); break;
        default: CancelMode(); break;
    }
})();

