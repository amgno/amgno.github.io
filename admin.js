const PASSWORD = 'your_secure_password_here';

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `notification ${isError ? 'error' : 'success'}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

function login() {
    const password = document.getElementById('password').value;
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            handleLoginSuccess();
        } else {
            showNotification('Incorrect password', true);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('Login failed', true);
    });
}

let currentOpenProject = null;

function displayProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';

    projects.forEach((project, index) => {
        const projectBox = document.createElement('div');
        projectBox.className = 'project-box';

        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';
        projectHeader.innerHTML = `<h3>${project.number} - ${project.name}</h3><span>▼</span>`;
        projectHeader.addEventListener('click', () => toggleProject(index));

        const projectContent = document.createElement('div');
        projectContent.className = 'project-content';
        projectContent.innerHTML = `
            <div class="project-content-wrapper">
                <label>
                    Number:
                    <input type="text" id="project-${index}-number" value="${project.number}">
                </label>
                <label>
                    Name:
                    <input type="text" id="project-${index}-name" value="${project.name}">
                </label>
                <label>
                    Type:
                    <input type="text" id="project-${index}-ptype" value="${project.ptype}">
                </label>
                <label>
                    Tools:
                    <input type="text" id="project-${index}-tools" value="${project.tools}">
                </label>
                <label>
                    Date:
                    <input type="text" id="project-${index}-date" value="${project.date}">
                </label>
                <label>
                    Background Color:
                    <input type="color" id="project-${index}-bgcolor" value="${project.bgcolor}">
                </label>
                <label>
                    Description:
                    <textarea id="project-${index}-description">${project.description}</textarea>
                </label>
            </div>
            <div class="project-actions">
                <button onclick="showImageManagement(${index})">Manage Images</button>
                <button onclick="deleteProject(${index})">Delete Project</button>
            </div>
        `;

        projectBox.appendChild(projectHeader);
        projectBox.appendChild(projectContent);
        projectsList.appendChild(projectBox);
    });
}

function toggleProject(index) {
    const projectContent = document.querySelectorAll('.project-content')[index];
    const projectHeader = document.querySelectorAll('.project-header')[index];

    if (currentOpenProject !== null && currentOpenProject !== index) {
        const currentOpenContent = document.querySelectorAll('.project-content')[currentOpenProject];
        const currentOpenHeader = document.querySelectorAll('.project-header')[currentOpenProject];
        currentOpenContent.classList.remove('active');
        currentOpenHeader.querySelector('span').textContent = '▼';
    }

    projectContent.classList.toggle('active');
    projectHeader.querySelector('span').textContent = projectContent.classList.contains('active') ? '▲' : '▼';

    currentOpenProject = projectContent.classList.contains('active') ? index : null;
}

function addProject() {
    const newProject = {
        number: String(projects.length + 1).padStart(2, '0'),
        name: 'New Project',
        description: '',
        ptype: '',
        tools: '',
        date: '',
        images: [],
        pdf: '',
        bgcolor: '#ffffff'
    };

    projects.push(newProject);
    displayProjects();
    toggleProject(projects.length - 1);
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects.splice(index, 1);
        displayProjects();
        saveProjects();
    }
}

function saveProjects() {
    projects.forEach((project, index) => {
        project.number = document.getElementById(`project-${index}-number`).value;
        project.name = document.getElementById(`project-${index}-name`).value;
        project.ptype = document.getElementById(`project-${index}-ptype`).value;
        project.tools = document.getElementById(`project-${index}-tools`).value;
        project.date = document.getElementById(`project-${index}-date`).value;
        project.bgcolor = document.getElementById(`project-${index}-bgcolor`).value;
        project.description = document.getElementById(`project-${index}-description`).value;
    });

    fetch('/save-projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projects),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Projects saved successfully!');
        } else {
            showNotification('Error saving projects: ' + (data.message || 'Unknown error'), true);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('Error saving projects', true);
    });
}

function uploadFiles(files) {
    if (!files || files.length === 0) {
        showNotification('No files selected', true);
        return;
    }

    const formData = new FormData();
    formData.append('projectIndex', currentProjectIndex);
    
    Array.from(files).forEach(file => {
        formData.append('files', file);
    });

    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress');
    const progressText = document.getElementById('upload-progress-text');

    progressContainer.style.display = 'block';
    progressBar.value = 0;
    progressText.textContent = '0%';

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Upload failed');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showNotification('Files uploaded successfully!');
            if (!projects[currentProjectIndex].images) {
                projects[currentProjectIndex].images = [];
            }
            projects[currentProjectIndex].images = projects[currentProjectIndex].images.concat(data.files);
            showImageManagement(currentProjectIndex);
        } else {
            throw new Error(data.message || 'Upload failed');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showNotification(error.message || 'Error uploading files', true);
    })
    .finally(() => {
        progressContainer.style.display = 'none';
    });
}

let currentProjectIndex = -1;

function showImageManagement(projectIndex) {
    currentProjectIndex = projectIndex;
    
    // Clean up any existing overlay
    const existingOverlay = document.querySelector('.widget-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Create and add overlay
    const overlay = document.createElement('div');
    overlay.className = 'widget-overlay';
    document.body.appendChild(overlay);
    
    // Show widget
    const widget = document.getElementById('image-management-widget');
    widget.style.display = 'block';
    
    // Load project images
    const project = projects[projectIndex];
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';

    if (project.images && project.images.length > 0) {
        project.images.forEach((image, imgIndex) => {
            const imgElement = document.createElement('div');
            imgElement.className = 'image-preview-item';
            imgElement.innerHTML = `
                <img src="${image}" alt="Project Image">
                <button onclick="deleteImage(${imgIndex})">&times;</button>
            `;
            imagePreview.appendChild(imgElement);
        });
    } else {
        imagePreview.innerHTML = '<p style="text-align: center; color: #666;">No images uploaded yet</p>';
    }

    // Initialize drag and drop with clean event listeners
    initializeDragAndDrop();

    // Add click handler to overlay for closing
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeImageManagement();
        }
    }, { once: true });
}

function closeImageManagement() {
    const widget = document.getElementById('image-management-widget');
    widget.style.display = 'none';
    
    // Remove overlay
    const overlay = document.querySelector('.widget-overlay');
    if (overlay) {
        overlay.remove();
    }
}

function initializeDragAndDrop() {
    const dropArea = document.getElementById('image-upload-area');
    const fileInput = document.getElementById('file-input');

    // Remove any existing event listeners
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);
    fileInput = newFileInput;

    // Make sure the click-to-upload works
    dropArea.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    // Handle file selection through the input
    fileInput.addEventListener('change', function(e) {
        e.preventDefault();
        const files = this.files;
        if (files.length > 0) {
            uploadFiles(files);
            // Reset the input
            this.value = '';
        }
    }, { once: true });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // Handle drag and drop
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFiles(files);
        }
    }, { once: true });

    // Visual feedback
    dropArea.addEventListener('dragenter', () => dropArea.classList.add('highlight'));
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));
}

function deleteImage(imgIndex) {
    if (confirm('Are you sure you want to delete this image?')) {
        const project = projects[currentProjectIndex];
        const imageToDelete = project.images[imgIndex];

        fetch('/delete-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                projectIndex: currentProjectIndex, 
                imagePath: imageToDelete 
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Image deleted successfully!');
                // Refresh the projects data
                fetch('/projects')
                    .then(response => response.json())
                    .then(updatedProjects => {
                        projects = updatedProjects;
                        showImageManagement(currentProjectIndex);
                    });
            } else {
                showNotification('Error deleting image: ' + (data.message || 'Unknown error'), true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            showNotification('Error deleting image', true);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('image-upload-area');
    const fileInput = document.getElementById('file-input');

    dropArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        uploadFiles(e.target.files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        uploadFiles(files);
    }

    displayProjects();
});

function loadProjects() {
    fetch('/projects')
        .then(response => response.json())
        .then(projects => {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = projects.map((project, index) => `
                <div class="project-box">
                    <div class="project-header" onclick="toggleProject(${index})">
                        <h3>${project.number} - ${project.name}</h3>
                        <span>▼</span>
                    </div>
                    <div class="project-content">
                        <div class="project-content-wrapper">
                            <label>
                                Number:
                                <input type="text" id="project-${index}-number" value="${project.number}">
                            </label>
                            <label>
                                Name:
                                <input type="text" id="project-${index}-name" value="${project.name}">
                            </label>
                            <label>
                                Type:
                                <input type="text" id="project-${index}-ptype" value="${project.ptype}">
                            </label>
                            <label>
                                Tools:
                                <input type="text" id="project-${index}-tools" value="${project.tools}">
                            </label>
                            <label>
                                Date:
                                <input type="text" id="project-${index}-date" value="${project.date}">
                            </label>
                            <label>
                                Background Color:
                                <input type="color" id="project-${index}-bgcolor" value="${project.bgcolor}">
                            </label>
                            <label>
                                Description:
                                <textarea id="project-${index}-description">${project.description}</textarea>
                            </label>
                        </div>
                        <div class="project-actions">
                            <button onclick="showImageManagement(${index})">Manage Images</button>
                            <button onclick="deleteProject(${index})">Delete Project</button>
                        </div>
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            alert('Error loading projects');
        });
}

