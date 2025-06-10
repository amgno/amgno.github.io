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

// Create minimal project item HTML
function createProjectItem(project) {
    return `
        <div class="project-item">
            <div class="project-link" data-project-id="${project.id}">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
                    ${project.subtitle}
                    <span class="project-year">${project.year}</span>
                </div>
            </div>
        </div>
    `;
}

// Render projects list
function renderProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="loading">Nessun progetto disponibile al momento.</div>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => createProjectItem(project)).join('');
    
    // Add click listeners for modal
    addProjectClickListeners();
}

// Add click listeners to project items
function addProjectClickListeners() {
    const projectLinks = document.querySelectorAll('.project-link[data-project-id]');
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
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
    
    // Add project media
    if (project.media && Array.isArray(project.media)) {
        mediaArray.push(...project.media);
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
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '<div class="loading">Caricamento progetti...</div>';
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
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
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
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '<div class="loading">Errore nel caricamento dei progetti.</div>';
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