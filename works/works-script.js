// Load projects data
async function loadProjectsData() {
    try {
        const response = await fetch('projects-data.json');
        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error('Error loading projects data:', error);
        return [];
    }
}

// Create project card HTML
function createProjectCard(project) {
    return `
        <a href="project.html?id=${project.id}" class="project-card">
            <img src="${project.thumbnail}" alt="${project.title}" class="project-thumbnail" loading="lazy">
            <div class="project-info">
                <h2 class="project-title">${project.title}</h2>
                <p class="project-subtitle">${project.subtitle}</p>
                <p class="project-year">${project.year}</p>
            </div>
        </a>
    `;
}

// Render projects grid
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>Nessun progetto disponibile al momento.</p>';
        return;
    }
    
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
}

// Show loading state
function showLoading() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '<div class="loading"><p>Caricamento progetti...</p></div>';
}

// Main initialization
async function init() {
    showLoading();
    
    try {
        const projects = await loadProjectsData();
        renderProjects(projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
        const projectsGrid = document.getElementById('projects-grid');
        projectsGrid.innerHTML = '<p>Errore nel caricamento dei progetti.</p>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 