function toggleProject(index) {
    const projectContent = document.querySelectorAll('.project-content')[index];
    const isActive = projectContent.classList.contains('active');
    
    // Close all project contents
    document.querySelectorAll('.project-content').forEach(content => {
        content.classList.remove('active');
    });

    // Toggle the clicked project
    if (!isActive) {
        projectContent.classList.add('active');
    }
}

function initializePhotoManagement() {
    const photoUploadForm = document.getElementById('photo-upload-form');
    const photosList = document.getElementById('photos-list');

    // Load existing photos
    function loadPhotos() {
        fetch('/photos-metadata')
            .then(response => response.json())
            .then(photos => {
                photosList.innerHTML = photos.map(photo => `
                    <div class="photo-item-admin" data-id="${photo.id}">
                        <img src="${photo.path}" alt="${photo.label}">
                        <div class="photo-info">
                            <p>${photo.label}</p>
                            <p>Year: ${photo.year}</p>
                        </div>
                        <button class="delete-btn" onclick="deletePhoto('${photo.id}')">&times;</button>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error loading photos:', error);
                showNotification('Error loading photos', true);
            });
    }

    // Handle photo upload
    photoUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(photoUploadForm);
        
        try {
            const response = await fetch('/upload-photo', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (result.success) {
                showNotification('Photo uploaded successfully');
                photoUploadForm.reset();
                loadPhotos();
            } else {
                showNotification('Error uploading photo', true);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error uploading photo', true);
        }
    });

    // Initialize photos list
    loadPhotos();
}

async function deletePhoto(id) {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    
    try {
        const response = await fetch(`/delete-photo/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            document.querySelector(`[data-id="${id}"]`).remove();
            showNotification('Photo deleted successfully');
        } else {
            showNotification('Error deleting photo', true);
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error deleting photo', true);
    }
}