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
var indentUnitSp = "";
for (var i=0; i<nTabSize; i++) {
    indentUnitSp += " ";
}

function indent_space(){
    Editor.InsText(indentUnitSp)
}

function md_indent_space(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
	var isMarkdown = Editor.IsCurTypeExt("md");
    var line_str = Editor.GetLineStr(0);
	if (isMarkdown == "1"){	
        var match = /^ *- /.exec(line_str)
        if (match == null){
            indent_space();
            return
        }
        var match_cur = match.index + match[0].length
        var curdiff = nCurColumn - match_cur;
        if (curdiff < 2){
            Editor.GoLineTop();
            indent_space();
            var ccur = match_cur + curdiff + nTabSize;
            Editor.MoveCursor(nCurLine, ccur, 0)
        }else{
            indent_space();
        }
	}
}

(function(){
    mode = GetMode()
    switch(mode){
        case "i": md_indent_space(); break;
        case "n": break;
        case "v": break;
        default:  md_indent_space(); break;
    }
})();


