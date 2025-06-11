// Load projects data
async function loadProjectsData() {
    try {
        const response = await fetch('./works/projects-data.json');
        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error('Error loading projects data:', error);
        return [];
    }
}

// Create project item HTML - minimal style
function createProjectCard(project, index) {
    return `
        <div class="project-item" data-project-id="${project.id}">
            <div class="project-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="project-content">
                <div class="project-title">${project.title}</div>
                ${project.subtitle ? `<div class="project-subtitle">${project.subtitle}</div>` : ''}
                <div class="project-meta">
                    <span class="project-year">${project.year}</span>
                    ${project.category ? `<span class="project-type">${project.category}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Render projects grid
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<div class="loading">Nessun progetto disponibile al momento.</div>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map((project, index) => createProjectCard(project, index)).join('');
    
    // Add click listeners for modal
    addProjectClickListeners();
}

// Add click listeners to project items
function addProjectClickListeners() {
    const projectItems = document.querySelectorAll('.project-item[data-project-id]');
    projectItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const projectId = e.currentTarget.getAttribute('data-project-id');
            openProjectModal(projectId);
        });
    });
}

// Find project by ID
function findProjectById(projectId) {
    return window.projectsData?.find(project => project.id === projectId) || null;
}

// Open project modal
function openProjectModal(projectId) {
    const project = findProjectById(projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    // Populate modal content
    populateModal(project);
    
    // Show modal
    const modal = document.getElementById('project-modal');
    modal.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Global variables for media gallery
let currentProject = null;
let currentMediaIndex = 0;

// Global variables for modal interactions
let isDragging = false;
let isResizing = false;

// Configuration for PDF pages display
const PDF_CONFIG = {
    maxPages: 10, // Default number of pages to show, can be overridden per project
    pageImageQuality: 1.5 // Quality multiplier for PDF page images
};

// Process PDF media to create individual page objects
function processPDFPages(pdfMedia) {
    const pages = [];
    const maxPages = pdfMedia.maxPages || PDF_CONFIG.maxPages;
    
    // Create page objects for PDF
    for (let i = 1; i <= maxPages; i++) {
        pages.push({
            type: 'pdf-page',
            url: pdfMedia.url,
            pageNumber: i,
            caption: `${pdfMedia.caption || 'Documento PDF'} - Pagina ${i}`,
            originalPdf: pdfMedia,
            isPdfPage: true
        });
    }
    
    return pages;
}

// Render PDF page using PDF.js
async function renderPDFPage(media, container) {
    try {
        // Load PDF.js if not already loaded
        if (!window.pdfjsLib) {
            await loadPDFJS();
        }
        
        // Load PDF document
        const pdf = await window.pdfjsLib.getDocument(media.url).promise;
        
        // Get the specific page
        const page = await pdf.getPage(media.pageNumber);
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Calculate scale to fit container
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = container.clientWidth || 600;
        const scale = (containerWidth / viewport.width) * PDF_CONFIG.pageImageQuality;
        const scaledViewport = page.getViewport({ scale });
        
        // Set canvas dimensions
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        
        // Render page
        const renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        
        await page.render(renderContext).promise;
        
        // Replace loading content with rendered page
        container.innerHTML = '';
        canvas.className = 'pdf-page-canvas';
        container.appendChild(canvas);
        
        // Add click handler to open full PDF
        canvas.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(media.url, '_blank');
        });
        
    } catch (error) {
        console.error('Error rendering PDF page:', error);
        container.innerHTML = `
            <div class="pdf-error">
                <div class="thumb-icon">📄</div>
                <div>Errore nel caricamento della pagina ${media.pageNumber}</div>
                <small>Clicca per aprire il PDF completo</small>
            </div>
        `;
        
        // Add click handler to open full PDF on error
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(media.url, '_blank');
        });
    }
}

