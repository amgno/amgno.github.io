let img_mushroom_1
let img_mushroom_2

function preload_mushrooms(s) {
    img_mushroom_1 = PP.assets.image.load(s, "assets/images/platform.png")
    img_mushroom_2 = PP.assets.image.load(s, "assets/images/placeholderplayer.png")
}

function collision_mushroom(s, player, m) {
    PP.assets.destroy(m);
    let previous_score = PP.gameState.get_variable("score");
    // PP.gameState.set_variable("score", previous_score+10);
}

function collision_platform(s, player, platform) {
    if(player.geometry.x >= platform.geometry.x){
    player.is_on_platform = true;
    // console.log(platform.geometry.x)
    }
}



//version 1.3
function create_mushrooms(s, player) {
    const platformWidth = 200;
    const platformHeight = 200;
    const verticalGap = 180;
    const horizontalCoordinates = [100, 400, 850, 200]; 


    let currentY = -400;

    let prevX = -1;

    for (let i = 0; i < 20; i++) {
        let availableCoordinates = horizontalCoordinates.filter(coord => coord !== prevX);
        
        if (availableCoordinates.length === 0) {
            availableCoordinates = horizontalCoordinates.slice();
        }

        const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
        const randomX = availableCoordinates[randomIndex];


        prevX = randomX;

        let mushroom = PP.assets.image.add(s, img_mushroom_1, randomX, -currentY, 0, 0, 0);

        currentY += verticalGap + platformHeight; 

        PP.physics.add(s, mushroom, PP.physics.type.STATIC);
        PP.physics.add_collider_f(s, player, mushroom, collision_platform);
    }
}



function create_mushrooms2(s, player) {
    const platformWidth = 200;
    const platformHeight = 150;
    const verticalGap = 160;
    const horizontalCoordinates = [1300, 1500, 1700]; 


    let currentY = -400;

    let prevX = -1;

    for (let i = 0; i < 20; i++) {
        let availableCoordinates = horizontalCoordinates.filter(coord => coord !== prevX);
        
        if (availableCoordinates.length === 0) {
            availableCoordinates = horizontalCoordinates.slice();
        }

        const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
        const randomX = availableCoordinates[randomIndex];


        prevX = randomX;

        let mushroom = PP.assets.image.add(s, img_mushroom_1, randomX, -currentY, 0, 0, 0);

        currentY += verticalGap + platformHeight; 

        PP.physics.add(s, mushroom, PP.physics.type.STATIC);
        PP.physics.add_collider_f(s, player, mushroom, collision_platform);
    }
}


