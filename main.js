// Author="CustomTea"

function GetMode(){
    return Editor.GetCookie("document", "CherimMode")
}
function SetMode(str_mode){
    Editor.SetCookie("document", "CherimMode", str_mode);
    show_status();
}

function GetCommandBuffer(){
    return Editor.GetCookieDefault("document", "CherimCmdBuf", "")
}

function AddCommandBuffer(str_cmd){
    cmd = Editor.GetCookieDefault("document", "CherimCmdBuf", "")
    Editor.SetCookie("document", "CherimCmdBuf", cmd + str_cmd)
    show_status();
}

function SetCommandBuffer(str_cmd){
    Editor.SetCookie("document", "CherimCmdBuf", str_cmd)
}


function GetSearchBuffer(){
    return Editor.GetCookieDefault("document", "CherimSearchBuf", "")
}

function AddSearchBuffer(str_cmd){
    cmd = Editor.GetCookieDefault("document", "CherimSearchBuf", "")
    Editor.SetCookie("document", "CherimSearchBuf", cmd + str_cmd)
    show_status();
}

function SetSearchBuffer(str_cmd){
    Editor.SetCookie("document", "CherimSearchBuf", str_cmd)
}

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


function is_lineend(){
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    var line = Editor.GetLineStr(0);
    return nCurColumn >= line.length -1
}

function is_linehead(){
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    return nCurColumn == 1
}

function cursor_insert(){
    var is_ins_mode = Editor.IsInsMode()
    if (is_ins_mode == "0"){
        Editor.ChgmodINS()
    }
}

function cursor_overwrite(){
    var is_ins_mode = Editor.IsInsMode()
    if (is_ins_mode == "1"){
        Editor.ChgmodINS()
    }
}


function get_newline_code(){
    var linecode = Editor.GetLineCode();
    switch (linecode){
        case 0 : return "\r\n"
        case 1 : return "\r"
        case 2 : return "\n"
    }
}

if(!String.prototype.trim){
	String.prototype.trim = function(){
		return this.toString().replace(/^\s+|\s+$/g,'');
	};
	String.prototype.lTrim = function(){
		return this.toString().replace(/^\s+/g,'');
	};
	String.prototype.rTrim = function(){
		return this.toString().replace(/\s+$/g,'');
	};
};

var newline_code = get_newline_code();

var expandTab = Plugin.GetOption("Char", "expandtab")
var nTabSize = Editor.ChangeTabWidth( 0 );
var indentUnitSp = "";
for (var i=0; i<nTabSize; i++) {
    indentUnitSp += " ";
}

function main(char){
    mode = GetMode()

    // if (mode != "i"){ Editor.Undo(); }
    Editor.Undo();

    switch(mode){
        case "i":
            // Editor.InsText(char);
            key_insert(char);
            break;
        case "n":
            key_normal(char);
            break;
        case "c":
            AddCommandBuffer(char);
            cmd_eval();
            break;
        case "v":
        case "V":
            select_mode(char);
        case "s":
            search_mode(char);
        default:
            break;
    }
}

function get_indent(line_str){
    line_str = line_str.replace(/[\r\n]/g, "");
	line_str = line_str.replace(/\t/g, indentUnitSp);
    // line_str = line_str.replace(/[^ */]/g, "")
    var prev_indent = line_str.replace(/^( *).*$/, "$1");
    return prev_indent
}

function get_indent_size(line_str){
    var indent = get_indent(line_str);
    return indent.length
}

function indentional_cr(){
    //var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    //var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    var line_str = Editor.GetLineStr(0);
    var indent = get_indent(line_str);
    Editor.InsText(newline_code);
    Editor.InsText(indent)

	var isMarkdown = Editor.IsCurTypeExt("md");
	if (isMarkdown == "1"){	
		head_char = line_str.trim().substring(0, 1);
		if (head_char ==  "-") {
			InsText("- ")
		};
	}
}

function key_insert(char){
    switch (char){
        case "\r": indentional_cr(); break;
        case "\t": Editor.InsText(indentUnitSp);
        default: Editor.InsText(char); break;
    }
}

function indent_space(){
    Editor.InsText(indentUnitSp)
}

