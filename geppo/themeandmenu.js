document.addEventListener("DOMContentLoaded", function(event) {
    checktheme();
    })
    var isopen=0;

    function menu(){
        
        if (isopen == 0) {
            openmenu()
            isopen = 1;
        } else {
            closemenu()
            isopen=0;
    }}


    function closemenu(){
        var navmenu = document.getElementById("navigationmenu")
        navmenu.classList.remove('mostra')
        navmenu.classList.add('nascondi')

    }
    function openmenu(){
        var navmenu = document.getElementById("navigationmenu")
        navmenu.classList.add('mostra')
    }


    function changetheme(selectedtheme) {
        var logo = document.getElementById("logoid");
        var root = document.documentElement;
        if (selectedtheme == "theme2"){
            document.cookie = "mode=theme2";
            logo.src = "./logos/300ppi/finaleTavola disegno 1 copia 2.png";
            root.style.setProperty('--coloremainbianco', 'rgb(77, 12, 22)');
            root.style.setProperty('--coloremainrosso', 'rgb(240, 236, 217)');
        } else if (selectedtheme == "theme1") {
            document.cookie = "mode=theme1";
            logo.src = "./logos/300ppi/finaleTavola disegno 1 copia 3.png";
            root.style.setProperty('--coloremainbianco', 'rgb(240, 236, 217)');
            root.style.setProperty('--coloremainrosso', 'rgb(77, 12, 22)');
        }
}