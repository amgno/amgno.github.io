const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

var stuck = false;

window.addEventListener("mousemove", function (e) {

    const posX = e.clientX;
    const posY = e.clientY;

    if (!stuck) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    } else {
        cursorOutline.animate({
            left: divhoverx,
            top: divhoverx
        }, { duration: 500, fill: "forwards" });
    }
    // cursorOutline.style.left = `${posX}px`;
    // cursorOutline.style.top = `${posY}px`;


});