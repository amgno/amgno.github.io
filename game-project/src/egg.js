let img_egg
let egg

function preload_egg(s){
    img_egg = PP.assets.image.load(s, "assets/images/rain.png")
    // img_mushroom_2 = PP.assets.image.load(s, "assets/images/mushroom_2.png")
}


function create_egg(s, player){

    function createEgg(s) {
        let y = Math.floor(Math.random() * (700 - 150 + 1)) + 150;
        egg = PP.assets.image.add(s, img_egg, 3650, y, 0, 0, 0);
        PP.physics.add(s, egg, PP.physics.type.DYNAMIC);
        PP.physics.set_allow_gravity(egg, false);
    }
    
    function generateEgg(s, count) {
        for (let i = 0; i < count; i++) {
            createEgg(s);
        }
    }
    
    // Generate a raindrop every 100 milliseconds
    setInterval(function () {
        generateEgg(s, 1);
        PP.physics.set_velocity_x(egg, -800);

    }, 1000);
}

