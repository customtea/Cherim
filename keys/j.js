function GetMode(){ return Editor.GetCookie("window", "CherimMode") };
function SetMode(str_mode){ Editor.SetCookie("window", "CherimMode", str_mode) }
function GetCommandBuffer(){ return Editor.GetCookieDefault("window", "CherimCmdBuf", "") }
function AddCommandBuffer(str_cmd){ cmd = Editor.GetCookieDefault("window", "CherimCmdBuf", ""); Editor.SetCookie("window", "CherimCmdBuf", cmd + str_cmd); }
function SetCommandBuffer(str_cmd){ Editor.SetCookie("window", "CherimCmdBuf", str_cmd) }
function is_lineend(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); var line = Editor.GetLineStr(0); return nCurColumn >= line.length -1 }
function is_linehead(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); return nCurColumn == 1 }

(function(){
    mode = GetMode()
    switch(mode){
        case "i": Editor.InsText('j'); break;
        case "n": Editor.Down(); break;
        case "v": Editor.Down_Sel(); break;
        default: Editor.InsText('j'); break;
    }
})();
