if(document.cookie.search("mode") == -1){
    document.cookie = "mode=theme1";
}


function getCookie(cookieName) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [key,value] = el.split('=');
      cookie[key.trim()] = value;
    })
    return cookie[cookieName];
  }



function  checktheme() {
    if(getCookie("mode") === "theme1") {
        changetheme('theme1');
    } else {
        changetheme('theme2')
    }
  }