// Load PDF.js library
async function loadPDFJS() {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.pdfjsLib) {
            resolve();
            return;
        }
        
        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            // Configure PDF.js worker
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Populate modal with project data
function populateModal(project) {
    currentProject = project;
    currentMediaIndex = 0;
    
    // Title and subtitle
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-subtitle').textContent = project.subtitle;
    
    // Description
    const descriptionContainer = document.getElementById('modal-description-content');
    if (project.description && Array.isArray(project.description)) {
        descriptionContainer.innerHTML = project.description
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
    } else {
        descriptionContainer.innerHTML = '<p>Nessuna descrizione disponibile.</p>';
    }
    
    // Details
    const detailsContainer = document.getElementById('modal-details');
    const details = [];
    if (project.year) details.push(`Anno: ${project.year}`);
    if (project.client) details.push(`Cliente: ${project.client}`);
    if (project.role) details.push(`Ruolo: ${project.role}`);
    
    detailsContainer.innerHTML = details.join('<br>');
    
    // Media Gallery
    setupMediaGallery(project);
}

// Setup media gallery
function setupMediaGallery(project) {
    const mediaArray = [];
    
    // Add thumbnail as first media
    if (project.thumbnail) {
        mediaArray.push({
            type: 'image',
            url: project.thumbnail,
            caption: 'Anteprima progetto'
        });
    }
    
    // Organize media by type: videos first, then images, then PDFs
    if (project.media && Array.isArray(project.media)) {
        const videos = [];
        const images = [];
        const pdfs = [];
        
        project.media.forEach(media => {
            if (media.type === 'video') {
                videos.push(media);
            } else if (media.type === 'pdf') {
                // Process PDF to create pages array
                const pdfPages = processPDFPages(media);
                pdfs.push(...pdfPages);
            } else {
                images.push(media);
            }
        });
        
        // Add in order: videos (second position), images, then PDF pages
        mediaArray.push(...videos, ...images, ...pdfs);
    }
    
    if (mediaArray.length === 0) {
        document.getElementById('media-content').innerHTML = '<div class="media-placeholder">Nessuna media disponibile</div>';
        document.getElementById('media-thumbnails').innerHTML = '';
        return;
    }
    
    // Render thumbnails
    renderMediaThumbnails(mediaArray);
    
    // Show first media
    showMedia(0, mediaArray);
    
    // Setup navigation
    setupMediaNavigation(mediaArray);
}

// Render media thumbnails
function renderMediaThumbnails(mediaArray) {
    const thumbnailsContainer = document.getElementById('media-thumbnails');
    
    // Add has-more class if more than 5 thumbnails
    if (mediaArray.length > 5) {
        thumbnailsContainer.classList.add('has-more');
    } else {
        thumbnailsContainer.classList.remove('has-more');
    }
    
    thumbnailsContainer.innerHTML = mediaArray.map((media, index) => {
        const isActive = index === currentMediaIndex ? 'active' : '';
        
        if (media.type === 'image') {
            return `
                <div class="media-thumbnail ${isActive}" data-index="${index}">
                    <img src="${media.url}" alt="Media ${index + 1}" />
                </div>
            `;
        } else if (media.type === 'video') {
            return `
                <div class="media-thumbnail ${isActive}" data-index="${index}">
                    <div class="thumb-icon">▶</div>
                </div>
            `;
        } else if (media.type === 'pdf') {
            return `
                <div class="media-thumbnail ${isActive}" data-index="${index}">
                    <div class="thumb-icon">📄</div>
                </div>
            `;
        } else if (media.type === 'pdf-page') {
            return `
                <div class="media-thumbnail pdf-page-thumb ${isActive}" data-index="${index}">
                    <div class="thumb-icon">📄</div>
                    <div class="page-number">${media.pageNumber}</div>
                </div>
            `;
        }
        return '';
    }).join('');
    
    // Add click listeners to thumbnails
    thumbnailsContainer.querySelectorAll('.media-thumbnail').forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentMediaIndex = index;
            showMedia(index, mediaArray);
            updateThumbnailsActive();
        });
    });
}

