const PASSWORD = 'your_secure_password_here';

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
            alert('Incorrect password');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Login failed');
    });
}

function loadProjects() {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        projectDiv.innerHTML = `
            <h3>Project ${project.number}: ${project.name}</h3>
            ${Object.entries(project).map(([key, value]) => `
                <label>
                    ${key}: 
                    <input type="text" id="${index}-${key}" value="${Array.isArray(value) ? value.join(', ') : value}">
                </label>
            `).join('')}
            <div class="project-actions">
                <button onclick="deleteProject(${index})">Delete Project</button>
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
            alert('Projects saved successfully!');
        } else {
            alert('Error saving projects: ' + (data.message || 'Unknown error'));
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error saving projects');
    });
}