let img_rain_1

function preload_rain(s){
    img_rain_1 = PP.assets.image.load(s, "assets/images/rain.png")
    // img_mushroom_2 = PP.assets.image.load(s, "assets/images/mushroom_2.png")
}


function create_rain(s, player){
    // for (let i=0; i<1000; i++) {
        
        
    //     let x = Math.floor(Math.random() * (0 - 1200 + 1)) + 1200;
    //     let y = Math.floor(Math.random() * (1000 - 2000 + 1)) + 1100;
    //     let rain = PP.assets.image.add(s, img_rain_1, x, -y, 0, 0, 0)
    //     PP.physics.add(s, rain, PP.physics.type.DYNAMIC);
    // }



    function createRaindrop(s) {
        let x = Math.floor(Math.random() * (0 - 1200 + 1)) + 1200;
        let y = Math.floor(Math.random() * (1800 - 2000 + 1)) + 1100;
        let rain = PP.assets.image.add(s, img_rain_1, x, -y*5, 0, 0, 0);
        PP.physics.add(s, rain, PP.physics.type.DYNAMIC);
    }
    
    function generateRaindrops(s, count) {
        for (let i = 0; i < count; i++) {
            createRaindrop(s);
        }
    }
    
    // Generate a raindrop every 100 milliseconds
    setInterval(function () {
        generateRaindrops(s, 1);
    }, 1000);
}
