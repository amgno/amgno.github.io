let img_background;
let player;
let ss_player;
let floor;
let background;
let isnoclip = false;



let testcamera;



function preload(s) {
    img_background = PP.assets.image.load(s, "assets/images/background.png");
    // ss_player = PP.assets.sprite.load_spritesheet(s, "assets/", 223, 190);
    ss_player = PP.assets.sprite.load_spritesheet(s, "assets/images/spritesheet_player.png", 100, 150);
    // preload_platforms(s);
    preload_mushrooms(s);
    preload_rain(s);
};


function create(s) {
    background = PP.assets.tilesprite.add(s, img_background, 0, -4400, 1280, 5000, 0, 0);
    background.tile_geometry.flip_y = 1;

    // background = PP.assets.image.add(s, img_background, 0 , 0, 0, 0);
    player = PP.assets.sprite.add(s, ss_player, 150, 220, 0.5, 1);


    floor = PP.shapes.rectangle_add(s, 640, 620, 1280, 1, "0x000000", 0);
    PP.physics.add(s, player, PP.physics.type.DYNAMIC);
    PP.physics.add(s, floor, PP.physics.type.STATIC);

    PP.physics.add_collider(s, player, floor);

    // create_platforms(s, player);
    configure_player_animation(s, player);

    testcamera = PP.shapes.rectangle_add(s, 641, 230, 1, 1, "0xFFFFFF", 1);
    PP.camera.start_follow(s, testcamera, 0, 0);
    PP.physics.add(s, testcamera, PP.physics.type.DYNAMIC);  
    PP.physics.set_allow_gravity(testcamera, false);

    create_mushrooms(s, player);

    create_rain(s, player);


    // configure_player_animation(s, player);v
};


function update(s) {

    PP.physics.set_velocity_y(testcamera, -110);


    // update_platforms(s, player);

    PP.physics.set_allow_gravity(player, true);

    if(isnoclip){
        PP.physics.set_velocity_y(testcamera, 0);
    } 
    

    if (PP.interactive.kb.is_key_down(s, PP.key_codes.P)) {
        isnoclip = true;
        noclip(s, player, testcamera);

    } else {
        isnoclip = false;
        manage_player_update(s, player);
    }


    background.tile_geometry.y = PP.camera.get_scroll_y(s) * 0.05;

};


function destroy(s) {


};




PP.scenes.add("scene1", preload, create, update, destroy);






