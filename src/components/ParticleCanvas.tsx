import React, { useEffect, useRef } from 'react';

// Extend Window interface for TypeScript type safety
declare global {
  interface Window {
    triggerMagicParticles: (x: number, y: number, type: string, count?: number) => void;
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  wander?: number;
  wanderScale?: number;
  sparkle?: boolean;
  grow?: boolean;
}

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to cover whole screen with High-DPI support
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle factory function
    const createParticles = (x: number, y: number, type: string, count = 20) => {
      const colors: Record<string, string[]> = {
        fire: ['#f59e0b', '#ef4444', '#f97316', '#fef08a', '#b45309'], // yellow, red, orange
        water: ['#06b6d4', '#0ea5e9', '#3b82f6', '#2563eb', '#93c5fd', '#14b8a6'], // cyan, blue, teal
        void: ['#a855f7', '#8b5cf6', '#d946ef', '#6366f1', '#4f46e5', '#c084fc'], // purple, magenta, indigo
        gold: ['#fbbf24', '#f59e0b', '#fef08a', '#d97706', '#fb7185'], // rich gold, amber, sparkles
        scarlet: ['#dc2626', '#ef4444', '#991b1b', '#fca5a5', '#7f1d1d'], // crimson, bright red, dark blood
        glyph: ['#f59e0b', '#d97706', '#b45309', '#78350f'], // warm bronze/amber for general glyph touch
      };

      const selectedColors = colors[type] || colors.glyph;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        let speed = 1.2 + Math.random() * 3.5;
        let size = 1.5 + Math.random() * 3.5;
        let gravity = 0;
        let friction = 0.97;
        let wander = 0;
        let wanderScale = 0;
        let decay = 0.008 + Math.random() * 0.015;
        let sparkle = false;

        const color = selectedColors[Math.floor(Math.random() * selectedColors.length)];

        // Adjust parameters based on type of magic
        if (type === 'fire') {
          // Fire rises up
          speed = 1.5 + Math.random() * 4;
          const upAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // mostly upwards
          const vx = Math.cos(upAngle) * speed;
          const vy = Math.sin(upAngle) * speed;
          gravity = -0.06; // upward buoyant force
          friction = 0.96;
          wander = 0.15;
          wanderScale = 0.2;
          size = 2 + Math.random() * 4;
          decay = 0.012 + Math.random() * 0.018;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction, wander, wanderScale
          });
        } 
        else if (type === 'water') {
          // Water splashes outwards and falls down
          speed = 2 + Math.random() * 5;
          const vx = Math.cos(angle) * speed;
          const vy = (Math.sin(angle) * speed) - 1.5; // push slightly upwards at start
          gravity = 0.18; // gravity pulls drops down
          friction = 0.98;
          size = 1.5 + Math.random() * 3;
          decay = 0.006 + Math.random() * 0.012;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction
          });
        } 
        else if (type === 'void') {
          // Void particles orbit or spiral erratically
          speed = 3 + Math.random() * 5.5;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          gravity = 0;
          friction = 0.92; // slows down quickly
          wander = 0.5;
          wanderScale = 0.8;
          size = 2 + Math.random() * 3;
          sparkle = Math.random() > 0.4;
          decay = 0.015 + Math.random() * 0.02;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction, wander, wanderScale, sparkle
          });
        } 
        else if (type === 'gold') {
          // Golden glitter floats slowly down like stardust
          speed = 0.5 + Math.random() * 2;
          const driftAngle = Math.PI / 2 + (Math.random() - 0.5) * 1.5; // mostly downwards
          const vx = Math.cos(driftAngle) * speed;
          const vy = Math.sin(driftAngle) * speed;
          gravity = 0.02; // slow fall
          friction = 0.98;
          wander = 0.25;
          wanderScale = 0.15;
          size = 1.2 + Math.random() * 2.2;
          sparkle = true;
          decay = 0.005 + Math.random() * 0.01;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction, wander, wanderScale, sparkle
          });
        } 
        else if (type === 'scarlet') {
          // Rapid explosive burst
          speed = 4 + Math.random() * 7;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          gravity = 0.05; // slight fall
          friction = 0.90; // fast slowdown
          size = 2.5 + Math.random() * 4.5;
          decay = 0.018 + Math.random() * 0.025;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction
          });
        } 
        else if (type === 'glyph-hover') {
          // Small subtle embers
          speed = 0.3 + Math.random() * 1.0;
          const upAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.0;
          const vx = Math.cos(upAngle) * speed;
          const vy = Math.sin(upAngle) * speed;
          gravity = -0.01;
          friction = 0.97;
          size = 1 + Math.random() * 1.8;
          decay = 0.02 + Math.random() * 0.03;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 0.8, decay, gravity, friction
          });
        } 
        else if (type === 'glyph-click') {
          // Medium energetic pop
          speed = 1.5 + Math.random() * 2.5;
          const vx = Math.cos(angle) * speed;
          const vy = Math.sin(angle) * speed;
          gravity = 0.03;
          friction = 0.95;
          size = 1.5 + Math.random() * 2.5;
          decay = 0.015 + Math.random() * 0.025;

          particlesRef.current.push({
            x, y, vx, vy, size, color, alpha: 1, decay, gravity, friction
          });
        }
      }
    };

    // Global hook for triggers
    window.triggerMagicParticles = (x, y, type, count) => {
      createParticles(x, y, type, count);
    };

    // Animation loop
    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;

        // Apply wandering (sinusoidal deviation)
        if (p.wander !== undefined && p.wanderScale !== undefined) {
          p.wander += p.wanderScale;
          p.vx += Math.sin(p.wander) * 0.08;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Remove dead particles
        if (p.alpha <= 0 || p.size <= 0.1) {
          particles.splice(i, 1);
          continue;
        }

        // Shimmer / sparkle effect
        let currentAlpha = p.alpha;
        if (p.sparkle) {
          // dynamic blinking
          currentAlpha = p.alpha * (0.3 + Math.abs(Math.sin(Date.now() * 0.02 + i)));
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = currentAlpha;
        
        // Add subtle radial glow for magical essence
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        // Add soft blur for magical fires/voids
        if (p.size > 2.5) {
          ctx.shadowBlur = p.size * 2.2;
          ctx.shadowColor = p.color;
        }
        
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
      style={{ display: 'block' }}
    />
  );
};
