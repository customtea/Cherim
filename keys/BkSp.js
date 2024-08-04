function GetMode(){ return Editor.GetCookie("document", "CherimMode") };
function SetMode(str_mode){ Editor.SetCookie("document", "CherimMode", str_mode); show_status(); }
function GetCommandBuffer(){ return Editor.GetCookieDefault("document", "CherimCmdBuf", "") }
function AddCommandBuffer(str_cmd){ cmd = Editor.GetCookieDefault("document", "CherimCmdBuf", ""); Editor.SetCookie("document", "CherimCmdBuf", cmd + str_cmd); }
function SetCommandBuffer(str_cmd){ Editor.SetCookie("document", "CherimCmdBuf", str_cmd) }
function GetSearchBuffer(){ return Editor.GetCookieDefault("document", "CherimSearchBuf", "") }
function AddSearchBuffer(str_cmd){ cmd = Editor.GetCookieDefault("document", "CherimSearchBuf", ""); Editor.SetCookie("document", "CherimSearchBuf", cmd + str_cmd); show_status(); }
function SetSearchBuffer(str_cmd){ Editor.SetCookie("document", "CherimSearchBuf", str_cmd) }
function ischeck_lineend(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); var line = Editor.GetLineStr(0); return nCurColumn >= line.length -1 }
function ischeck_linehead(){ var nCurColumn = parseInt(Editor.ExpandParameter("$x")); return nCurColumn == 1 }
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

var expandTab = Plugin.GetOption("Char", "expandtab")
var nTabSize = Editor.ChangeTabWidth(0);
var indentUnitSp = "";
for (var i=0; i<nTabSize; i++) {
    indentUnitSp += " ";
}

function unindent_auto(){
    if (ischeck_linehead()){ return }
    Editor.AddRefUndoBuffer()
    if (expandTab == "1"){
        for (var i=0; i<nTabSize; i++) {
            Editor.DeleteBack()
        }
    }else{
        Editor.DeleteBack()
    }
    Editor.SetUndoBuffer()
}

function md_bksp_expandtab(){
	var isMarkdown = Editor.IsCurTypeExt("md");
	if (isMarkdown == "1"){
        Editor.AddRefUndoBuffer()
        var nCurLine = parseInt(Editor.ExpandParameter("$y"));
        var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
        var line_str = Editor.GetLineStr(0);
        var char = line_str.substring(nCurColumn-2, nCurColumn-1)
        // Editor.InfoMsg(char)
        // Editor.InfoMsg(char.charCodeAt(0))
        switch (char){
            case (char.charCodeAt(0) == 32) && char:
                var text = line_str.substring(nCurColumn-nTabSize, nCurColumn-1)
                if (text == indentUnitSp){ Editor.DeleteBack(); return }
                for (var i=0; i<nTabSize-1; i++) {
                    Editor.DeleteBack()
                }
                break
            case "\t" : 
            default: Editor.DeleteBack(); break;
        }
        Editor.SetUndoBuffer()
	}else{
        Editor.DeleteBack();
    }
}


(function(){
    mode = GetMode()
    switch(mode){
        // case "i": Editor.DeleteBack(); break;
        case "i": md_bksp_expandtab(); break;
        case "n": if(!ischeck_linehead()){Editor.Left();}; break;
        case "c": var stext = GetCommandBuffer(); SetCommandBuffer(stext.substring(0, stext.length -1)); break;
        case "V": 
        case "v": Editor.Cut(); SetMode("n"); break;
        case "s": var stext = GetSearchBuffer(); SetSearchBuffer(stext.substring(0, stext.length -1)); break;
        default: Editor.DeleteBack(); break;
    }
    show_status();
})();

