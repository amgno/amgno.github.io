
document.addEventListener('DOMContentLoaded', function () {
    document.body.style.opacity = '0%';
    setTimeout(function () {
        document.body.style.opacity = '100%';
    }, 200); // Match the transition duration


    document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent immediate navigation
            const targetUrl = this.href;
            document.body.style.opacity = '0%';

            if(document.body.style.backgroundColor!='rgb(0,0,0)'){
                document.body.style.backgroundColor='rgb(0,0,0)'
            };

            setTimeout(function () {
                window.location.href = targetUrl; // Navigate after fade-out
            }, 250); // Match the transition duration
        });
    });


});