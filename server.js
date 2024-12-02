const express = require('express');
const fs = require('fs').promises;
const fsSync = require('fs');  // For synchronous operations
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Use an environment variable for the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password';

app.use(express.json());
app.use(express.static(__dirname));

function getProjects() {
    const projectsFile = fsSync.readFileSync(path.join(__dirname, 'projects.js'), 'utf8');
    return JSON.parse(projectsFile.replace('const projects = ', '').replace(';', ''));
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const projectIndex = req.body.projectIndex;
        const project = getProjects()[projectIndex];
        const uploadPath = path.join(__dirname, `works/${project.number} - ${project.name}/images`);
        fsSync.mkdirSync(uploadPath, { recursive: true });
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

// Configure multer for photo uploads
const photoStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const uploadPath = './photos';
        try {
            await fs.access(uploadPath);
        } catch {
            await fs.mkdir(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadPhoto = multer({ storage: photoStorage });

// Store photo metadata in a JSON file
const PHOTOS_FILE = path.join(__dirname, 'photos', 'metadata.json');

// Initialize photos metadata if it doesn't exist
async function initializePhotosMetadata() {
    try {
        await fs.access(PHOTOS_FILE);
    } catch {
        await fs.writeFile(PHOTOS_FILE, JSON.stringify([]));
    }
}

initializePhotosMetadata();

// Read photos metadata
async function getPhotosMetadata() {
    try {
        const data = await fs.readFile(PHOTOS_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Save photos metadata
async function savePhotosMetadata(metadata) {
    await fs.writeFile(PHOTOS_FILE, JSON.stringify(metadata, null, 2));
}

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
    fsSync.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
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
    
    fsSync.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
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
            fsSync.unlink(path.join(__dirname, imagePath), (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ success: false, message: 'Error deleting file' });
                }

                // Update the projects file
                const updatedData = `const projects = ${JSON.stringify(projects, null, 2)};`;
                fsSync.writeFile(path.join(__dirname, 'projects.js'), updatedData, (writeErr) => {
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

app.post('/upload-photo', uploadPhoto.single('photo'), async (req, res) => {
    try {
        const { label, year } = req.body;
        const filename = req.file.filename;
        
        const metadata = await getPhotosMetadata();
        metadata.push({
            id: Date.now().toString(),
            filename,
            label,
            year,
            path: `/photos/${filename}`
        });
        
        await savePhotosMetadata(metadata);
        
        res.json({ success: true, message: 'Photo uploaded successfully' });
    } catch (error) {
        console.error('Error uploading photo:', error);
        res.status(500).json({ success: false, message: 'Error uploading photo' });
    }
});

app.get('/photos-metadata', async (req, res) => {
    try {
        const metadata = await getPhotosMetadata();
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching photos metadata' });
    }
});

app.delete('/delete-photo/:id', async (req, res) => {
    try {
        const metadata = await getPhotosMetadata();
        const photoIndex = metadata.findIndex(p => p.id === req.params.id);
        
        if (photoIndex === -1) {
            return res.status(404).json({ success: false, message: 'Photo not found' });
        }

        const photo = metadata[photoIndex];
        await fsSync.unlink(path.join(__dirname, 'photos', photo.filename));
        
        metadata.splice(photoIndex, 1);
        await savePhotosMetadata(metadata);
        
        res.json({ success: true, message: 'Photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting photo' });
    }
});

// Add this after your other initialization code
async function ensurePhotosDirectory() {
    try {
        await fs.access('./photos');
    } catch {
        // Directory doesn't exist, create it
        await fs.mkdir('./photos', { recursive: true });
    }

    const metadataPath = path.join(__dirname, 'photos', 'metadata.json');
    try {
        await fs.access(metadataPath);
    } catch {
        // Create empty metadata file if it doesn't exist
        await fs.writeFile(metadataPath, JSON.stringify([]));
    }
}

// Call this when the server starts
ensurePhotosDirectory().catch(console.error);

// Add this after your other static middleware
app.use('/photos', express.static(path.join(__dirname, 'photos')));


