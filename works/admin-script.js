let currentProjects = [];
let editingIndex = -1;

// Load existing projects
async function loadExistingProjects() {
    try {
        const response = await fetch('projects-data.json');
        const data = await response.json();
        currentProjects = data.projects || [];
        renderProjectsList();
        updateJSONOutput();
    } catch (error) {
        console.error('Error loading projects:', error);
        currentProjects = [];
        renderProjectsList();
    }
}

// Render projects list
function renderProjectsList() {
    const projectsList = document.getElementById('projects-list');
    
    if (currentProjects.length === 0) {
        projectsList.innerHTML = '<p>Nessun progetto trovato. Inizia aggiungendo il primo progetto!</p>';
        return;
    }
    
    projectsList.innerHTML = currentProjects.map((project, index) => `
        <div class="project-item">
            <div class="project-item-info">
                <h3>${project.title}</h3>
                <p>${project.subtitle} • ${project.year}</p>
            </div>
            <div class="project-item-actions">
                <button class="btn btn-secondary btn-small" onclick="editProject(${index})">Modifica</button>
                <button class="btn btn-danger btn-small" onclick="deleteProject(${index})">Elimina</button>
            </div>
        </div>
    `).join('');
}

// Show form for new project
function showNewProjectForm() {
    editingIndex = -1;
    document.getElementById('form-title').textContent = 'Nuovo Progetto';
    document.getElementById('form-section').style.display = 'block';
    document.getElementById('project-form').reset();
    document.getElementById('media-container').innerHTML = '';
    document.getElementById('project-form').scrollIntoView({ behavior: 'smooth' });
}

// Edit existing project
function editProject(index) {
    editingIndex = index;
    const project = currentProjects[index];
    
    document.getElementById('form-title').textContent = 'Modifica Progetto';
    document.getElementById('form-section').style.display = 'block';
    
    // Fill form with existing data
    document.getElementById('project-id').value = project.id;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-subtitle').value = project.subtitle;
    document.getElementById('project-thumbnail').value = project.thumbnail;
    document.getElementById('project-year').value = project.year;
    document.getElementById('project-client').value = project.client;
    document.getElementById('project-role').value = project.role;
    document.getElementById('project-description').value = project.description.join('\n\n');
    
    // Fill media
    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = '';
    if (project.media) {
        project.media.forEach(media => addMediaItem(media));
    }
    
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

// Delete project
function deleteProject(index) {
    if (confirm('Sei sicuro di voler eliminare questo progetto?')) {
        currentProjects.splice(index, 1);
        renderProjectsList();
        updateJSONOutput();
    }
}

// Add media item to form
function addMediaItem(mediaData = {}) {
    const mediaContainer = document.getElementById('media-container');
    const mediaIndex = mediaContainer.children.length;
    
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.innerHTML = `
        <select class="media-type" onchange="updateMediaType(this)">
            <option value="image" ${mediaData.type === 'image' ? 'selected' : ''}>Immagine</option>
            <option value="video" ${mediaData.type === 'video' ? 'selected' : ''}>Video</option>
            <option value="pdf" ${mediaData.type === 'pdf' ? 'selected' : ''}>PDF Slideshow</option>
        </select>
        <input type="url" class="media-url" placeholder="URL del media" value="${mediaData.url || ''}" required>
        <input type="text" class="media-caption" placeholder="Didascalia" value="${mediaData.caption || ''}">
        <select class="media-size">
            <option value="" ${!mediaData.size ? 'selected' : ''}>Normale</option>
            <option value="large" ${mediaData.size === 'large' ? 'selected' : ''}>Grande</option>
            <option value="wide" ${mediaData.size === 'wide' ? 'selected' : ''}>Largo</option>
        </select>
        <button type="button" class="btn btn-danger btn-small" onclick="removeMediaItem(this)">Rimuovi</button>
    `;
    
    // Add extra inputs based on media type
    if (mediaData.type === 'video') {
        const posterInput = document.createElement('input');
        posterInput.type = 'url';
        posterInput.className = 'media-poster';
        posterInput.placeholder = 'URL poster (opzionale)';
        posterInput.value = mediaData.poster || '';
        mediaItem.insertBefore(posterInput, mediaItem.children[2]);
    } else if (mediaData.type === 'pdf') {
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.className = 'pdf-duration';
        durationInput.placeholder = 'Durata per pagina (secondi)';
        durationInput.value = mediaData.duration || '3';
        durationInput.min = '1';
        durationInput.max = '10';
        mediaItem.insertBefore(durationInput, mediaItem.children[2]);
    }
    
    mediaContainer.appendChild(mediaItem);
}

// Update media type (add/remove poster input for videos and PDF settings)
function updateMediaType(select) {
    const mediaItem = select.parentElement;
    const mediaType = select.value;
    const existingPoster = mediaItem.querySelector('.media-poster');
    const existingDuration = mediaItem.querySelector('.pdf-duration');
    
    // Remove existing extra inputs
    if (existingPoster) existingPoster.remove();
    if (existingDuration) existingDuration.remove();
    
    if (mediaType === 'video') {
        const posterInput = document.createElement('input');
        posterInput.type = 'url';
        posterInput.className = 'media-poster';
        posterInput.placeholder = 'URL poster (opzionale)';
        mediaItem.insertBefore(posterInput, mediaItem.children[2]);
    } else if (mediaType === 'pdf') {
        const durationInput = document.createElement('input');
        durationInput.type = 'number';
        durationInput.className = 'pdf-duration';
        durationInput.placeholder = 'Durata per pagina (secondi)';
        durationInput.value = '3';
        durationInput.min = '1';
        durationInput.max = '10';
        mediaItem.insertBefore(durationInput, mediaItem.children[2]);
        
        // Update URL placeholder
        const urlInput = mediaItem.querySelector('.media-url');
        urlInput.placeholder = 'URL del PDF';
    } else {
        // Reset URL placeholder for images
        const urlInput = mediaItem.querySelector('.media-url');
        urlInput.placeholder = 'URL del media';
    }
}

// Remove media item
function removeMediaItem(button) {
    button.parentElement.remove();
}

// Hide form
function hideForm() {
    document.getElementById('form-section').style.display = 'none';
    editingIndex = -1;
}

// Collect form data
function collectFormData() {
    const mediaItems = Array.from(document.querySelectorAll('.media-item')).map(item => {
        const mediaData = {
            type: item.querySelector('.media-type').value,
            url: item.querySelector('.media-url').value,
            caption: item.querySelector('.media-caption').value
        };
        
        const sizeSelect = item.querySelector('.media-size');
        if (sizeSelect.value) {
            mediaData.size = sizeSelect.value;
        }
        
        const posterInput = item.querySelector('.media-poster');
        if (posterInput && posterInput.value) {
            mediaData.poster = posterInput.value;
        }
        
        const durationInput = item.querySelector('.pdf-duration');
        if (durationInput && durationInput.value) {
            mediaData.duration = parseInt(durationInput.value);
        }
        
        return mediaData;
    });
    
    const description = document.getElementById('project-description').value
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => p.trim());
    
    return {
        id: document.getElementById('project-id').value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        title: document.getElementById('project-title').value,
        subtitle: document.getElementById('project-subtitle').value,
        thumbnail: document.getElementById('project-thumbnail').value,
        year: document.getElementById('project-year').value,
        client: document.getElementById('project-client').value,
        role: document.getElementById('project-role').value,
        description: description,
        media: mediaItems
    };
}

