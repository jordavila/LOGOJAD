const canvas = document.getElementById('spark-canvas');
const ctx = canvas.getContext('2d');
const logo = document.getElementById('logo');

const particles = [];
const MAX_PARTICLES = 80;

logo.onload = () => {
  canvas.width = logo.width;
  canvas.height = logo.height;

  // Dibuja el logo sobre el canvas oculto
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(logo, 0, 0);

  // Extrae datos de píxeles
  const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
  const visiblePixels = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      const index = (y * canvas.width + x) * 4;
      const alpha = imageData.data[index + 3];

      if (alpha > 10) {
        visiblePixels.push({ x, y });
      }
    }
  }

  function spawnParticle() {
    if (visiblePixels.length === 0) return;
    const { x, y } = visiblePixels[Math.floor(Math.random() * visiblePixels.length)];

    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      alpha: 1,
      radius: Math.random() * 4 + 1
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Añadir partículas
    if (particles.length < MAX_PARTICLES) {
      for (let i = 0; i < 2; i++) spawnParticle();
    }

    // Dibujar y actualizar partículas
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 100, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(update);
  }

  update();
};
