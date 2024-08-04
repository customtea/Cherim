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

function md_unindent(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	var isMarkdown = Editor.IsCurTypeExt("md");
    var line_str = Editor.GetLineStr(0);
	if (isMarkdown == "1"){	
        var match = /^[ \t]*- /.exec(line_str)
        if (match == null){ return }
        var match_cur = match.index + match[0].length
        var curdiff = nCurColumn - match_cur;
        if (curdiff < 2){
            Editor.GoLineTop();
            unindent_auto();
            if (expandTab == "1"){
                var ccur = match_cur + curdiff + nTabSize;
            }else{
                var ccur = match_cur + curdiff + 1;
            }
            Editor.MoveCursor(nCurLine, ccur, 0)
        }
	}
}

function move_cur_untab(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    var ccur = nCurColumn - nTabSize
    Editor.MoveCursor(nCurLine, ccur, 0)
}

(function(){
    mode = GetMode()
    switch(mode){
        case "i": md_unindent(); break;
        case "n": move_cur_untab(); break;
        case "V": break;
        case "v": break;
        case "s": break;
        default:  Editor.UnindentTab(); break;
    }
})();



