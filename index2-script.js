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

// Populate modal with project data
function populateModal(project) {
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
    
    // Media
    const mediaContainer = document.getElementById('modal-media');
    if (project.thumbnail) {
        mediaContainer.innerHTML = `<img src="${project.thumbnail}" alt="${project.title}" />`;
    } else {
        mediaContainer.innerHTML = '<div class="media-placeholder">Nessuna media disponibile</div>';
    }
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