function GetMode(){ return Editor.GetCookie("document", "CherimMode") };
function SetMode(str_mode){ Editor.SetCookie("document", "CherimMode", str_mode); show_status(); }
function GetCommandBuffer(){ return Editor.GetCookieDefault("document", "CherimCmdBuf", "") }
function AddCommandBuffer(str_cmd){ cmd = Editor.GetCookieDefault("document", "CherimCmdBuf", ""); Editor.SetCookie("document", "CherimCmdBuf", cmd + str_cmd); }
function SetCommandBuffer(str_cmd){ Editor.SetCookie("document", "CherimCmdBuf", str_cmd) }
function GetSearchBuffer(){ return Editor.GetCookieDefault("document", "CherimSearchBuf", "") }
function AddSearchBuffer(str_cmd){ cmd = Editor.GetCookieDefault("document", "CherimSearchBuf", ""); Editor.SetCookie("document", "CherimSearchBuf", cmd + str_cmd); show_status(); }
function SetSearchBuffer(str_cmd){ Editor.SetCookie("document", "CherimSearchBuf", str_cmd) }
function is_lineend(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); var line = Editor.GetLineStr(0); return nCurColumn >= line.length -1 }
function is_linehead(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); return nCurColumn == 1 }
function show_status(){
    var mode = GetMode();
    switch (mode){
        case "i": Editor.StatusMsg("Insert"); break;
        case "n": Editor.StatusMsg("Normal"); break;
        case "c": var cmd = GetCommandBuffer(); Editor.StatusMsg(cmd); break;
        case "V":
        case "v": Editor.StatusMsg("Visual"); break;
        case "s": var sbuf = GetSearchBuffer(); Editor.StatusMsg("/" + sbuf); break;
    }
}


(function(){
    var key = "d"
    mode = GetMode()
    switch(mode){
        case "i": Editor.InsText(key); break;
        case "n": SetMode("c"); AddCommandBuffer("d"); break;
        case "c": AddCommandBuffer("d"); cmd_eval(); break;
        case "V": 
        case "v": Editor.Cut(); SetMode("n"); break;
        case "s": AddSearchBuffer(key); break;
        default: Editor.InsText(key); break;
    }
    show_status();
})();

function cmd_eval(){
    cmd = GetCommandBuffer();
    var cnum = /^[0-9][0-9]*/.exec(cmd)
    if (cnum != null){ cnum = parseInt(cnum) }
    switch(cmd){
        case "dd":
        case /^[0-9]*dd/.test(cmd) && cmd:
            if (cnum == null){
                Editor.CutLine();
            }else{
                Editor.GoLineTop(0x09)
                Editor.GoLineEnd_Sel(0x08)
                Editor.AddRefUndoBuffer()
                for (var i=0; i<cnum; i++) {
                    Editor.Down_Sel();
                }
                Editor.GoLineEnd_Sel(0x08);
                Editor.Cut();
                Editor.SetUndoBuffer()
            }
            SetCommandBuffer("");
            SetMode("n");
            break;

        default:
            return;
    }
}
