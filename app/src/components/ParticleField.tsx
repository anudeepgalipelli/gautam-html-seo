import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  baseRadius: number;
  glowIntensity: number;
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particleCount = Math.min(
      Math.floor((width * height) / 5000),
      280
    );
    const connectionDistance = 160;
    const mouseDistance = 240;

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const baseRadius = 1.2 + Math.random() * 2;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        baseRadius,
        glowIntensity: 0,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      particles.forEach((p) => {
        if (p.baseX > width) p.baseX = Math.random() * width;
        if (p.baseY > height) p.baseY = Math.random() * height;
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const animate = () => {
      const mouse = mouseRef.current;
      ctx.clearRect(0, 0, width, height);

      // Ambient background glow in center
      const centerGradient = ctx.createRadialGradient(
        width * 0.5, height * 0.5, 0,
        width * 0.5, height * 0.5, Math.max(width, height) * 0.5
      );
      centerGradient.addColorStop(0, 'rgba(20, 184, 166, 0.04)');
      centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = centerGradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient drift
        p.x += p.vx;
        p.y += p.vy;

        // Gentle return to base position
        p.x += (p.baseX - p.x) * 0.008;
        p.y += (p.baseY - p.y) * 0.008;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse interaction - calculate distance
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Smooth glow intensity transition (faster response)
        let targetGlow = 0;
        if (dist < mouseDistance) {
          targetGlow = 1 - dist / mouseDistance;
          targetGlow = targetGlow * targetGlow * targetGlow;
        }
        p.glowIntensity += (targetGlow - p.glowIntensity) * 0.12;

        // Particle size based on glow (more dramatic)
        const currentRadius = p.baseRadius + p.glowIntensity * 4;

        // Draw particle glow (larger, brighter)
        if (p.glowIntensity > 0.03) {
          const glowRadius = currentRadius * 6;
          const glowGradient = ctx.createRadialGradient(
            p.x, p.y, 0,
            p.x, p.y, glowRadius
          );
          glowGradient.addColorStop(0, `rgba(140, 230, 200, ${p.glowIntensity * 0.6})`);
          glowGradient.addColorStop(0.5, `rgba(100, 200, 180, ${p.glowIntensity * 0.25})`);
          glowGradient.addColorStop(1, 'rgba(100, 200, 180, 0)');
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw dot (brighter when active)
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        const alpha = 0.35 + p.glowIntensity * 0.65;
        ctx.fillStyle = `rgba(170, 230, 200, ${alpha})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const baseAlpha = (1 - dist / connectionDistance) * 0.14;
            const glowBoost = Math.max(p1.glowIntensity, p2.glowIntensity) * 0.5;
            const finalAlpha = Math.min(baseAlpha + glowBoost, 0.5);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(160, 220, 190, ${finalAlpha})`;
            ctx.lineWidth = 1 + glowBoost * 2;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
