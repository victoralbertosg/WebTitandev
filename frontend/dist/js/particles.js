/* ===================================================
   TitanDataSolution — Hero Canvas Particle System
   Animated neural network / data flow visualization
   =================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let connections = [];
  let mouse = { x: null, y: null };

  const CONFIG = {
    particleCount: 70,
    connectionDistance: 130,
    particleRadius: { min: 1.5, max: 3.5 },
    particleSpeed: 0.4,
    colorCyan: '0, 212, 255',
    colorPurple: '157, 78, 221',
    connectionOpacity: 0.12,
    mouseInfluenceRadius: 150,
    mouseInfluenceStrength: 0.015,
  };

  // Resize canvas
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // Create particle
  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed = CONFIG.particleSpeed * (0.3 + Math.random() * 0.7);
    const isCyan = Math.random() > 0.4;

    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: CONFIG.particleRadius.min + Math.random() * (CONFIG.particleRadius.max - CONFIG.particleRadius.min),
      color: isCyan ? CONFIG.colorCyan : CONFIG.colorPurple,
      opacity: 0.3 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.02,
    };
  }

  // Initialize particles
  function init() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push(createParticle());
    }
  }

  // Update particle
  function updateParticle(p) {
    // Mouse influence
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseInfluenceRadius) {
        const force = (CONFIG.mouseInfluenceRadius - dist) / CONFIG.mouseInfluenceRadius;
        p.vx += (dx / dist) * force * CONFIG.mouseInfluenceStrength;
        p.vy += (dy / dist) * force * CONFIG.mouseInfluenceStrength;
      }
    }

    // Speed limit
    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
    if (speed > CONFIG.particleSpeed * 2) {
      p.vx = (p.vx / speed) * CONFIG.particleSpeed * 2;
      p.vy = (p.vy / speed) * CONFIG.particleSpeed * 2;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.pulse += p.pulseSpeed;

    // Wrap around edges
    if (p.x < -10) p.x = canvas.width + 10;
    if (p.x > canvas.width + 10) p.x = -10;
    if (p.y < -10) p.y = canvas.height + 10;
    if (p.y > canvas.height + 10) p.y = -10;
  }

  // Draw particle
  function drawParticle(p) {
    const pulseRadius = p.radius + Math.sin(p.pulse) * 0.5;
    const currentOpacity = p.opacity + Math.sin(p.pulse) * 0.1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, pulseRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
    ctx.fill();

    // Glow effect
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseRadius * 4);
    glow.addColorStop(0, `rgba(${p.color}, ${currentOpacity * 0.3})`);
    glow.addColorStop(1, `rgba(${p.color}, 0)`);
    ctx.beginPath();
    ctx.arc(p.x, p.y, pulseRadius * 4, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }

  // Draw connections between nearby particles
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          const opacity = (1 - dist / CONFIG.connectionDistance) * CONFIG.connectionOpacity;

          // Gradient line between particle colors
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          gradient.addColorStop(0, `rgba(${p1.color}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${p2.color}, ${opacity})`);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  // Main animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawConnections();

    particles.forEach((p) => {
      updateParticle(p);
      drawParticle(p);
    });

    animationId = requestAnimationFrame(animate);
  }

  // Event listeners
  window.addEventListener('resize', () => {
    resizeCanvas();
    init();
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Touch support
  canvas.addEventListener('touchmove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    mouse.x = touch.clientX - rect.left;
    mouse.y = touch.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Start
  resizeCanvas();
  init();
  animate();

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();
