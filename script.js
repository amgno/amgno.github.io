document.addEventListener('DOMContentLoaded', () => {
    const rightContainer = document.querySelector('.right');

    fetch('portfolio-items.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(items => {
            if (!rightContainer) {
                console.error('Error: Could not find .right container element');
                return;
            }
            // Clear any potential placeholder content (though it should be empty)
            rightContainer.innerHTML = '';

            items.forEach(itemData => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('item');

                // Handle 'desc' type
                if (itemData.type === 'desc') {
                    itemElement.classList.add('full', 'desc');

                    const titleElement = document.createElement('p');
                    titleElement.textContent = itemData.title;

                    const textElement = document.createElement('p');
                    textElement.textContent = itemData.text;

                    itemElement.appendChild(titleElement);
                    itemElement.appendChild(textElement);
                }
                // Handle 'item' and 'full' types (media items)
                else {
                    if (itemData.type === 'full') {
                        itemElement.classList.add('full');
                    }

                    let mediaElement;
                    const mediaSrc = itemData.mediaSrc;

                    // Check if mediaSrc is an array (for slideshow)
                    if (Array.isArray(mediaSrc)) {
                        mediaElement = createSlideshow(mediaSrc, itemData.altText || 'Portfolio slideshow');
                    }
                    // Single media item logic
                    else if (mediaSrc) {
                        // Auto-detect media type based on extension
                        if (mediaSrc.toLowerCase().endsWith('.mp4') || 
                            mediaSrc.toLowerCase().endsWith('.webm') || 
                            mediaSrc.toLowerCase().endsWith('.ogg')) {
                            // It's a video
                            mediaElement = document.createElement('video');
                            mediaElement.src = mediaSrc;
                            mediaElement.controls = true; 
                            mediaElement.textContent = itemData.altText || 'Your browser does not support the video tag.';
                        } else {
                            // Assume it's an image
                            mediaElement = document.createElement('img');
                            mediaElement.src = mediaSrc;
                            mediaElement.alt = itemData.altText || 'Portfolio image';
                        }
                    } else if (itemData.type !== 'desc') {
                         console.warn('Item missing mediaSrc:', itemData);
                    }

                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = itemData.description;

                    if (mediaElement) {
                        // Add click listener to open lightbox
                        mediaElement.addEventListener('click', () => openLightbox(itemData));
                        itemElement.appendChild(mediaElement);
                    }
                    itemElement.appendChild(descriptionElement);
                }

                rightContainer.appendChild(itemElement);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing portfolio items:', error);
            if (rightContainer) {
                rightContainer.innerHTML = '<p>Error loading portfolio items. Please try again later.</p>';
            }
        });
}); 

// --- Lightbox Functions --- //
let lightboxOverlay = null; // Keep track of the overlay element

function openLightbox(itemData) {
    // Create overlay div
    lightboxOverlay = document.createElement('div');
    lightboxOverlay.id = 'lightbox-overlay';

    // Create content container
    const lightboxContent = document.createElement('div');
    lightboxContent.id = 'lightbox-content';

    // Create close button
    const closeButton = document.createElement('span');
    closeButton.id = 'lightbox-close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = closeLightbox;

    // Populate content
    let contentElement;
    const mediaSrc = itemData.mediaSrc;

    if (Array.isArray(mediaSrc)) {
        // It's a slideshow
        contentElement = createSlideshow(mediaSrc, itemData.altText || 'Portfolio slideshow');
        contentElement.classList.add('lightbox-slideshow'); // Add class for specific styling
    } else if (mediaSrc) {
        // Single media item
        if (mediaSrc.toLowerCase().endsWith('.mp4') || 
            mediaSrc.toLowerCase().endsWith('.webm') || 
            mediaSrc.toLowerCase().endsWith('.ogg')) {
            // Video
            contentElement = document.createElement('video');
            contentElement.src = mediaSrc;
            contentElement.controls = true;
            contentElement.autoplay = true; // Optional: autoplay in lightbox
            contentElement.textContent = itemData.altText || 'Your browser does not support the video tag.';
        } else {
            // Image
            contentElement = document.createElement('img');
            contentElement.src = mediaSrc;
            contentElement.alt = itemData.altText || 'Portfolio image';
        }
    }

    if (contentElement) {
        lightboxContent.appendChild(contentElement);
    }

    lightboxOverlay.appendChild(closeButton);
    lightboxOverlay.appendChild(lightboxContent);

    // Close lightbox if clicking on the background overlay
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) { // Check if the click is on the overlay itself
            closeLightbox();
        }
    });

    document.body.appendChild(lightboxOverlay);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    if (lightboxOverlay) {
         // Stop any slideshow interval within the lightbox before removing
        const slideshow = lightboxOverlay.querySelector('.lightbox-slideshow');
        if (slideshow && typeof slideshow.stopAutoSlide === 'function') { // Check if stop function exists (added later)
            slideshow.stopAutoSlide();
        }
        
        // Stop any video playing
        const video = lightboxOverlay.querySelector('video');
        if (video) {
            video.pause();
        }

        document.body.removeChild(lightboxOverlay);
        lightboxOverlay = null;
        document.body.style.overflow = ''; // Restore background scrolling
    }
}

// --- Helper function to create slideshow --- //
function createSlideshow(imageUrls, altText) {
    const slideshowContainer = document.createElement('div');
    slideshowContainer.classList.add('slideshow-container');

    let currentSlideIndex = 0;
    let autoSlideInterval = null; // Variable to hold the interval ID

    // Create image elements
    const slides = imageUrls.map((url, index) => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        if (index === 0) slide.classList.add('active'); // Show first slide initially

        const img = document.createElement('img');
        img.src = url;
        img.alt = `${altText} - Slide ${index + 1}`;

        slide.appendChild(img);
        slideshowContainer.appendChild(slide);
        return slide;
    });

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    // Function to start automatic sliding
    function startAutoSlide() {
        // Clear existing interval before starting a new one
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        
        if (imageUrls.length > 1) { // Only auto-slide if there's more than one image
            autoSlideInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                showSlide(currentSlideIndex);
            }, 3000); // Change slide every 3 seconds
        }
    }

    // Function to stop automatic sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    // Expose the stop function on the container element
    slideshowContainer.stopAutoSlide = stopAutoSlide;

    // Create navigation buttons if more than one image
    if (imageUrls.length > 1) {
        const prevButton = document.createElement('button');
        prevButton.classList.add('slideshow-prev');
        prevButton.innerHTML = '&#10094;'; // Left arrow
        prevButton.onclick = () => {
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            showSlide(currentSlideIndex);
        };

        const nextButton = document.createElement('button');
        nextButton.classList.add('slideshow-next');
        nextButton.innerHTML = '&#10095;'; // Right arrow
        nextButton.onclick = () => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            showSlide(currentSlideIndex);
        };

        slideshowContainer.appendChild(prevButton);
        slideshowContainer.appendChild(nextButton);

        // Pause auto-slide on hover
        slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
        slideshowContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // Start automatic sliding initially
    startAutoSlide();

    return slideshowContainer;
} 