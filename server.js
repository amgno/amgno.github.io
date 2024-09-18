const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Add this near the top of your server.js file
app.get('/projects.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'projects.js'));
});

// Use an environment variable for the password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'default_password';

app.use(express.json());
app.use(express.static('.'));

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Incorrect password' });
    }
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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});