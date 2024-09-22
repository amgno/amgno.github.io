function createStars() {
  const container = document.createElement('div');
  container.className = 'star-container';
  document.body.appendChild(container);
  
  const numberOfStars = 1000; // Keep the same number of stars

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Reduce the size range of the stars
    const size = Math.random() * 1 + 0.25; // Stars between 0.5-1.5px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Generate random coordinates in a cube (keep this part the same)
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = Math.random() * 2000 - 1000;

    star.dataset.x = x;
    star.dataset.y = y;
    star.dataset.z = z;
    
    const duration = 3 + Math.random() * 4;
    star.style.setProperty('--twinkle-duration', `${duration}s`);
    
    const opacity = 0.5 + Math.random() * 0.5;
    star.style.setProperty('--twinkle-opacity', opacity);
    
    container.appendChild(star);
  }
}

function addMouseEffect() {
  const stars = document.querySelectorAll('.star');
  let rotationX = 0, rotationY = 0;
  let centerX = window.innerWidth / 2;
  let centerY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    rotationY = (e.clientX - centerX) * 0.0001; // Further reduced sensitivity
    rotationX = (e.clientY - centerY) * 0.0001; // Further reduced sensitivity
  });

  function updateStarPositions() {
    stars.forEach(star => {
      let x = parseFloat(star.dataset.x);
      let y = parseFloat(star.dataset.y);
      let z = parseFloat(star.dataset.z);

      // Rotate around Y-axis
      let newX = x * Math.cos(rotationY) - z * Math.sin(rotationY);
      let newZ = z * Math.cos(rotationY) + x * Math.sin(rotationY);

      // Rotate around X-axis
      let newY = y * Math.cos(rotationX) - newZ * Math.sin(rotationX);
      newZ = newZ * Math.cos(rotationX) + y * Math.sin(rotationX);

      // Project 3D coordinates to 2D screen
      const scale = 1000 / (1000 + newZ); // Adjusted scale factor
      const screenX = newX * scale + centerX;
      const screenY = newY * scale + centerY;

      star.style.transform = `translate3d(${screenX}px, ${screenY}px, ${newZ}px)`;
      star.style.opacity = Math.min((newZ + 1000) / 1000, 1); // Adjusted opacity calculation
    });

    requestAnimationFrame(updateStarPositions);
  }

  updateStarPositions();
}

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  addMouseEffect();
});
