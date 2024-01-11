let tavola1;
let tavola2;
let tavola3;
let tavola = 0;

function preload(s){
    tavola1 = PP.assets.image.load(s, "assets/images/storia/spritetavola_1.png");
    tavola2 = PP.assets.image.load(s, "assets/images/storia/spritetavola_2.png");
    tavola3 = PP.assets.image.load(s, "assets/images/storia/spritetavola_3.png");
}


function create(s){
    // PP.assets.image.add(s, tavola3, 0, 0, 0, 0);
    // PP.assets.image.add(s, tavola2, 0, 0, 0, 0);
    PP.assets.image.add(s, tavola1, 0, 0, 0, 0);
}

function next(s){
    if (tavola === 0){
        // console.log("wow")
    }
    if (tavola === 1){
    PP.assets.image.add(s, tavola2, 0, 0, 0, 0);
}
    else if (tavola === 2) {
        PP.assets.image.add(s, tavola3, 0, 0, 0, 0);
    }
    else {
        tavola = 0;
        PP.scenes.start("menu");
    }
}

var isSelectFunctionCalled = false;
function update(s){

    // console.log(tavola);
    if (PP.interactive.kb.is_key_down(s, PP.key_codes.SPACE) && !isSelectFunctionCalled) {
        tavola=tavola+1;
        next(s);
        isSelectFunctionCalled = true;
    } else if (!PP.interactive.kb.is_key_down(s, PP.key_codes.SPACE)) {
        isSelectFunctionCalled = false;
    }  
}
function destroy(s){}


PP.scenes.add("storia", preload, create, update, destroy);