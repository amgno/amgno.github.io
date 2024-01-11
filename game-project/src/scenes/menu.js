let menubackground;
let txt;
let txt2;
let txt3;
let selection = 0;

function preload(s) {
    menubackground = PP.assets.image.load(s, "assets/images/menu.png");

}
function create(s) {
    PP.assets.image.add(s, menubackground, 0, 0, 0, 0);
    txt = PP.shapes.text_styled_add(s, 110, 40, "STORIA", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
    txt2 = PP.shapes.text_styled_add(s, 114, 100, "CREDITI", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
    txt3 = PP.shapes.text_styled_add(s, 93, 160, "GIOCA", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);

}


// function select(s){
//     console.log(selection);
//     if (selection = 0){
//         PP.shapes.destroy(txt);
//         txt = PP.shapes.text_styled_add(s, 110, 40, "STORIA", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
//         selection = selection+1;
//     } else if (selection = 1){
//         PP.shapes.destroy(txt);
//         txt = PP.shapes.text_styled_add(s, 110, 40, "STORIA", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
//         PP.shapes.destroy(txt2);
//         txt2 = PP.shapes.text_styled_add(s,114, 100,  "CREDITI", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
//         selection = selection +1;
//     } else {
//         PP.shapes.destroy(txt2);
//         txt2 = PP.shapes.text_styled_add(s, 110, 40, "CREDITI", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
//         PP.shapes.destroy(txt3);
//         txt3 = PP.shapes.text_styled_add(s,93, 160,  "GIOCA", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
//         selection = 0;
//     }
// }

let selectionpress = 0;

function select(s) {
    // console.log(selection);
    if (selection === 0) {
        PP.shapes.destroy(txt);
        txt = PP.shapes.text_styled_add(s, 110, 40, "STORIA", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
        PP.shapes.destroy(txt3);
        txt3 = PP.shapes.text_styled_add(s, 93, 160, "GIOCA", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
        selection = selection + 1;
        selectionpress = 1;
    } else if (selection === 1) {
        PP.shapes.destroy(txt);
        txt = PP.shapes.text_styled_add(s, 110, 40, "STORIA", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
        PP.shapes.destroy(txt2);
        txt2 = PP.shapes.text_styled_add(s, 114, 100, "CREDITI", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
        selection = selection + 1;
        selectionpress = 2;
    } else {
        PP.shapes.destroy(txt2);
        txt2 = PP.shapes.text_styled_add(s, 114, 100, "CREDITI", 60, "Helvetica Neue Condensed Black", "normal", "0xFFFFFF", null);
        PP.shapes.destroy(txt3);
        txt3 = PP.shapes.text_styled_add(s, 93, 160, "GIOCA", 60, "Helvetica Neue Condensed Black", "normal", "0x000000", null);
        selection = 0;
        selectionpress = 3;
    }
}


var isSelectFunctionCalled = false;
let popuptxt;


function update(s) {

    function test(s) {
        PP.scenes.start("storia")
        PP.scenes.stop("menu");
    };

    function test2(s) {
        PP.scenes.start("storia")
        PP.scenes.stop("menu");
    };

    function test3(s) {
        PP.scenes.start("scene1")
        PP.scenes.stop("menu");
    };

    PP.interactive.mouse.add(txt, "pointerdown", test);
    PP.interactive.mouse.add(txt2, "pointerdown", test2);
    PP.interactive.mouse.add(txt3, "pointerdown", test3);



    if (PP.interactive.kb.is_key_down(s, PP.key_codes.S) && !isSelectFunctionCalled) {
        select(s);
        isSelectFunctionCalled = true;
    } else if (!PP.interactive.kb.is_key_down(s, PP.key_codes.S)) {
        isSelectFunctionCalled = false;
    }

    if (PP.interactive.kb.is_key_down(s, PP.key_codes.SPACE)) {
        if (selectionpress === 0) {
            // console.log("");
        } else if (selectionpress === 1) {
            selection = 0;
            PP.scenes.start("storia");
        } else if (selectionpress === 2) {
            selection = 0;
        } else {
            selection = 0;
            PP.scenes.start("scene1");
        }
    }

}
function destroy(s) {

}




PP.scenes.add("menu", preload, create, update, destroy);
