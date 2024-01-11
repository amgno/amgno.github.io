// 



let img_background;
let player;
let ss_player;
let floor;
let background;
let isnoclip = false;
let txt_score;
let vecchia;



let testcamera;
function collision(s, player, platform){
    // console.log("a")
    if(player.geometry.y <= platform.geometry.y){
        player.is_on_platform = true;
        }
}


function preload(s) {
    img_background = PP.assets.image.load(s, "assets/images/background.png");
    // ss_player = PP.assets.sprite.load_spritesheet(s, "assets/", 223, 190);
    ss_player = PP.assets.sprite.load_spritesheet(s, "assets/images/sprite.png", 82.5, 165);
    // preload_platforms(s);
    vecchia = PP.assets.image.load(s, "assets/images/vecchia.png")
    preload_mushrooms(s);
    preload_rain(s);
};



function create(s) {
    PP.gameState.set_variable("vita", 0);
    // background = PP.assets.tilesprite.add(s, img_background, 0, -4520, 2280, 5300, 0, 0);
    background = PP.assets.image.add(s, img_background, 0, -4540, 0, 0);

    PP.assets.image.add(s, vecchia, 70, 460, 0,0);

    
    background.tile_geometry.flip_y = 1;

    // background = PP.assets.image.add(s, img_background, 0 , 0, 0, 0);
    player = PP.assets.sprite.add(s, ss_player, 390, 600, 0.5, 1);


    floor = PP.shapes.rectangle_add(s, 1040, 640, 3080, 1, "0x000000", 0);
    PP.physics.add(s, player, PP.physics.type.DYNAMIC);
    PP.physics.add(s, floor, PP.physics.type.STATIC);

    PP.physics.add_collider_f(s, player, floor, collision);

    // create_platforms(s, player);
    configure_player_animation(s, player);

    // testcamera = PP.shapes.rectangle_add(s, 641, 230, 1, 1, "0xFFFFFF", 1);
    // PP.camera.start_follow(s, testcamera, 0, 0);
    // PP.physics.add(s, testcamera, PP.physics.type.DYNAMIC);
    // PP.physics.set_allow_gravity(testcamera, false);

    create_mushrooms(s, player);

    create_rain(s, player);


    let colliderl = PP.shapes.rectangle_add(s, 290, 300, 1, 2000, "0xABCDEF", 0)
    PP.physics.add(s, colliderl, PP.physics.type.STATIC);
    PP.physics.add_collider(s, player, colliderl);

    let colliderr = PP.shapes.rectangle_add(s, 2520, 300, 1, 600, "0xABCDEF", 1)
    PP.physics.add(s, colliderr, PP.physics.type.STATIC);
    PP.physics.add_collider(s, player, colliderr);

    txt_score = PP.shapes.text_styled_add(s, 100, 100, "X X X", 30, "Helvetica", "normal", "0xFFFFFF", null);
    txt_score.tile_geometry.scroll_factor_x = 0;
    txt_score.tile_geometry.scroll_factor_y = 0;




    // configure_player_animation(s, player);v
};


function update(s) {

    

    PP.camera.start_follow(s, player, -320, 300);
    // if(PP.camera.geometry.x > 900){
    //     PP.camera.geometry.x = 200;
    // }
    // PP.txt_score.start_follow(s, player, -320, 100);

    // PP.physics.set_velocity_y(testcamera, -110);


    // update_platforms(s, player);

    PP.physics.set_allow_gravity(player, true);

    if (isnoclip) {
        PP.physics.set_velocity_y(testcamera, 0);
    }


    if (PP.interactive.kb.is_key_down(s, PP.key_codes.P)) {
        isnoclip = true;
        noclip(s, player, testcamera);

    } else {
        isnoclip = false;
        manage_player_update(s, player);
    }


    if (PP.interactive.kb.is_key_down(s, PP.key_codes.B)){
        // console.log("x:"+player.geometry.x)
    }


    background.tile_geometry.y = PP.camera.get_scroll_y(s) * 0.05;

    // console.log(player.geometry.y);
    if (player.geometry.y <= -4182) {
        PP.scenes.start("scene2");
    }
    
    if (PP.interactive.kb.is_key_down(s, PP.key_codes.L)) {
        PP.scenes.start("scene2");
    }

    if (PP.interactive.kb.is_key_down(s, PP.key_codes.K)) {
        PP.scenes.start("scene3");
    }

};


function destroy(s) {


};




PP.scenes.add("scene1", preload, create, update, destroy);






