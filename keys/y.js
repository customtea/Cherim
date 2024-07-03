function GetMode(){ return Editor.GetCookie("window", "CherimMode") };
function SetMode(str_mode){ Editor.SetCookie("window", "CherimMode", str_mode) }
function GetCommandBuffer(){ return Editor.GetCookieDefault("window", "CherimCmdBuf", "") }
function AddCommandBuffer(str_cmd){ cmd = Editor.GetCookieDefault("window", "CherimCmdBuf", ""); Editor.SetCookie("window", "CherimCmdBuf", cmd + str_cmd); }
function SetCommandBuffer(str_cmd){ Editor.SetCookie("window", "CherimCmdBuf", str_cmd) }
function is_lineend(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); var line = Editor.GetLineStr(0); return nCurColumn >= line.length -1 }
function is_linehead(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); return nCurColumn == 1 }

function yank(){
    var selmode = Editor.IsTextSelected();
    if (selmode == "0"){ return }
    var sel_string = Editor.GetSelectedString(0);
    if (selmode == "1"){ Editor.SetClipboard(0x00, sel_string); }
    if (selmode == "2"){ Editor.SetClipboard(0x02, sel_string); }
    return
}

(function(){
    mode = GetMode()
    switch(mode){
        case "i": Editor.InsText('y'); break;
        case "n": SetMode("c"); AddCommandBuffer("y"); break;
        case "v": yank(); break;
        case "c": 
            cmd = GetCommandBuffer();
            if (cmd == "y"){
                Editor.SelectLine(0);
                var sel_string = Editor.GetSelectedString(0);
                Editor.SetClipboard(0x00, sel_string);
                Editor.CancelMode();
                // Editor.MoveHistPrev();
                Editor.Up();
                // Editor.GoLineEnd(0x08);
                SetCommandBuffer("");
                SetMode("n");
            }else{
                AddCommandBuffer(char);
            }
            break;
        default: Editor.InsText('y'); break;
    }
})();
