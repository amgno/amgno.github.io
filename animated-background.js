function createStars() {
  const container = document.createElement('div');
  container.className = 'star-container';
  document.body.appendChild(container);
  
  const numberOfStars = 1000;

  for (let i = 0; i < numberOfStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    const size = Math.random() * 1 + 0.25;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Store 3D coordinates
    star.dataset.x = Math.random() * 2000 - 1000;
    star.dataset.y = Math.random() * 2000 - 1000;
    star.dataset.z = Math.random() * 2000 - 1000;
    
    container.appendChild(star);
  }
}

function animateStars() {
  const stars = document.querySelectorAll('.star');
  let rotationX = 0, rotationY = 0;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  function update(timestamp) {
    // Update rotation angles based on time
    rotationY = Math.sin(timestamp * 0.0001) * 0.5;
    rotationX = Math.cos(timestamp * 0.00015) * 0.5;

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
      const scale = 1000 / (1000 + newZ);
      const screenX = newX * scale + centerX;
      const screenY = newY * scale + centerY;

      star.style.transform = `translate(${screenX}px, ${screenY}px)`;
      star.style.opacity = Math.min((newZ + 1000) / 1000, 1);
    });

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  animateStars();
});