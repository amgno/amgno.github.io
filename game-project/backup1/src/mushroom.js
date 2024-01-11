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

// function create_mushrooms(s, player) {
//     for (let i = 0; i < 10; i++) {


//         PP.physics.add(s, mushroom, PP.physics.type.STATIC);
//         PP.physics.add_collider(s, mushroom, player);
//         // PP.physics.add_overlap_f(s, player, mushroom, collision_mushroom);
//     }
// }

//versione 1.1
// function create_mushrooms(s, player) {        
//     // Assuming each platform is 200 pixels wide, 100 pixels tall,
//     // and there is a vertical gap of 200 pixels between platforms
//     const platformWidth = 10;
//     const platformHeight = 100;
//     const verticalGap = 200;
//     const minX = 200;
//     const maxX = 800 - platformWidth;

//     // Incremental Y coordinate for each platform
//     let currentY = 0;

//     for (let i = 0; i < 10; i++) {
//         // Generate a random X coordinate within the range
//         const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

//         // Use the generated X and Y coordinates to create the platform
//         let mushroom = PP.assets.image.add(s, img_mushroom_1, randomX, currentY, 0, 0, 0);

//         // Increment Y coordinate for the next platform
//         currentY += verticalGap;

//         // Add physics and collider setup (modify as needed)
//         PP.physics.add(s, mushroom, PP.physics.type.STATIC);
//         PP.physics.add_collider(s, mushroom, player);
//         // Uncomment the line below if needed, and replace collision_mushroom with your actual collision function
//         // PP.physics.add_overlap_f(s, player, mushroom, collision_mushroom);
//     }
// }
function collision_platform(s, player, platform) {
    //attributo così che possiamo far saltare di nuovo il personaggio. Booleano
    if(player.geometry.x >= platform.geometry.x){
    player.is_on_platform = true;
    console.log(platform.geometry.x)
    }
}


//versione 1.2
// function create_mushrooms(s, player) {
//     // Assuming each platform is 200 pixels wide, 100 pixels tall,
//     // and there is a vertical gap of 200 pixels between platforms
//     const platformWidth = 200;
//     const platformHeight = 100;
//     const verticalGap = 100;
//     const minX = 300; // Adjusted the minX value to ensure platforms are within the visible range
//     const maxX = 1200 - platformWidth;

//     // Incremental Y coordinate for each platform
//     let currentY = -400;

//     for (let i = 0; i < 10; i++) {
//         // Generate a random X coordinate within the range
//         const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

//         // Use the generated X and Y coordinates to create the platform
//         // console.log(-currentY);
//         let mushroom = PP.assets.image.add(s, img_mushroom_1, randomX, -currentY, 0, 0, 0);

//         // Increment Y coordinate for the next platform
//         currentY += verticalGap + platformHeight; // Adjusted to include platform height

//         // Add physics and collider setup (modify as needed)
//         PP.physics.add(s, mushroom, PP.physics.type.STATIC);
//         // Uncomment the line below if needed, and replace collision_mushroom with your actual collision function
//         // PP.physics.add_overlap_f(s, player, mushroom, collision_mushroom);
//         PP.physics.add_collider_f(s, player, mushroom, collision_platform);
//     }
// }

//version 1.3
function create_mushrooms(s, player) {
    // Assuming each platform is 200 pixels wide, 100 pixels tall,
    // and there is a vertical gap of 100 pixels between platforms
    const platformWidth = 200;
    const platformHeight = 100;
    const verticalGap = 160;
    const horizontalCoordinates = [100, 400, 850, 200]; // Predetermined X coordinates

    // Incremental Y coordinate for each platform
    let currentY = -400;

    // Keep track of the previously used X coordinate
    let prevX = -1;

    for (let i = 0; i < 20; i++) {
        // Randomly select an X coordinate from the array, excluding the previous one
        let availableCoordinates = horizontalCoordinates.filter(coord => coord !== prevX);
        
        if (availableCoordinates.length === 0) {
            // If all coordinates have been used, reset the available coordinates
            availableCoordinates = horizontalCoordinates.slice();
        }

        const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
        const randomX = availableCoordinates[randomIndex];

        // Update the previously used X coordinate
        prevX = randomX;

        // Use the generated X and Y coordinates to create the platform
        let mushroom = PP.assets.image.add(s, img_mushroom_1, randomX, -currentY, 0, 0, 0);

        // Increment Y coordinate for the next platform
        currentY += verticalGap + platformHeight; // Adjusted to include platform height

        // Add physics and collider setup (modify as needed)
        PP.physics.add(s, mushroom, PP.physics.type.STATIC);
        // Uncomment the line below if needed, and replace collision_mushroom with your actual collision function
        // PP.physics.add_overlap_f(s, player, mushroom, collision_mushroom);
        PP.physics.add_collider_f(s, player, mushroom, collision_platform);
    }
}


