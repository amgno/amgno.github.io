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
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
            loadProjects();
        } else {
            showNotification('Incorrect password', true);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('Login failed', true);
    });
}

function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-box';
        projectDiv.innerHTML = `
            <div class="project-header" onclick="toggleProject(${index})">
                <h3>Project ${project.number}: ${project.name}</h3>
            </div>
            <div class="project-content" id="project-content-${index}">
                <div class="project-content-wrapper">
                    ${Object.entries(project).map(([key, value]) => {
                        if (key === 'description') {
                            return `
                                <label for="${index}-${key}">
                                    ${key}: 
                                    <textarea id="${index}-${key}">${value}</textarea>
                                </label>
                            `;
                        } else if (key === 'images') {
                            return `
                                <label>
                                    ${key}: 
                                    <input type="text" id="${index}-${key}" value="${value.join(', ')}">
                                    <input type="file" id="${index}-${key}-upload" multiple accept="image/*">
                                    <button onclick="uploadFiles(${index}, 'images')">Upload Images</button>
                                </label>
                            `;
                        } else if (key === 'pdf') {
                            return `
                                <label>
                                    ${key}: 
                                    <input type="text" id="${index}-${key}" value="${value}">
                                    <input type="file" id="${index}-${key}-upload" accept="application/pdf">
                                    <button onclick="uploadFiles(${index}, 'pdf')">Upload PDF</button>
                                </label>
                            `;
                        } else {
                            return `
                                <label for="${index}-${key}">
                                    ${key}: 
                                    <input type="text" id="${index}-${key}" value="${value}">
                                </label>
                            `;
                        }
                    }).join('')}
                    <div class="project-actions">
                        <button onclick="deleteProject(${index})">Delete Project</button>
                        <button onclick="showImageManagement(${index})">Manage Images</button>
                    </div>
                </div>
            </div>
        `;
        projectsList.appendChild(projectDiv);
    });
}

function addProject() {
    projects.push({
        number: String(projects.length + 1).padStart(2, '0'),
        name: 'New Project',
        description: '',
        ptype: '',
        tools: '',
        date: '',
        images: [],
        pdf: '',
        video: '',
        bgcolor: ''
    });
    loadProjects();
    saveProjects(); // Automatically save the new project
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects.splice(index, 1);
        loadProjects();
    }
}

function saveProjects() {
    projects.forEach((project, index) => {
        Object.keys(project).forEach(key => {
            const input = document.getElementById(`${index}-${key}`);
            if (input) {
                if (key === 'images') {
                    const images = input.value.split(',').map(img => img.trim()).filter(img => img !== '');
                    project[key] = images.length > 0 ? images : [];
                } else {
                    project[key] = input.value;
                }
            }
        });
    });

    const projectsString = `const projects = ${JSON.stringify(projects, null, 2)};`;
    const password = document.getElementById('password').value;
    
    fetch('/save-projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, projects: projectsString }),
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
    const formData = new FormData();
    formData.append('projectIndex', currentProjectIndex);
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    const progressBar = document.getElementById('upload-progress');
    const progressText = document.getElementById('upload-progress-text');
    const progressContainer = document.getElementById('upload-progress-container');

    progressContainer.style.display = 'block';
    progressBar.value = 0;
    progressText.textContent = '0%';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressBar.value = percentComplete;
            progressText.textContent = percentComplete.toFixed(2) + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
                showNotification('Files uploaded successfully!');
                projects[currentProjectIndex].images = projects[currentProjectIndex].images.concat(response.files);
                showImageManagement(currentProjectIndex);
            } else {
                showNotification('Error uploading files: ' + (response.message || 'Unknown error'), true);
            }
        } else {
            showNotification('Error uploading files', true);
        }
        progressContainer.style.display = 'none';
    };

    xhr.onerror = function() {
        console.error('Error:', xhr.status);
        showNotification('Error uploading files', true);
        progressContainer.style.display = 'none';
    };

    xhr.send(formData);
}

function toggleProject(index) {
    const content = document.getElementById(`project-content-${index}`);
    content.classList.toggle('active');
}

let currentProjectIndex = -1;

function showImageManagement(index) {
    currentProjectIndex = index;
    const project = projects[currentProjectIndex];
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';

    project.images.forEach((image, imgIndex) => {
        const imgElement = document.createElement('div');
        imgElement.className = 'image-preview-item';
        imgElement.innerHTML = `
            <img src="${image}" alt="Project Image">
            <button onclick="deleteImage(${imgIndex})">Delete</button>
        `;
        imagePreview.appendChild(imgElement);
    });

    document.getElementById('image-management-widget').style.display = 'block';
}

function closeImageManagement() {
    document.getElementById('image-management-widget').style.display = 'none';
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
});