/**
 * ASCII Pulse Animation
 * Creates a grid of ASCII characters that react to mouse movement.
 * Avoids drawing over text elements.
 */

const config = {
    charSize: 16,     // Size of the grid cells/font
    falloff: 0.03,    // How fast the trail fades (0.01 = slow, 0.1 = fast)
    radius: 150,      // Radius of the mouse influence area
    font: 'monospace',
    color: '#111111'  // Color of the ASCII characters
};

// Create and setup canvas
const canvas = document.createElement('canvas');
canvas.id = 'ascii-bg';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let cols, rows;
let grid = [];
let mouse = { x: -1000, y: -1000 };
let exclusionZones = []; // Array of rectangles to avoid drawing on

// Density gradient characters (from sparse to dense)
const chars = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

function init() {
    resize();
    window.addEventListener('resize', resize);
    
    // Update exclusion zones on scroll too, in case layout shifts (though body is overflow hidden)
    window.addEventListener('scroll', updateExclusionZones);
    
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    
    window.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
    });
}

function updateExclusionZones() {
    // Select elements that should block the ASCII art
    const elements = document.querySelectorAll('.corner, .text-section, .ascii-section, a');
    exclusionZones = [];
    
    elements.forEach(el => {
        // Use getClientRects for multi-line text support
        // This returns a collection of rects, one for each line of text
        const rects = el.getClientRects();
        
        for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            // Only add if element is visible and has dimension
            if (rect.width > 0 && rect.height > 0) {
                // Expand rect slightly for padding
                exclusionZones.push({
                    left: rect.left - 2,  // Slightly tighter padding
                    right: rect.right + 2,
                    top: rect.top - 2,
                    bottom: rect.bottom + 2
                });
            }
        }
    });
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    cols = Math.ceil(width / config.charSize);
    rows = Math.ceil(height / config.charSize);
    
    grid = [];
    for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
            grid[i][j] = 0;
        }
    }
    
    updateExclusionZones();
}

// Returns 0 if inside zone, >0 if outside (distance to edge)
// We use a simple rect distance
function getZoneDistance(x, y) {
    let minDistance = Infinity;

    for (const zone of exclusionZones) {
        // Check if inside
        if (x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom) {
            return 0; // Inside a zone
        }

        // Calculate distance to the nearest edge of this zone
        // Max(0, val) logic for exterior distance
        const dx = Math.max(zone.left - x, 0, x - zone.right);
        const dy = Math.max(zone.top - y, 0, y - zone.bottom);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDistance) {
            minDistance = dist;
        }
    }
    return minDistance;
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    
    ctx.font = `${config.charSize}px ${config.font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * config.charSize + config.charSize / 2;
            const y = j * config.charSize + config.charSize / 2;
            
            // Logic:
            // 1. Calculate intensity based on mouse distance
            // 2. Check distance to nearest text zone
            // 3. If inside text (dist=0), don't draw
            // 4. If near text, FADE opacity
            
            const distToZone = getZoneDistance(x, y);
            
            if (distToZone === 0) continue; // Skip drawing inside text

            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const distToMouse = Math.sqrt(dx * dx + dy * dy);
            
            if (distToMouse < config.radius) {
                let intensity = Math.pow(1 - (distToMouse / config.radius), 2);
                grid[i][j] = Math.max(grid[i][j], intensity);
            }
            
            if (grid[i][j] > 0) {
                grid[i][j] -= config.falloff;
                if (grid[i][j] < 0) grid[i][j] = 0;
                
                if (grid[i][j] > 0.01) {
                    let alpha = grid[i][j];
                    
                    // Add "Soft Fade" effect near text
                    // If close to text (e.g., within 60px), reduce alpha
                    if (distToZone < 60) {
                        // Map distance 0..60 to opacity 0..1
                        const fadeFactor = Math.pow(distToZone / 60, 2); // Quadratic fade for smoothness
                        alpha *= fadeFactor;
                    }
                    
                    if (alpha > 0.01) {
                        const charIndex = Math.floor(Math.min(grid[i][j], 1) * (chars.length - 1));
                        const char = chars[charIndex];
                        
                        ctx.fillStyle = config.color;
                        ctx.globalAlpha = Math.min(alpha, 1);
                        ctx.fillText(char, x, y);
                        ctx.globalAlpha = 1.0;
                    }
                }
            }
        }
    }
    
    requestAnimationFrame(draw);
}

init();
draw();
