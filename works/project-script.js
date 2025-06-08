// Get project ID from URL parameters
function getProjectId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load project data
async function loadProjectData() {
    try {
        const response = await fetch('projects-data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading projects data:', error);
        return null;
    }
}

// Populate project content
function populateProject(project) {
    // Update page title
    document.getElementById('page-title').textContent = `${project.title} - A.M.`;
    
    // Update hero section
    document.getElementById('project-thumbnail').src = project.thumbnail;
    document.getElementById('project-thumbnail').alt = project.title;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-subtitle').textContent = project.subtitle;
    
    // Update description
    const descriptionContent = document.getElementById('project-description-content');
    descriptionContent.innerHTML = '';
    project.description.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        descriptionContent.appendChild(p);
    });
    
    // Update details (horizontal layout without labels)
    document.getElementById('project-details-content').innerHTML = `${project.year}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${project.client}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${project.role}`;
}

// Create gallery items
function createGallery(media) {
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = '';
    
    media.forEach((item, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = `media-item ${item.size || ''}`;
        
        if (item.type === 'image') {
            mediaItem.innerHTML = `
                <img src="${item.url}" alt="${item.caption || ''}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.innerHTML='<span style=&quot;color:#999; font-style:italic;&quot;>Immagine non disponibile</span>'">
                <p class="media-caption">${item.caption || ''}</p>
            `;
        } else if (item.type === 'video') {
            mediaItem.innerHTML = `
                <video controls poster="${item.poster || ''}">
                    <source src="${item.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <p class="media-caption">${item.caption || ''}</p>
            `;
        } else if (item.type === 'pdf') {
            const pdfId = `pdf-slideshow-${index}`;
            mediaItem.classList.add('pdf');
            mediaItem.innerHTML = `
                <div class="pdf-slideshow" id="${pdfId}">
                    <div class="pdf-loading">Caricamento PDF...</div>
                </div>
                <p class="media-caption">${item.caption || ''}</p>
            `;
            
            // Initialize PDF slideshow
            setTimeout(() => initPDFSlideshow(item.url, pdfId, item.duration || 3), 100);
        }
        
        galleryGrid.appendChild(mediaItem);
    });
}

// Show error state
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
}

// Show main content
function showContent() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
}

// Initialize PDF slideshow
async function initPDFSlideshow(pdfUrl, containerId, duration) {
    const container = document.getElementById(containerId);
    
    try {
        // Configure PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        
        // Load PDF with CORS handling
        const loadingTask = pdfjsLib.getDocument({
            url: pdfUrl,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true,
            disableAutoFetch: true,
            disableStream: true
        });
        const pdf = await loadingTask.promise;
        
        const totalPages = pdf.numPages;
        let currentPage = 1;
        
        // Clear loading message
        container.innerHTML = '';
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page';
        container.appendChild(canvas);
        
        const context = canvas.getContext('2d');
        
        // Function to render a page
        async function renderPage(pageNum) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1 });
            
            // Calculate scale to fit container width
            const containerWidth = container.offsetWidth;
            const scale = containerWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale });
            
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            
            const renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            
            await page.render(renderContext).promise;
        }
        
        // Start slideshow
        async function startSlideshow() {
            await renderPage(currentPage);
            
            setInterval(async () => {
                currentPage = currentPage >= totalPages ? 1 : currentPage + 1;
                await renderPage(currentPage);
            }, duration * 1000);
        }
        
        startSlideshow();
        
    } catch (error) {
        console.error('Error loading PDF:', error);
        
        // Provide more specific error messages
        let errorMessage = 'Errore nel caricamento del PDF';
        if (error.message && error.message.includes('CORS')) {
            errorMessage = 'PDF non accessibile (CORS). Usa un servizio che supporta il cross-origin.';
        } else if (error.message && error.message.includes('404')) {
            errorMessage = 'PDF non trovato (404)';
        } else if (error.message && error.message.includes('Load failed')) {
            errorMessage = 'PDF non accessibile. Verifica URL o permessi CORS.';
        }
        
        container.innerHTML = `
            <div class="pdf-loading">
                <p>${errorMessage}</p>
                <small style="display: block; margin-top: 0.5rem; color: #999;">
                    Per risolvere: usa servizi come GitHub Pages, Google Drive (link diretto), o altri servizi con CORS abilitato
                </small>
            </div>
        `;
    }
}

// Main initialization
async function init() {
    const projectId = getProjectId();
    
    if (!projectId) {
        showError();
        return;
    }
    
    const projectsData = await loadProjectData();
    
    if (!projectsData || !projectsData.projects) {
        showError();
        return;
    }
    
    const project = projectsData.projects.find(p => p.id === projectId);
    
    if (!project) {
        showError();
        return;
    }
    
    // Populate content
    populateProject(project);
    createGallery(project.media || []);
    
    // Show content
    showContent();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 