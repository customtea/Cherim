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
var indentUnitSp = "";
for (var i=0; i<nTabSize; i++) {
    indentUnitSp += " ";
}

function indent_auto(){
    if (expandTab == "1"){
        Editor.InsText(indentUnitSp)
    }else{
        Editor.InsText("\t")
    }
}

function force_indent_space(){
    var nCurLine = parseInt(Editor.ExpandParameter("$y"));
    var nCurColumn = parseInt(Editor.ExpandParameter("$x"));
    Editor.GoLineTop();
    indent_auto();
    Editor.MoveCursor(nCurLine, nCurColumn + nTabSize, 0)
}

(function(){
    var key = ">"
    mode = GetMode()
    switch(mode){
        case "i": Editor.InsText(key); break;
        case "n": force_indent_space(); break;
        case "V": 
        case "v": Editor.IndentTab(); SetMode("n"); break;
        case "s": AddSearchBuffer(key); break;
        default: Editor.InsText(key); break;
    }
    show_status();
})();

