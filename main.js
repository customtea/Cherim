function GetMode(){
    return Editor.GetCookie("window", "CherimMode")
}
function SetMode(str_mode){
    Editor.SetCookie("window", "CherimMode", str_mode)
}

function GetCommandBuffer(){
    return Editor.GetCookieDefault("window", "CherimCmdBuf", "")
}

function AddCommandBuffer(str_cmd){
    cmd = Editor.GetCookieDefault("window", "CherimCmdBuf", "")
    Editor.SetCookie("window", "CherimCmdBuf", cmd + str_cmd)
}

function SetCommandBuffer(str_cmd){
    Editor.SetCookie("window", "CherimCmdBuf", str_cmd)
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
            cmd_eval(char);
            break;
        case "v":
            select_mode(char);

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
    Editor.InsText("\r");
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
    for (var i=0; i<nTabSize; i++) {
        Editor.DeleteBack()
    }
}

function md_indent_space(){
    var line_str = editor.getlinestr(0);
	var ismarkdown = editor.iscurtypeext("md");
	if (ismarkdown == "1"){	
		head_char = line_str.trim().substring(0, 1);
		if (head_char ==  "-") {
            editor.golinetop();
            indent_space();
		};
	}
}

function md_unindent_space(){
    var line_str = editor.getlinestr(0);
	var ismarkdown = editor.iscurtypeext("md");
	if (ismarkdown == "1"){	
		head_char = line_str.trim().substring(0, 1);
		if (head_char ==  "-") {
            editor.golinetop();
            unindent_space();
		};
	}
}

function key_normal(char){
    switch(char){
        case "\r": break;
        case "a": if (!is_lineend()){ Editor.Right();}; SetMode("i"); break;
        case "A": Editor.GoLineEnd(0x08); SetMode("i"); break;
        case "b": Editor.WordLeft(); break;
        case "c": break;
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
        case "n": break;
        // case "o": Editor.GoLineEnd(0x08); Editor.InsText("\r"); break;
        case "o": Editor.GoLineEnd(0x08); indentional_cr(); SetMode("i"); break;
        case "O": Editor.GoLineTop(0x08); Editor.InsText("\r");Editor.Up(); SetMode("i"); break;
        case "p": var clip = GetClipboard(0); Editor.InsText(clip); break;
        case "q": break;
        case "r": break;
        case "s": break;
        case "t": break;
        case "u": Editor.Undo(); break;
        case "v": SetMode("v"); Editor.BeginSelect(); break;
        case "V": SetMode("v"); Editor.BeginBoxSelect(); break;
        case "w": Editor.WordRight(); break;
        case "x": Editor.Delete(); break;
        // case "y": SetMode("c"); AddCommandBuffer("y"); break;
        case "z": break;
        case ":": editor_cmd(); break;
        case "/": break;
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
        case ">": indent_space(); break;
        case "<": unindent_space(); break;
        default:
            //Editor.InfoMsg(char)
            Editor.InfoMsg(char.charCodeAt(0))
            break;
    }
}

function select_mode(char){
    switch(char){
        // case "h": if(!is_linehead()){Editor.Left_Sel();}; break;
        // case "j": Editor.Down_Sel(); break;
        // case "k": Editor.Up_Sel(); break;
        // case "l": if (!is_lineend()){Editor.Right_Sel();}; break;
        case "y" : yank(); SetMode("n"); break;
        case ">": Editor.IndentSpace(); SetMode("n"); break;
        case "<": Editor.UnindentSpace(); SetMode("n"); break;
    }
}


function editor_cmd(){
    cmd = Editor.InputBox("CMD", "", 100);
    switch (cmd){
        case "w": Editor.FileSave(); break;
        case "wq": Editor.FileSave(); Editor.WinClose(); break;
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
function cmd_eval(char){
    cmd = GetCommandBuffer();
    switch(char){
        case "g":
            if (cmd == "g"){
                Editor.GoFileTop();
                SetCommandBuffer("");
                SetMode("n");
            }else{
                AddCommandBuffer(char);
            }
            break;
        case "d":
            if (cmd == "d"){
                Editor.CutLine();
                SetCommandBuffer("");
                SetMode("n");
            }else{
                AddCommandBuffer(char);
            }
            break;
        case "w":
            if (cmd == "d"){
                Editor.WordDelete();
                SetCommandBuffer("");
                SetMode("n");
            }else{
                AddCommandBuffer(char);
            }
            break;
        /*
        case "y":
            if (cmd == "y"){
                Editor.SelectLine(0);
                var sel_string = Editor.GetSelectedString(0);
                Editor.SetClipboard(0x02, sel_string);
                SetCommandBuffer("");
                SetMode("n");
            }else{
                AddCommandBuffer(char);
            }
            break;
        */
    }
}

(function(){
    Editor.CommitUndoBuffer();
    var key = Indent.GetChar();
    //Editor.DeleteBack();
    //Editor.Undo();
    main(key)
})();
