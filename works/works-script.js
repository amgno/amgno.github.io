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

// Create minimal project item HTML
function createProjectItem(project) {
    return `
        <div class="project-item">
            <a href="project.html?id=${project.id}" class="project-link">
                <div class="project-title">${project.title}</div>
                <div class="project-meta">
                    ${project.subtitle}
                    <span class="project-year">${project.year}</span>
                </div>
            </a>
        </div>
    `;
}

// Render minimal projects list
function renderProjects(projects) {
    const projectsList = document.getElementById('projects-list');
    
    if (projects.length === 0) {
        projectsList.innerHTML = '<div class="loading">Nessun progetto disponibile al momento.</div>';
        return;
    }
    
    projectsList.innerHTML = projects.map(project => createProjectItem(project)).join('');
}

// Show minimal loading state
function showLoading() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '<div class="loading">Caricamento progetti...</div>';
}

// Simple initialization
async function init() {
    try {
        showLoading();
        const projects = await loadProjectsData();
        renderProjects(projects);
        
        // Update page title with projects count
        if (projects.length > 0) {
            document.title = `Works (${projects.length}) - A.M.`;
        }
        
    } catch (error) {
        console.error('Failed to load projects:', error);
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '<div class="loading">Errore nel caricamento dei progetti.</div>';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add smooth scrolling for navigation
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}); 