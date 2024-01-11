let img_background;
let player;
let ss_player;
let floor;
let background;
let isnoclip = false;





let testcamera;

let plat1;
let plat2;
let plat3;
let plat4;
let plat5;
let plat6;
let plat7;
let plat8;
let plat9;
let plat10;
let plat11;
let plat12;
let plat13;
let plat14;
let plat15;


let img_plat1;
let img_plat2;
let img_plat3;
let img_plat4;
let img_plat5;
let img_plat6;
let img_plat7;
let img_plat8;
let img_plat9;
let img_plat10;
let img_plat11;
let img_plat12;
let img_plat13;
let img_plat14;
let img_plat15;



function preload(s){
    ss_player = PP.assets.sprite.load_spritesheet(s, "assets/images/sprite.png", 82.5, 165);
    img_background = PP.assets.image.load(s, "assets/images/backgrounddim3.png");
    preload_egg(s);


    img_plat1 = PP.assets.image.load(s, "assets/images/plat/plat1.png");
    img_plat2 = PP.assets.image.load(s, "assets/images/plat/plat2.png");
    img_plat3 = PP.assets.image.load(s, "assets/images/plat/plat3.png");
    img_plat4 = PP.assets.image.load(s, "assets/images/plat/plat4.png");
    img_plat5 = PP.assets.image.load(s, "assets/images/plat/plat5.png");
    img_plat6 = PP.assets.image.load(s, "assets/images/plat/plat6.png");
    img_plat7 = PP.assets.image.load(s, "assets/images/plat/plat7.png");
    img_plat8 = PP.assets.image.load(s, "assets/images/plat/plat8.png");
    img_plat9 = PP.assets.image.load(s, "assets/images/plat/plat9.png");
    img_plat10 = PP.assets.image.load(s, "assets/images/plat/plat10.png");
    img_plat11 = PP.assets.image.load(s, "assets/images/plat/plat11.png");
    img_plat12 = PP.assets.image.load(s, "assets/images/plat/plat12.png");
    img_plat13 = PP.assets.image.load(s, "assets/images/plat/plat13.png");
    img_plat14 = PP.assets.image.load(s, "assets/images/plat/plat14.png");
    img_plat15 = PP.assets.image.load(s, "assets/images/plat/plat15.png");



}



