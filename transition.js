document.addEventListener('DOMContentLoaded', function () {
    initializePageTransition();
});

window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        initializePageTransition();
    }
});

function initializePageTransition() {
    document.body.style.opacity = '0';
    setTimeout(function () {
        document.body.style.opacity = '100%';
    }, 200);

    document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetUrl = this.href;
            document.body.style.opacity = '0';

            if (document.body.style.backgroundColor != 'rgb(0,0,0)') {
                document.body.style.backgroundColor = 'rgb(0,0,0)';
            }

            setTimeout(function () {
                window.location.href = targetUrl;
            }, 250);
        });
    });
}