// Show specific media
function showMedia(index, mediaArray) {
    const media = mediaArray[index];
    const mediaContent = document.getElementById('media-content');
    const captionOverlay = document.getElementById('media-caption-overlay');
    
    // Remove all previous event listeners by cloning the element
    const newMediaContent = mediaContent.cloneNode(false);
    mediaContent.parentNode.replaceChild(newMediaContent, mediaContent);
    
    // Update caption overlay
    if (media.caption || media.type) {
        const captionText = media.caption || (() => {
            switch(media.type) {
                case 'image': return `Immagine ${index + 1}`;
                case 'video': return `Video ${index + 1}`;
                case 'pdf': return 'Documento PDF';
                case 'pdf-page': return `Documento PDF - Pagina ${media.pageNumber}`;
                default: return 'Media';
            }
        })();
        
        captionOverlay.textContent = captionText;
        captionOverlay.classList.add('visible');
    } else {
        captionOverlay.classList.remove('visible');
    }
    
    if (media.type === 'image') {
        newMediaContent.innerHTML = `<img src="${media.url}" alt="${media.caption || 'Project image'}" />`;
    } else if (media.type === 'video') {
        newMediaContent.innerHTML = `
            <video controls>
                <source src="${media.url}" type="video/mp4">
                Il tuo browser non supporta i video.
            </video>
        `;
    } else if (media.type === 'pdf') {
        newMediaContent.innerHTML = `
            <div class="pdf-viewer" data-url="${media.url}">
                📄 ${media.caption || 'Documento PDF'}
                <br><small>Clicca per aprire</small>
            </div>
        `;
        
        // Add click to open PDF only to the PDF viewer element
        const pdfViewer = newMediaContent.querySelector('.pdf-viewer');
        pdfViewer.addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(media.url, '_blank');
        });
    } else if (media.type === 'pdf-page') {
        // Show loading state
        newMediaContent.innerHTML = `
            <div class="pdf-page-loading">
                <div class="loading-spinner"></div>
                <div>Caricamento pagina ${media.pageNumber}...</div>
            </div>
        `;
        
        // Render PDF page
        renderPDFPage(media, newMediaContent);
    } else {
        newMediaContent.innerHTML = '<div class="media-placeholder">Formato media non supportato</div>';
    }
}

// Update active thumbnail
function updateThumbnailsActive() {
    document.querySelectorAll('.media-thumbnail').forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentMediaIndex);
    });
}

// Setup media navigation
function setupMediaNavigation(mediaArray) {
    const prevBtn = document.getElementById('media-prev');
    const nextBtn = document.getElementById('media-next');
    
    // Update navigation buttons
    function updateNavigation() {
        prevBtn.disabled = currentMediaIndex === 0;
        nextBtn.disabled = currentMediaIndex === mediaArray.length - 1;
        
        // Hide navigation if only one media
        const navigation = document.querySelector('.media-navigation');
        navigation.style.display = mediaArray.length <= 1 ? 'none' : 'flex';
    }
    
    // Previous media
    prevBtn.onclick = () => {
        if (currentMediaIndex > 0) {
            currentMediaIndex--;
            showMedia(currentMediaIndex, mediaArray);
            updateThumbnailsActive();
            updateNavigation();
        }
    };
    
    // Next media
    nextBtn.onclick = () => {
        if (currentMediaIndex < mediaArray.length - 1) {
            currentMediaIndex++;
            showMedia(currentMediaIndex, mediaArray);
            updateThumbnailsActive();
            updateNavigation();
        }
    };
    
    updateNavigation();
}

// Show loading state
function showLoading() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading">Caricamento progetti...</div>';
}