function create(s){
    player = PP.assets.sprite.add(s, ss_player, 100, 220, 0.5, 1);
    configure_player_animation(s, player);
    PP.physics.add(s, player, PP.physics.type.DYNAMIC);
    create_egg(s, player);

    // floor = PP.shapes.rectangle_add(s, 640, 620, 1280, 1, "0x000000", 0);
    // PP.physics.add(s, floor, PP.physics.type.STATIC);

    // PP.physics.add_collider(s, player, floor);


    plat1 = PP.assets.image.add(s, img_plat1, -840, 279, 0, 0);
    plat2 = PP.assets.image.add(s, img_plat2, 251, 471, 0, 0);
    plat3 = PP.assets.image.add(s, img_plat3, 606, 293, 0, 0);
    plat4 = PP.assets.image.add(s, img_plat4, 878, 704, 0, 0);
    plat5 = PP.assets.image.add(s, img_plat5, 948, 409, 0, 0);
    plat6 = PP.assets.image.add(s, img_plat6, 990, 833, 0, 0);
    plat7 = PP.assets.image.add(s, img_plat7, 1353, 691, 0, 0);
    plat8 = PP.assets.image.add(s, img_plat8, 1779, 236, 0, 0);
    plat9 = PP.assets.image.add(s, img_plat9, 2024, 660, 0, 0);
    plat10 = PP.assets.image.add(s, img_plat10, 2169, 433, 0, 0);
    plat11 = PP.assets.image.add(s, img_plat11, 2232, 755, 0, 0);
    plat12 = PP.assets.image.add(s, img_plat12, 2511, 315, 0, 0);
    plat13 = PP.assets.image.add(s, img_plat13, 2567, 568, 0, 0);
    plat14 = PP.assets.image.add(s, img_plat14, 2851, 420, 0, 0);
    plat15 = PP.assets.image.add(s, img_plat15, 3100, 279, 0, 0);








    PP.camera.start_follow(s, player, -300, -70);


    PP.physics.add(s, plat1, PP.physics.type.STATIC);
    PP.physics.add(s, plat2, PP.physics.type.STATIC);
    PP.physics.add(s, plat3, PP.physics.type.STATIC);
    PP.physics.add(s, plat4, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat5, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat6, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat7, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat8, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat9, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat10, PP.physics.type.STATIC);
    PP.physics.add(s, plat11, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat12, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat13, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat14, PP.physics.type.DYNAMIC);
    PP.physics.add(s, plat15, PP.physics.type.STATIC);



    PP.physics.add_collider_f(s, player, plat1, collision_platform);
    PP.physics.add_collider_f(s, player, plat2, collision_platform);
    PP.physics.add_collider_f(s, player, plat3, collision_platform);
    PP.physics.add_collider_f(s, player, plat4, collision_platform);
    PP.physics.add_collider_f(s, player, plat5, collision_platform);
    PP.physics.add_collider_f(s, player, plat6, collision_platform);
    PP.physics.add_collider_f(s, player, plat7, collision_platform);
    PP.physics.add_collider_f(s, player, plat8, collision_platform);
    PP.physics.add_collider_f(s, player, plat9, collision_platform);
    PP.physics.add_collider_f(s, player, plat10, collision_platform);
    PP.physics.add_collider_f(s, player, plat11, collision_platform);
    PP.physics.add_collider_f(s, player, plat12, collision_platform);
    PP.physics.add_collider_f(s, player, plat13, collision_platform);
    PP.physics.add_collider_f(s, player, plat14, collision_platform);
    PP.physics.add_collider_f(s, player, plat15, collision_platform);

    



    PP.physics.set_allow_gravity(plat4, false);
    PP.physics.set_allow_gravity(plat5, false);
    PP.physics.set_allow_gravity(plat6, false);
    PP.physics.set_allow_gravity(plat7, false);
    PP.physics.set_allow_gravity(plat8, false);
    PP.physics.set_allow_gravity(plat9, false);
    PP.physics.set_allow_gravity(plat11, false);
    PP.physics.set_allow_gravity(plat12, false);
    PP.physics.set_allow_gravity(plat13, false);
    PP.physics.set_allow_gravity(plat14, false);




    PP.physics.set_immovable(plat4, true);
    PP.physics.set_immovable(plat5, true);
    PP.physics.set_immovable(plat6, true);
    PP.physics.set_immovable(plat7, true);
    PP.physics.set_immovable(plat8, true);
    PP.physics.set_immovable(plat9, true);



}
function update(s){
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



    if(plat4.geometry.y >= 704) {
        PP.physics.set_velocity_y(plat4, -100);
    }
    if(plat4.geometry.y <= 500) {
        PP.physics.set_velocity_y(plat4, 100);
    }

    if(plat5.geometry.x >= 1155) {
        PP.physics.set_velocity_x(plat5, -100);
    }
    if(plat5.geometry.x <= 948) {
        PP.physics.set_velocity_x(plat5, 100);
    }

    if(plat6.geometry.y >= 1292) {
        PP.physics.set_velocity_y(plat6, -100);
    }
    if(plat6.geometry.y <= 833) {
        PP.physics.set_velocity_y(plat6, 100);
    }

    if(plat7.geometry.y >= 691) {
        PP.physics.set_velocity_y(plat7, -100);
    }
    if(plat7.geometry.y <= 351) {
        PP.physics.set_velocity_y(plat7, 100);
    }

    if(plat8.geometry.x >= 2102) {
        PP.physics.set_velocity_x(plat8, -100);
    }
    if(plat8.geometry.x <= 1728) {
        PP.physics.set_velocity_x(plat8, 100);
    }

    if(plat9.geometry.y >= 900) {
        PP.physics.set_velocity_y(plat9, -100);
    }
    if(plat9.geometry.y <= 660) {
        PP.physics.set_velocity_y(plat9, 100);
    }

    console.log(player.geometry.y)

}
function destroy(s){}





PP.scenes.add("scene2", preload, create, update, destroy);