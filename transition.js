document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded');
    requestAnimationFrame(() => {
        initializePageTransition();
    });
});

function initializePageTransition() {
    console.log('Initializing Page Transition');
    document.body.style.opacity = '0';
    
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease-in-out';
        document.body.style.opacity = '1';
        
        console.log('Animating Text Elements');
        animateTextElements();
    });

    document.querySelectorAll('a[href]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            if (this.hostname === window.location.hostname) {
                event.preventDefault();
                const targetUrl = this.href;
                document.body.style.opacity = '0';
                setTimeout(function () {
                    window.location.href = targetUrl;
                }, 500);
            }
        });
    });
}

function animateTextElements() {
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li');
    console.log('Text Elements Found:', textElements.length);
    
    textElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'none';
        
        requestAnimationFrame(() => {
            element.style.transition = `opacity 0.5s ease-in-out ${index * 0.05}s, transform 0.5s ease-in-out ${index * 0.05}s`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    });
}