// Save project
function saveProject() {
    const projectData = collectFormData();
    
    if (editingIndex >= 0) {
        currentProjects[editingIndex] = projectData;
    } else {
        currentProjects.push(projectData);
    }
    
    renderProjectsList();
    updateJSONOutput();
    hideForm();
}

// Update JSON output
function updateJSONOutput() {
    const jsonOutput = document.getElementById('json-output');
    const data = {
        projects: currentProjects
    };
    jsonOutput.value = JSON.stringify(data, null, 2);
}

// Copy JSON to clipboard
async function copyJSON() {
    const jsonOutput = document.getElementById('json-output');
    try {
        await navigator.clipboard.writeText(jsonOutput.value);
        const button = document.getElementById('copy-json-btn');
        const originalText = button.textContent;
        button.textContent = 'Copiato!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        jsonOutput.select();
        document.execCommand('copy');
    }
}

// Auto-generate ID from title
function autoGenerateId() {
    const title = document.getElementById('project-title').value;
    const id = title.toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[ñ]/g, 'n')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    if (id) {
        document.getElementById('project-id').value = id;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load existing projects
    loadExistingProjects();
    
    // Button event listeners
    document.getElementById('add-project-btn').addEventListener('click', showNewProjectForm);
    document.getElementById('add-media-btn').addEventListener('click', () => addMediaItem());
    document.getElementById('cancel-btn').addEventListener('click', hideForm);
    document.getElementById('copy-json-btn').addEventListener('click', copyJSON);
    
    // Form submission
    document.getElementById('project-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProject();
    });
    
    // Auto-generate ID when title changes
    document.getElementById('project-title').addEventListener('input', autoGenerateId);
}); 