let player_speed = 300;
let player_jump = 760;
let floor_height = 620;
let curr_anim;
let next_anim;
let testfallback = false;

function configure_player_animation(s, player) {
    PP.assets.sprite.animation_add_list(player, "run", [15, 14, 13, 12, 11, 10, 9, 8, 7, 6], 10, -1); //array dato che i frame sono sparpagliati
    PP.assets.sprite.animation_add_list(player, "stop", [17], 10, 1); //array dato che i frame sono sparpagliati
    PP.assets.sprite.animation_add_list(player, "jump_up", [1, 0, 3], 15, 0); //array dato che i frame sono sparpagliati
    PP.assets.sprite.animation_add_list(player, "jump_down", [3, 4, 5], 7, 0); //array dato che i frame sono sparpagliati
}


function manage_player_update(s, player) {
    let next_anim = curr_anim;


    if (PP.interactive.kb.is_key_down(s, PP.key_codes.D)) {
        PP.physics.set_velocity_x(player, player_speed);
        next_anim = "run";
    } else if (PP.interactive.kb.is_key_down(s, PP.key_codes.A)) {
        PP.physics.set_velocity_x(player, -player_speed);
        next_anim = "run";
        player.geometry.flip_x = true;
    } else {
        // Se arrivo qui non go premuto ne A ne D (sinistra o destra)
        PP.physics.set_velocity_x(player, 0);
        next_anim = "stop";
    }

    // if (PP.interactive.kb.is_key_down(s, PP.key_codes.SPACE)) {
    //         let testnewjump = player.geometry.y + player_jump;
    //         if(player.geometry.y < testnewjump){
    //             PP.physics.set_velocity_y(player, -100);
    //         }


    //         //proviamo ad evitare che tocchi l'angolo
    //         player.is_on_platform = false;

    // }
    if (PP.interactive.kb.is_key_down(s, PP.key_codes.SPACE)) {
        if (player.is_on_platform) {
            PP.physics.set_acceleration_y(player, 0.1)
            PP.physics.set_velocity_y(player, -player_jump);
            player.is_on_platform = false;
            testfallback = true;
        }
    }


    if (PP.interactive.kb.is_key_up(s, PP.key_codes.SPACE)) {
        if(testfallback){
        PP.physics.set_velocity_y(player, +player_jump / 1.5);
        testfallback = false;
        }
    }



    if (PP.physics.get_velocity_y(player) < 0) {
        next_anim = "jump_up";
    }

    if (PP.physics.get_velocity_y(player) > 0) {
        player.is_on_platform = false;
        next_anim = "jump_down"
    }

    if (curr_anim != next_anim) {
        PP.assets.sprite.animation_play(player, next_anim);
        curr_anim = next_anim;
    }

    if (PP.physics.get_velocity_x(player) > 0) {
        player.geometry.flip_x = false;
    } else if (PP.physics.get_velocity_x(player) < 0) {
        player.geometry.flip_x = true;
    }
}




function noclip(s, player, camera) {

    PP.physics.set_allow_gravity(player, false);
    if (PP.interactive.kb.is_key_down(s, PP.key_codes.D)) {
        player.geometry.x = player.geometry.x + 10;

    } else if (PP.interactive.kb.is_key_down(s, PP.key_codes.A)) {
        player.geometry.x = player.geometry.x - 10;
    } else if (PP.interactive.kb.is_key_down(s, PP.key_codes.W)) {
        PP.physics.set_velocity_y(camera, -1200);
        player.geometry.y = player.geometry.y - 10;
    } else if (PP.interactive.kb.is_key_down(s, PP.key_codes.S)) {
        PP.physics.set_velocity_y(camera, +1200);
        player.geometry.y = player.geometry.y + 10;
    }
}



