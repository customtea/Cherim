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

var nTabSize = Editor.ChangeTabWidth( 0 );

function unindent_space(){
    if (is_linehead()){ return }
    for (var i=0; i<nTabSize; i++) {
        Editor.DeleteBack()
    }
}

function md_unindent_space(){
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	var isMarkdown = Editor.IsCurTypeExt("md");
    var line_str = Editor.GetLineStr(0);
	if (isMarkdown == "1"){	
        var match = /^ *- /.exec(line_str)
        if (match == null){ return }
        var match_cur = match.index + match[0].length
        var curdiff = nCurColumn - match_cur;
        if (curdiff < 2){
            Editor.GoLineTop();
            unindent_space();
            var ccur = match_cur + curdiff + nTabSize;
            Editor.MoveCursor(nCurLine, ccur, 0)
        }
	}
}

(function(){
    mode = GetMode()
    switch(mode){
        case "i": md_unindent_space(); break;
        case "n": break;
        case "v": break;
        default:  md_unindent_space(); break;
    }
})();