// Handle smooth scrolling for works link
function initSmoothScrolling() {
    const worksLink = document.querySelector('a[href="#works"]');
    if (worksLink) {
        worksLink.addEventListener('click', (e) => {
            e.preventDefault();
            const worksSection = document.getElementById('works');
            if (worksSection) {
                worksSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Initialize modal event listeners
function initModalListeners() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    
    // Close button
    closeBtn.addEventListener('click', closeProjectModal);
    
    // Click outside to close - but not during interactions
    modal.addEventListener('click', (e) => {
        // Don't close if we're dragging or resizing
        if (isDragging || isResizing) return;
        
        // Don't close if clicking on modal content or its children
        if (e.target.closest('.modal-content')) return;
        
        // Only close if clicking on the overlay itself
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });
    
    // Initialize modal resizing and dragging
    initModalInteractions();
}

// Initialize modal dragging and custom resizing
function initModalInteractions() {
    const modalContent = document.querySelector('.modal-content');
    const modalHeader = document.querySelector('.modal-header');
    
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    
    // Make modal draggable by header
    if (modalHeader) {
        modalHeader.style.cursor = 'move';
        
        modalHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.modal-close')) return;
            
            isDragging = true;
            const rect = modalContent.getBoundingClientRect();
            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;
            
            modalContent.style.position = 'fixed';
            modalContent.style.left = rect.left + 'px';
            modalContent.style.top = rect.top + 'px';
            modalContent.style.margin = '0';
            modalContent.style.transform = 'none';
            
            e.preventDefault();
            e.stopPropagation();
        });
        
        // Prevent modal close when clicking on header
        modalHeader.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // Add custom resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'modal-resize-handle';
    modalContent.appendChild(resizeHandle);
    
    // Resize functionality
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        const rect = modalContent.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Prevent modal close when clicking on resize handle
    resizeHandle.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Mouse move handler for dragging and resizing
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            modalContent.classList.add('dragging');
            // Keep modal within viewport bounds
            const newLeft = Math.max(0, Math.min(window.innerWidth - modalContent.offsetWidth, e.clientX - startX));
            const newTop = Math.max(0, Math.min(window.innerHeight - modalContent.offsetHeight, e.clientY - startY));
            
            modalContent.style.left = newLeft + 'px';
            modalContent.style.top = newTop + 'px';
        }
        
        if (isResizing) {
            modalContent.classList.add('resizing');
            // Allow resizing beyond viewport if needed, user can scroll
            const newWidth = Math.max(600, startWidth + (e.clientX - startX));
            const newHeight = Math.max(400, startHeight + (e.clientY - startY));
            
            modalContent.style.width = newWidth + 'px';
            modalContent.style.height = newHeight + 'px';
        }
    });
    
    // Mouse up handler
    document.addEventListener('mouseup', () => {
        if (isDragging || isResizing) {
            modalContent.classList.remove('dragging', 'resizing');
            
            // Small delay to prevent accidental clicks from closing modal
            setTimeout(() => {
                isDragging = false;
                isResizing = false;
            }, 100);
        } else {
            isDragging = false;
            isResizing = false;
        }
    });
    
    // Store original close function and override it
    const originalCloseModal = closeProjectModal;
    
    // Override global close function
    window.closeProjectModal = function() {
        // Reset modal styles
        modalContent.style.position = '';
        modalContent.style.left = '';
        modalContent.style.top = '';
        modalContent.style.margin = '';
        modalContent.style.transform = '';
        modalContent.style.width = '';
        modalContent.style.height = '';
        
        // Call original close function
        originalCloseModal();
    };
}

// Initialize everything
async function init() {
    try {
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        // Initialize modal listeners
        initModalListeners();
        
        // Load and render projects
        showLoading();
        const projects = await loadProjectsData();
        
        // Store projects globally for modal access
        window.projectsData = projects;
        
        renderProjects(projects);
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '<div class="loading">Errore nel caricamento dei progetti.</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Hide scroll indicator when scrolling
window.addEventListener('scroll', () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const scrolled = window.pageYOffset;
        const opacity = Math.max(0, 1 - scrolled / 200);
        scrollIndicator.style.opacity = opacity;
    }
}); 