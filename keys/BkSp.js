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

var expandTab = Plugin.GetOption("Char", "expandtab")
var nTabSize = Editor.ChangeTabWidth(0);

function unindent_auto(){
    if (is_linehead()){ return }
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
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	var isMarkdown = Editor.IsCurTypeExt("md");
    var line_str = Editor.GetLineStr(0);
	if (isMarkdown == "1"){	
        var match = /^[ \t]*/.exec(line_str)
        if (match == null){ Editor.DeleteBack(); }
        var match_cur = match.index + match[0].length
        var curdiff = nCurColumn - match_cur;
        if (curdiff < 2){
            unindent_auto();
        }
	}else{
        Editor.DeleteBack();
    }
}


(function(){
    mode = GetMode()
    switch(mode){
        // case "i": Editor.DeleteBack(); break;
        case "i": md_bksp_expandtab(); break;
        case "n": if(!is_linehead()){Editor.Left();}; break;
        case "c": var stext = GetCommandBuffer(); SetCommandBuffer(stext.substring(0, stext.length -1)); break;
        case "V": 
        case "v": Editor.Cut(); SetMode("n"); break;
        case "s": var stext = GetSearchBuffer(); SetSearchBuffer(stext.substring(0, stext.length -1)); break;
        default: Editor.DeleteBack(); break;
    }
    show_status();
})();

