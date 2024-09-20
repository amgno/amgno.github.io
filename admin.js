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
                    project[key] = input.value.split(',').map(img => img.trim());
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

function uploadFiles(index, type) {
    const fileInput = document.getElementById(`${index}-${type}-upload`);
    const files = fileInput.files;
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append('projectIndex', index);
    formData.append('type', type);
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Files uploaded successfully!');
            // Update the project data
            if (type === 'images') {
                projects[index].images = data.files;
            } else if (type === 'pdf') {
                projects[index].pdf = data.files[0];
            }
            loadProjects(); // Reload the projects to reflect the changes
        } else {
            showNotification('Error uploading files: ' + (data.message || 'Unknown error'), true);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showNotification('Error uploading files', true);
    });
}

function toggleProject(index) {
    const content = document.getElementById(`project-content-${index}`);
    content.classList.toggle('active');
}