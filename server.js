const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Use an environment variable for the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password';

app.use(express.json());
app.use(express.static(__dirname));

function getProjects() {
    const projectsFile = fs.readFileSync(path.join(__dirname, 'projects.js'), 'utf8');
    return JSON.parse(projectsFile.replace('const projects = ', '').replace(';', ''));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const projectIndex = req.body.projectIndex;
        const projects = getProjects();
        const project = projects[projectIndex];
        let dir;
        if (file.mimetype === 'application/pdf') {
            dir = `./works/${project.number} - ${project.name}`;
        } else {
            dir = `./works/${project.number} - ${project.name}/images`;
        }
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.post('/upload', upload.array('files'), (req, res) => {
    const projectIndex = req.body.projectIndex;
    const projects = getProjects();
    const project = projects[projectIndex];
    const uploadedFiles = req.files.map(file => {
        const relativePath = file.mimetype === 'application/pdf' 
            ? `works/${project.number} - ${project.name}/${file.filename}`
            : `works/${project.number} - ${project.name}/images/${file.filename}`;
        return { path: relativePath, type: file.mimetype };
    });

    // Append new images to the existing array
    if (!projects[projectIndex].images) {
        projects[projectIndex].images = [];
    }
    projects[projectIndex].images = projects[projectIndex].images.concat(
        uploadedFiles
            .filter(file => file.type.startsWith('image/'))
            .map(file => '/' + file.path)
    );

    // Update the pdf field if a PDF was uploaded
    const pdfFile = uploadedFiles.find(file => file.type === 'application/pdf');
    if (pdfFile) {
        projects[projectIndex].pdf = '/' + pdfFile.path;
    }

    // Write the updated projects array back to the file
    const updatedData = `const projects = ${JSON.stringify(projects, null, 2)};`;
    fs.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            return res.status(500).json({ success: false, message: 'Error updating projects file' });
        }
        res.json({ success: true, files: uploadedFiles.map(file => '/' + file.path) });
    });
});

app.post('/save-projects', (req, res) => {
    const { password, projects } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    fs.writeFile(path.join(__dirname, 'projects.js'), projects, (err) => {
        if (err) {
            console.error(err);
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.use((req, res, next) => {
    console.log(`Request for: ${req.url}`);
    next();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


