let img_background;
let player;
let ss_player;
let floor;
let background



function preload(s) {
    img_background = PP.assets.image.load(s, "assets/images/background1.png");
    // ss_player = PP.assets.sprite.load_spritesheet(s, "assets/", 223, 190);
    ss_player = PP.assets.sprite.load_spritesheet(s, "assets/images/spritesheet_player.png", 223, 190);
};


function create(s) {
    // background = PP.assets.tilesprite.add(s, img_background, 0, 0, 1280, 5000, 0, 0);
    background = PP.assets.image.add(s, img_background, 0 , 0, 0, 0);
    player = PP.assets.sprite.add(s, ss_player, 150, 220, 0.5, 1);
    
    
    floor = PP.shapes.rectangle_add(s, 640, 620, 1280, 1, "0x000000", 0);
    PP.physics.add(s, player, PP.physics.type.DYNAMIC);
    PP.physics.add(s, floor, PP.physics.type.STATIC);


    PP.physics.add_collider(s, player, floor);
    configure_player_animation(s, player);

    PP.camera.start_follow(s, player,0,250);



    // configure_player_animation(s, player);
};


function update(s) {
    manage_player_update(s, player);
    background.geometry.y = PP.camera.get_scroll_y(s) * 0.05;

};


function destroy(s) {


};




PP.scenes.add("scene1", preload, create, update, destroy);