function unindent_space(){
    if (is_linehead()){ return }
    Editor.AddRefUndoBuffer()
    for (var i=0; i<nTabSize; i++) {
        Editor.DeleteBack()
    }
    Editor.SetUndoBuffer()
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

function md_unindent_space(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
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


function force_indent_space(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    Editor.GoLineTop();
    indent_space();
    Editor.MoveCursor(nCurLine, nCurColumn + nTabSize, 0)
}

function force_unindent_space(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    Editor.GoLineTop();
    unindent_space();
    Editor.MoveCursor(nCurLine, nCurColumn - nTabSize, 0)
}

function key_normal(char){
    switch(char){
        case "\r": break;
        case "a": if (!is_lineend()){ Editor.Right();}; SetMode("i"); break;
        case "A": Editor.GoLineEnd(0x08); SetMode("i"); break;
        case "b": Editor.WordLeft(); break;
        case "c": SetMode("c"); AddCommandBuffer("c"); break;
        case "d": SetMode("c"); AddCommandBuffer("d"); break;
        case "D": LineCutToEnd(); break;
        case "e": break;
        case "f": break;
        case "g": SetMode("c"); AddCommandBuffer("g"); break;
        //case "h": if(!is_linehead()){Editor.Left();}; break;
        case "i": SetMode("i"); break;
        case "I": Editor.GoLineTop(0x08); SetMode("i"); break;
        //case "j": Editor.Down(); break;
        //case "k": Editor.Up(); break;
        //case "l": if (!is_lineend()){Editor.Right();}; break;
        case "m": break;
        case "n": Editor.SearchNext("", 0x20); break;
        case "N": Editor.SearchPrev("", 0x20); break;
        // case "o": Editor.GoLineEnd(0x08); Editor.InsText("\r"); break;
        case "o": Editor.GoLineEnd(0x08); indentional_cr(); SetMode("i"); break;
        case "O": Editor.GoLineTop(0x08); Editor.InsText(newline_code); Editor.Up(); SetMode("i"); break;
        // case "p": var clip = GetClipboard(0); Editor.InsText(clip); break;
        case "p": Editor.Paste(); break;
        case "q": break;
        case "r": break;
        case "s": break;
        case "t": break;
        case "u": Editor.Undo(); break;
        case "v": SetMode("v"); Editor.BeginSelect(); break;
        case "V": SetMode("V"); select_line(); break;
        //case "V": SetMode("v"); Editor.BeginBoxSelect(); break;
        case "w": Editor.WordRight(); break;
        case "x": Editor.Delete(); break;
        // case "y": SetMode("c"); AddCommandBuffer("y"); break;
        case "z": SetMode("c"); AddCommandBuffer("z"); break;
        case ":": SetMode("c"); AddCommandBuffer(":"); break;
        case "/": SetSearchBuffer(""); SetMode("s"); break;
        case "0": SetMode("c"); AddCommandBuffer("0"); break;
        case "1": SetMode("c"); AddCommandBuffer("1"); break;
        case "2": SetMode("c"); AddCommandBuffer("2"); break;
        case "3": SetMode("c"); AddCommandBuffer("3"); break;
        case "4": SetMode("c"); AddCommandBuffer("4"); break;
        case "5": SetMode("c"); AddCommandBuffer("5"); break;
        case "6": SetMode("c"); AddCommandBuffer("6"); break;
        case "7": SetMode("c"); AddCommandBuffer("7"); break;
        case "8": SetMode("c"); AddCommandBuffer("8"); break;
        case "9": SetMode("c"); AddCommandBuffer("9"); break;
        //case ">": force_indent_space(); break;
        //case "<": force_unindent_space(); break;
        default:
            //Editor.InfoMsg(char)
            //Editor.InfoMsg(char.charCodeAt(0))
            break;
    }
}

function select_mode(char){
    switch(char){
        // case "h": if(!is_linehead()){Editor.Left_Sel();}; break;
        // case "j": Editor.Down_Sel(); break;
        // case "k": Editor.Up_Sel(); break;
        // case "l": if (!is_lineend()){Editor.Right_Sel();}; break;
        case "V" :
        case "v" : CancelMode(); SetMode("n"); break;
        case "y" : yank(); SetMode("n"); break;
        //case ">" : Editor.IndentTab(); SetMode("n"); break;
        //case "<" : Editor.UnindentTab(); SetMode("n"); break;
    }
}

function select_line(){
    text = Editor.GetLineStr(0)
    if (text.length == 0){
        SetMode("n")
        return
    }
    Editor.GoLineTop(0x09)
    Editor.GoLineEnd_Sel(0x08)
    Editor.SetCookie("document", "SelectLine", "N");

}

function select_line_up(){
    var direct = Editor.GetCookie("document", "SelectLine")
    switch (direct){
        case "N":
            CancelMode(); Editor.GoLineEnd_Sel(0x08);
            Editor.SetCookie("document", "SelectLine", "U");
        case "U":
            Editor.Up_Sel(); Editor.GoLineTop_Sel(0x09);
            break;
        default:
            Editor.Up_Sel(); Editor.GoLineEnd_Sel(0x08);
    }
}

function search_mode(char){
    switch(char){
        case "\r":
            var stext = GetSearchBuffer();
            Editor.SearchNext(stext, 0x20)
            SetMode("n");
            break;
        default:
            AddSearchBuffer(char);
            show_status();
            break;
    }
}


/*
function yank(){
    var selmode = Editor.IsTextSelected();
    if (selmode == "0"){ return }
    var sel_string = Editor.GetSelectedString(0);
    if (selmode == "1"){ Editor.SetClipboard(0x00, sel_string); }
    if (selmode == "2"){ Editor.SetClipboard(0x02, sel_string); }
    return
}
*/

function move_cur_line_head(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var line_str = Editor.GetLineStr(0);
    var r = /^ */.exec(line_str)
    var ccur = r.index + r[0].length + 1
    Editor.MoveCursor(nCurLine, ccur, 0)
}

function cmd_eval(){
    cmd = GetCommandBuffer();
    var cnum = /^[0-9][0-9]*/.exec(cmd)
    if (cnum != null){ cnum = parseInt(cnum) }
    switch(cmd){
        case "gg":
        case /^[0-9]*gg/.test(cmd) && cmd:
            if (cnum == null){
                Editor.GoFileTop();
            }else{
                Editor.MoveCursor(cnum, 1, 0)
                move_cur_line_head();
            }
            SetCommandBuffer("");
            SetMode("n");
            break;

        case "dd":
        case /^[0-9]*dd/.test(cmd) && cmd:
            if (cnum == null){
                Editor.CutLine();
            }else{
                Editor.AddRefUndoBuffer()
                for (var i=0; i<cnum; i++) {
                    Editor.CutLine();
                }
                Editor.SetUndoBuffer()
            }
            SetCommandBuffer("");
            SetMode("n");
            break;

        case "dw":
        case /^[0-9]*dw/.test(cmd) && cmd:
            if (cnum == null){
                Editor.WordCut();
            }else{
                Editor.AddRefUndoBuffer()
                for (var i=0; i<cnum; i++) {
                    Editor.WordCut();
                }
                Editor.SetUndoBuffer()
            }
            SetCommandBuffer("");
            SetMode("n");
            break;
        
        case /^[0-9]*p/.test(cmd) && cmd:
            Editor.AddRefUndoBuffer()
            for (var i=0; i<cnum; i++) {
                Editor.Paste();
            }
            Editor.SetUndoBuffer()
            SetCommandBuffer("");
            SetMode("n");
            break;

        case "zz":
            Editor.CurLineCenter();
            SetCommandBuffer("");
            SetMode("n");
            break;
        
        case "cw":
            Editor.WordDeleteToEnd();
            SetCommandBuffer("");
            SetMode("i");
            break;
        
        case ":w\r":
            Editor.FileSave();
            SetCommandBuffer("");
            SetMode("n");
            break;
        
        case ":wq\r":
            Editor.FileSave();
            Editor.WinClose();
            break;

        case ":q\r":
            Editor.WinClose();
            break;
        
        case ":sp":
            Editor.SplitWinV()
            SetCommandBuffer("");
            SetMode("n");
            break;
        
        case ":vsp":
            Editor.SplitWinH()
            SetCommandBuffer("");
            SetMode("n");
            break;
        
        case "0\r":
            Editor.GoLineTop(0x09);
            SetCommandBuffer("");
            SetMode("n");
            break;

        case "$\r":
            Editor.GoLineEnd(0x08);
            SetCommandBuffer("");
            SetMode("n");
            break;


        /*
        case "y":
            Editor.SelectLine(0);
            var sel_string = Editor.GetSelectedString(0);
            Editor.SetClipboard(0x02, sel_string);
            SetCommandBuffer("");
            SetMode("n");
            break;
        */
        default:
            return;
    }
}


(function(){
    Editor.CommitUndoBuffer();
    var key = Indent.GetChar();
    //Editor.DeleteBack();
    //Editor.Undo();
    main(key)
})();
