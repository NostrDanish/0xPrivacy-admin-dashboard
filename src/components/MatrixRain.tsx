import { useEffect, useRef } from 'react';

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン∫∂∆∑∏√∞≈≠≤≥∈∉⊂⊃∪∩';
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50);

    let animId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 10, 15, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.95 ? 1 : 0.3 + Math.random() * 0.3;

        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgba(180, 255, 200, ${alpha})`;
        } else if (i % 7 === 0) {
          ctx.fillStyle = `rgba(0, 200, 100, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(0, 140, 60, ${alpha * 0.6})`;
        }

        ctx.font = `${fontSize}px 'JetBrains Mono Variable', monospace`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-25"
      style={{ display: 'block' }}
    />
  );
}
