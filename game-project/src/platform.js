let img_platform;

let platform_2;
let platform;
let platform_3;

function preload_platforms(s) {
    img_platform = PP.assets.image.load(s, "assets/images/platform.png")
} 

function collision_platform(s, player, platform) {
    //attributo così che possiamo far saltare di nuovo il personaggio. Booleano
    if(player.geometry.x >= platform.geometry.x){
    player.is_on_platform = true;
    }
}


function create_platforms(s, player) {
    let platform = PP.assets.image.add(s, img_platform, 200, 480, 0, 0);
    PP.physics.add(s, platform, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, platform, collision_platform);


    let platform_2 = PP.assets.image.add(s, img_platform, 680, 280, 0, 0);
    PP.physics.add(s, platform_2, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, platform_2, collision_platform);
    
    let platform_3 = PP.assets.image.add(s, img_platform, 80, 180, 0, 0);
    PP.physics.add(s, platform_3, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, platform_3, collision_platform);

    // platform_2 = PP.assets.image.add(s, img_platform, 800, 300, 0, 0);
    // PP.physics.add(s, platform_2, PP.physics.type.DYNAMIC);
    // PP.physics.add_collider_f(s, player, platform_2, collision_platform);
    // PP.physics.set_allow_gravity(platform_2, false);
    // PP.physics.set_immovable(platform_2, true);
    
    // PP.physics.set_velocity_x(platform_2, 100);
}

function update_platforms(s, player) {

    // if(player.geometry.y > platform_3.geometry.x){

    // }
}