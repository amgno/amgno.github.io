let img_mushroom_1
let img_mushroom_2

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
let plat16;
let plat17;
let plat18;
let plat19;
let plat20;
let plat21;
let plat22;
let plat23;
let plat24;
let plat25;
let plat26;
let plat27;
let plat28;
let plat29;
let plat30;
let plat31;
let plat32;
let plat33;
let plat34;
let plat35;
let plat36;
let plat37;
let plat38;
let plat39;
let plat40;

let lastPlatformPositionY = 640;

let img_1;

function preload_mushrooms(s) {
    img_1 = PP.assets.image.load(s, "assets/images/platform.png")
}

function collision_mushroom(s, player, m) {
    PP.assets.destroy(m);
    let previous_score = PP.gameState.get_variable("score");
    // PP.gameState.set_variable("score", previous_score+10);
}

function collision_platform(s, player, platform) {
    
    
    if (player.geometry.y <= platform.geometry.y) {
        player.is_on_platform = true;

        // if(player.geometry.y > lastPlatformPositionY){
        //     console.log("caduta")
        // }

        if((player.geometry.y - lastPlatformPositionY)>600){
            PP.scenes.start("menu");
        }

        lastPlatformPositionY = player.geometry.y;
    }
}


//version 1.3
function create_mushrooms(s, player) {

    // plat1 = PP.assets.image.add(s, img_1, 907, 330, 0, 0);
    // plat2 = PP.assets.image.add(s, img_1, 1441, 32, 0, 0);
    // plat3 = PP.assets.image.add(s, img_1, 1770, -251, 0, 0);
    // plat4 = PP.assets.image.add(s, img_1, 872, -261, 0, 0);
    // plat5 = PP.assets.image.add(s, img_1, 1482, -540, 0, 0);
    // plat6 = PP.assets.image.add(s, img_1, 2022, -615, 0, 0);
    // plat7 = PP.assets.image.add(s, img_1, 872, -777, 0, 0);
    // plat8 = PP.assets.image.add(s, img_1, 1648, -954, 0, 0);
    // plat9 = PP.assets.image.add(s, img_1, 750, -1511, 0, 0);
    // plat10 = PP.assets.image.add(s, img_1, 1330, -1161, 0, 0);
    // plat11 = PP.assets.image.add(s, img_1, 3034, -1360, 0, 0);
    // plat12 = PP.assets.image.add(s, img_1, 558, -1020, 0, 0);
    // plat13 = PP.assets.image.add(s, img_1, 2419, -1540, 0, 0);
    // plat14 = PP.assets.image.add(s, img_1, 57, -1370, 0, 0);
    // plat15 = PP.assets.image.add(s, img_1, 805, -1731, 0, 0);
    // plat16 = PP.assets.image.add(s, img_1, 1321, -1915, 0, 0);
    // plat17 = PP.assets.image.add(s, img_1, 2232, -1954, 0, 0);
    // plat18 = PP.assets.image.add(s, img_1, 46, -2055, 0, 0);
    // plat19 = PP.assets.image.add(s, img_1, 712, -2225, 0, 0);
    // plat20 = PP.assets.image.add(s, img_1, 2821, -2261, 0, 0);
    // plat21 = PP.assets.image.add(s, img_1, 1688, -2438, 0, 0);

    // plat22 = PP.assets.image.add(s, img_1, 335, -2454, 0, 0);
    // plat23 = PP.assets.image.add(s, img_1, 1108, -2267, 0, 0);
    // plat24 = PP.assets.image.add(s, img_1, 1993, -2698, 0, 0);
    // plat25 = PP.assets.image.add(s, img_1, 2450, -2983, 0, 0);
    // plat26 = PP.assets.image.add(s, img_1, 499, -2932, 0, 0);
    // plat27 = PP.assets.image.add(s, img_1, 1959, -3243, 0, 0);
    // plat28 = PP.assets.image.add(s, img_1, 1262, -3383, 0, 0);
    // plat29 = PP.assets.image.add(s, img_1, 563, -3433, 0, 0);
    // plat30 = PP.assets.image.add(s, img_1, 1972, -3657, 0, 0);
    // plat31 = PP.assets.image.add(s, img_1, 947, -3707, 0, 0);
    // plat32 = PP.assets.image.add(s, img_1, 1527, -3896, 0, 0);
    // plat33 = PP.assets.image.add(s, img_1, 1173, -4182, 0, 0);
    // plat34 = PP.assets.image.add(s, img_1, 1972, -4152, 0, 0);
    // plat35 = PP.assets.image.add(s, img_1, 2508, -4342, 0, 0);


    plat1 = PP.shapes.rectangle_add(s, 2016, 318, 605, 53, "0xABCDEF", 0)
    plat2 = PP.shapes.rectangle_add(s,  1277,  174, 390, 68, "0xABCDEF", 0)
    plat3 = PP.shapes.rectangle_add(s, 2318,  10, 620, 68, "0xABCDEF", 0)
    plat4 = PP.shapes.rectangle_add(s, 792, -88, 463, 53, "0xABCDEF", 0)
    plat5 = PP.shapes.rectangle_add(s,  1871, -256, 481, 68, "0xABCDEF", 0)
    plat6 = PP.shapes.rectangle_add(s, 2999, -426, 741, 53, "0xABCDEF", 0)
    plat7 = PP.shapes.rectangle_add(s, 3536, -726, 310, 68, "0xABCDEF", 0)
    plat8 = PP.shapes.rectangle_add(s, 2062, -523, 512, 68, "0xABCDEF", 0)
    plat9 = PP.shapes.rectangle_add(s, 2888, -985, 390, 68, "0xABCDEF", 0)
    plat10 = PP.shapes.rectangle_add(s,  1066, -1053, 390, 68, "0xABCDEF", 0)
    plat11 = PP.shapes.rectangle_add(s,  1699, -1208, 605, 53, "0xABCDEF", 0)
    plat12 = PP.shapes.rectangle_add(s, 2693, -1234, 463, 53, "0xABCDEF", 0)
    plat13 = PP.shapes.rectangle_add(s, 437, -1261, 310, 68, "0xABCDEF", 0)
    plat14 = PP.shapes.rectangle_add(s, 262, -1466, 310, 68, "0xABCDEF", 0)
    plat15 = PP.shapes.rectangle_add(s, 2128, -1638, 512, 68, "0xABCDEF", 0)
    plat16 = PP.shapes.rectangle_add(s, 879, -1741, 741, 53, "0xABCDEF", 0)
    plat17 = PP.shapes.rectangle_add(s,  1567, -1873, 390, 68, "0xABCDEF", 0)
    plat18 = PP.shapes.rectangle_add(s, 2482, -1907, 390, 68, "0xABCDEF", 0)
    plat19 = PP.shapes.rectangle_add(s, 3262, -2000, 620, 68, "0xABCDEF", 0)
    plat20 = PP.shapes.rectangle_add(s,  1097, -2105, 390, 68, "0xABCDEF", 0)
    plat21 = PP.shapes.rectangle_add(s, 2999, -2312, 605, 53, "0xABCDEF", 0)
    plat22 = PP.shapes.rectangle_add(s,  1318, -2370, 463, 53, "0xABCDEF", 0)
    plat23 = PP.shapes.rectangle_add(s, 560, -2431, 512, 68, "0xABCDEF", 0)
    plat24 = PP.shapes.rectangle_add(s, 2999, -2575, 390, 68, "0xABCDEF", 0)
    plat25 = PP.shapes.rectangle_add(s,  1540, -2619, 390, 68, "0xABCDEF", 0)
    plat26 = PP.shapes.rectangle_add(s, 2264, -2734, 741, 53, "0xABCDEF", 0)
    plat27 = PP.shapes.rectangle_add(s,  1646, -3082, 310, 68, "0xABCDEF", 0)
    plat28 = PP.shapes.rectangle_add(s, 2349, -3278,  188, 37, "0xABCDEF", 0)
    plat29 = PP.shapes.rectangle_add(s, 984, -3331, 620, 68, "0xABCDEF", 0)
    plat30 = PP.shapes.rectangle_add(s, 2713, -3478, 390, 68, "0xABCDEF", 0)
    plat31 = PP.shapes.rectangle_add(s,  1731, -3565,  188, 38, "0xABCDEF", 0)
    plat32 = PP.shapes.rectangle_add(s, 3083, -3784, 512, 68, "0xABCDEF", 0)









    PP.physics.add(s, plat1, PP.physics.type.STATIC);
    let test1 = PP.physics.add_collider_f(s, player, plat1, collision_platform);

    PP.physics.add(s, plat2, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat2, collision_platform);

    PP.physics.add(s, plat2, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat2, collision_platform);

    PP.physics.add(s, plat3, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat3, collision_platform);

    PP.physics.add(s, plat4, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat4, collision_platform);

    PP.physics.add(s, plat5, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat5, collision_platform);

    PP.physics.add(s, plat6, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat6, collision_platform);

    PP.physics.add(s, plat7, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat7, collision_platform);

    PP.physics.add(s, plat8, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat8, collision_platform);

    PP.physics.add(s, plat9, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat9, collision_platform);

    PP.physics.add(s, plat10, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat10, collision_platform);

    PP.physics.add(s, plat11, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat11, collision_platform);

    PP.physics.add(s, plat12, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat12, collision_platform);

    PP.physics.add(s, plat13, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat13, collision_platform);

    PP.physics.add(s, plat14, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat14, collision_platform);

    PP.physics.add(s, plat15, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat15, collision_platform);

    PP.physics.add(s, plat16, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat16, collision_platform);

    PP.physics.add(s, plat17, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat17, collision_platform);

    PP.physics.add(s, plat18, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat18, collision_platform);

    PP.physics.add(s, plat19, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat19, collision_platform);

    PP.physics.add(s, plat20, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat20, collision_platform);

    PP.physics.add(s, plat21, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat21, collision_platform);

    PP.physics.add(s, plat22, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat22, collision_platform);

    PP.physics.add(s, plat24, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat24, collision_platform);

    PP.physics.add(s, plat25, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat25, collision_platform);

    PP.physics.add(s, plat26, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat26, collision_platform);

    PP.physics.add(s, plat23, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat23, collision_platform);



    PP.physics.add(s, plat32, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat32, collision_platform);

    PP.physics.add(s, plat31, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat31, collision_platform);

    PP.physics.add(s, plat30, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat30, collision_platform);

    PP.physics.add(s, plat29, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat29, collision_platform);

    PP.physics.add(s, plat28, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat28, collision_platform);

    PP.physics.add(s, plat27, PP.physics.type.STATIC);
    PP.physics.add_collider_f(s, player, plat27, collision_platform);


    




    // PP.physics.add(s, plat35, PP.physics.type.STATIC);
    // PP.physics.add_collider_f(s, player, plat35, collision_platform);

    // PP.physics.add(s, plat34, PP.physics.type.STATIC);
    // PP.physics.add_collider_f(s, player, plat34, collision_platform);

    // PP.physics.add(s, plat33, PP.physics.type.STATIC);
    // PP.physics.add_collider_f(s, player, plat33, collision_platform);
}