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
        const project = getProjects()[projectIndex];
        const uploadPath = path.join(__dirname, `works/${project.number} - ${project.name}/images`);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 10 * 1024 * 2024, // 10 MB limit
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
        return `/works/${project.number} - ${project.name}/images/${file.filename}`;
    });

    // Append new images to the existing array
    if (!projects[projectIndex].images) {
        projects[projectIndex].images = [];
    }
    projects[projectIndex].images = projects[projectIndex].images.concat(uploadedFiles);

    // Write the updated projects array back to the file
    const updatedData = `const projects = ${JSON.stringify(projects, null, 2)};`;
    fs.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            return res.status(500).json({ success: false, message: 'Error updating projects file' });
        }
        res.json({ success: true, files: uploadedFiles });
    });
});

app.post('/save-projects', (req, res) => {
    const updatedProjects = req.body;
    const updatedData = `const projects = ${JSON.stringify(updatedProjects, null, 2)};`;
    
    fs.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
        if (writeErr) {
            console.error(writeErr);
            return res.status(500).json({ success: false, message: 'Error updating projects file' });
        }
        res.json({ success: true });
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

app.post('/delete-image', (req, res) => {
    const { projectIndex, imagePath } = req.body;
    const projects = getProjects();

    if (projects[projectIndex] && projects[projectIndex].images) {
        const imageIndex = projects[projectIndex].images.indexOf(imagePath);
        if (imageIndex > -1) {
            // Remove the image from the project's images array
            projects[projectIndex].images.splice(imageIndex, 1);

            // Delete the actual file
            fs.unlink(path.join(__dirname, imagePath), (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ success: false, message: 'Error deleting file' });
                }

                // Update the projects file
                const updatedData = `const projects = ${JSON.stringify(projects, null, 2)};`;
                fs.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                        return res.status(500).json({ success: false, message: 'Error updating projects file' });
                    }
                    res.json({ success: true });
                });
            });
        } else {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    } else {
        res.status(404).json({ success: false, message: 'Project or images not found' });
    }
});

app.get('/projects', (req, res) => {
    const projects = getProjects();
    res.json(projects);
});


