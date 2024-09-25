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
            displayProjects();
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

    displayProjects();
});