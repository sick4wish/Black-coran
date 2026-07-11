import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Palette, Layers, Eye, Compass, HelpCircle } from 'lucide-react';
import { findLexiconItem } from '../utils';

interface GlyphGeneratorProps {
  tokens: string[];
  validationColor: 'VIOLET' | 'GOLD' | 'SCARLET' | null;
  medulaState: string;
}

type GlowTheme = 'amber' | 'violet' | 'cyan' | 'emerald' | 'rose' | 'gold';
type AnimationType = 'orbit' | 'pulse' | 'aurora' | 'none';
type BackgroundStyle = 'void' | 'parchment' | 'abyss' | 'emerald' | 'scarlet';

export function GlyphGenerator({ tokens, validationColor, medulaState }: GlyphGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [theme, setTheme] = useState<GlowTheme>('amber');
  const [showRunicGrid, setShowRunicGrid] = useState<boolean>(true);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [complexity, setComplexity] = useState<'standard' | 'dense' | 'stellar'>('stellar');
  const [animationType, setAnimationType] = useState<AnimationType>('orbit');
  const [backgroundStyle, setBackgroundStyle] = useState<BackgroundStyle>('void');

  // Auto-set theme based on validation color
  useEffect(() => {
    if (validationColor === 'VIOLET') {
      setTheme('violet');
    } else if (validationColor === 'GOLD') {
      setTheme('gold');
    } else if (validationColor === 'SCARLET') {
      setTheme('rose');
    } else if (tokens.length > 0) {
      // Analyze dominant elements
      const hasFire = tokens.some(t => t === '火' || t === '燃' || t === '爆' || t === '烈' || t === '熾');
      const hasWater = tokens.some(t => t === '水' || t === '冰' || t === '凍' || t === '湧' || t === '濤');
      if (hasFire) setTheme('amber');
      else if (hasWater) setTheme('cyan');
    }
  }, [validationColor, tokens]);

  // Color values for themes
  const themeColors = {
    amber: { primary: '#f59e0b', secondary: '#78350f', glow: 'rgba(245, 158, 11, 0.4)' },
    violet: { primary: '#a855f7', secondary: '#581c87', glow: 'rgba(168, 85, 247, 0.4)' },
    cyan: { primary: '#06b6d4', secondary: '#164e63', glow: 'rgba(6, 182, 212, 0.4)' },
    emerald: { primary: '#10b981', secondary: '#064e3b', glow: 'rgba(16, 185, 129, 0.4)' },
    rose: { primary: '#f43f5e', secondary: '#4c0519', glow: 'rgba(244, 63, 94, 0.4)' },
    gold: { primary: '#fbbf24', secondary: '#451a03', glow: 'rgba(251, 191, 36, 0.5)' },
  };

  // State sync ref to guarantee the 60fps render loop always works with fresh data
  const stateRef = useRef({
    tokens,
    validationColor,
    medulaState,
    theme,
    showRunicGrid,
    transparentBg,
    complexity,
    animationType,
    backgroundStyle,
  });

  useEffect(() => {
    stateRef.current = {
      tokens,
      validationColor,
      medulaState,
      theme,
      showRunicGrid,
      transparentBg,
      complexity,
      animationType,
      backgroundStyle,
    };
  }, [tokens, validationColor, medulaState, theme, showRunicGrid, transparentBg, complexity, animationType, backgroundStyle]);

  // HIGH PERFORMANCE CANVAS RENDER LOOP (Handles continuous magic animations)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let traceStart = performance.now();
    let lastTokensStr = '';

    const render = (timeMs: number) => {
      const state = stateRef.current;
      const tokensStr = state.tokens.join(',');

      // Reset tracing animation when spell combination changes
      if (tokensStr !== lastTokensStr) {
        traceStart = timeMs;
        lastTokensStr = tokensStr;
      }

      const elapsedTrace = timeMs - traceStart;
      const progress = state.tokens.length > 0 ? Math.min(elapsedTrace / 1400, 1.0) : 1.0;
      const timeSecs = timeMs / 1000;

      drawGlyphInternal(ctx, progress, timeSecs, state);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const drawGlyphInternal = (
    ctx: CanvasRenderingContext2D,
    progress: number,
    time: number,
    state: typeof stateRef.current
  ) => {
    const size = 600; // Native canvas high resolution
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    const center = size / 2;
    const currentColors = themeColors[state.theme];

    // Clear previous drawing
    ctx.clearRect(0, 0, size, size);

    // DRAW CHOSEN ALCHEMICAL BACKGROUND STYLE
    if (!state.transparentBg) {
      if (state.backgroundStyle === 'parchment') {
        // High-contrast Imperial Parchment Backdrop
        const bgGrad = ctx.createRadialGradient(center, center, 100, center, center, size / 1.3);
        bgGrad.addColorStop(0, '#fdfaf2');
        bgGrad.addColorStop(0.7, '#f4ebd8');
        bgGrad.addColorStop(1, '#e3d2b2');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Vignette Border lines
        ctx.strokeStyle = 'rgba(102, 67, 18, 0.16)';
        ctx.lineWidth = 14;
        ctx.strokeRect(7, 7, size - 14, size - 14);

        // Fiber/antique parchment noise
        ctx.fillStyle = 'rgba(139, 92, 26, 0.02)';
        for (let i = 0; i < 400; i++) {
          const rx = Math.sin(i * 123.4) * center + center;
          const ry = Math.cos(i * 567.8) * center + center;
          const rSize = (i % 3) + 1;
          ctx.fillRect(rx, ry, rSize, rSize);
        }

        // Draw light grid patterns in sepia ink
        if (state.showRunicGrid) {
          ctx.strokeStyle = 'rgba(102, 67, 18, 0.07)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(center, center, 280, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Dark theme backgrounds
        let color1 = '#1a1411';
        let color2 = '#0c0908';
        let color3 = '#050403';

        if (state.backgroundStyle === 'abyss') {
          color1 = '#0f0a28';
          color2 = '#050311';
          color3 = '#010005';
        } else if (state.backgroundStyle === 'emerald') {
          color1 = '#061a12';
          color2 = '#020b08';
          color3 = '#000201';
        } else if (state.backgroundStyle === 'scarlet') {
          color1 = '#220808';
          color2 = '#0c0202';
          color3 = '#020000';
        } else {
          // Standard Void
          color1 = '#140f0c';
          color2 = '#080605';
          color3 = '#020101';
        }

        const bgGrad = ctx.createRadialGradient(center, center, 50, center, center, size / 1.5);
        bgGrad.addColorStop(0, color1);
        bgGrad.addColorStop(0.5, color2);
        bgGrad.addColorStop(1, color3);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // Drifting cosmic particles in movement states
        if (state.animationType === 'aurora' || state.animationType === 'orbit') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
          for (let i = 0; i < 40; i++) {
            const angleOffset = time * 0.12 + i * 0.25;
            const radius = (110 + (i * 13) % 180);
            const rx = center + Math.cos(angleOffset) * radius;
            const ry = center + Math.sin(angleOffset * 0.8) * radius;
            const particleSize = ((i % 3) + 1) * 0.75;
            ctx.beginPath();
            ctx.arc(rx, ry, particleSize, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // Standard static canvas noise
          ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
          for (let i = 0; i < 400; i++) {
            const rx = Math.sin(i * 123.4) * center + center;
            const ry = Math.cos(i * 567.8) * center + center;
            const rSize = (i % 2) + 1;
            ctx.fillRect(rx, ry, rSize, rSize);
          }
        }
      }
    }

    // DRAW ACTIVE COGNITIVE AURORA FLOW (Behind the rings - draws wisps of elemental nebula)
    if (state.animationType === 'aurora' && !state.transparentBg) {
      ctx.save();
      const numWaves = 3;
      for (let w = 0; w < numWaves; w++) {
        const waveScale = 1.0 + Math.sin(time * 1.6 + w * Math.PI / 1.5) * 0.12;
        const waveAngle = time * 0.35 + w * Math.PI / 3;
        const waveGrad = ctx.createRadialGradient(
          center + Math.cos(waveAngle) * 40,
          center + Math.sin(waveAngle) * 40,
          10,
          center,
          center,
          180 * waveScale
        );
        waveGrad.addColorStop(0, `${currentColors.primary}28`);
        waveGrad.addColorStop(0.5, `${currentColors.primary}0a`);
        waveGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = waveGrad;
        ctx.beginPath();
        ctx.arc(center, center, 200 * waveScale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // DRAW RUNIC GUIDELINES / GRID
    if (state.showRunicGrid) {
      ctx.save();
      ctx.strokeStyle = state.backgroundStyle === 'parchment' && !state.transparentBg
        ? 'rgba(102, 67, 18, 0.08)'
        : 'rgba(245, 158, 11, 0.04)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(center, 40);
      ctx.lineTo(center, size - 40);
      ctx.moveTo(40, center);
      ctx.lineTo(size - 40, center);
      ctx.stroke();

      ctx.strokeRect(40, 40, size - 80, size - 80);

      ctx.beginPath();
      ctx.moveTo(60, 60);
      ctx.lineTo(size - 60, size - 60);
      ctx.moveTo(size - 60, 60);
      ctx.lineTo(60, size - 60);
      ctx.stroke();
      ctx.restore();
    }

    // DYNAMIC ANIMATION OFFSETS
    const rotateAngle1 = state.animationType === 'orbit' ? time * 0.07 : 0;
    const rotateAngle2 = state.animationType === 'orbit' ? -time * 0.11 : 0;
    const rotateAngle3 = state.animationType === 'orbit' ? time * 0.03 : 0;

    const pulseFactor = state.animationType === 'pulse'
      ? 1.0 + Math.sin(time * 3.8) * 0.025
      : 1.0;

    const drawConcentricCircle = (
      radius: number,
      dStyle: 'solid' | 'dashed' | 'dotted',
      opacity = 0.15,
      rotationAngle = 0
    ) => {
      ctx.save();
      ctx.strokeStyle = currentColors.primary;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = radius > 200 ? 1.5 : 1;

      if (dStyle === 'dashed') {
        ctx.setLineDash([8, 12]);
      } else if (dStyle === 'dotted') {
        ctx.setLineDash([2, 8]);
      }

      ctx.translate(center, center);
      ctx.rotate(rotationAngle);
      ctx.beginPath();
      ctx.arc(0, 0, radius * pulseFactor, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.stroke();
      ctx.restore();
    };

    // Draw concentric spell rings
    drawConcentricCircle(260, 'solid', 0.25, rotateAngle1);
    drawConcentricCircle(245, 'dashed', 0.15, rotateAngle2);
    drawConcentricCircle(200, 'solid', 0.12, rotateAngle3);
    drawConcentricCircle(140, 'dotted', 0.2, rotateAngle1 * -0.6);
    drawConcentricCircle(90, 'solid', 0.1, rotateAngle2 * 0.8);

    // Glow config
    ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 4 : 15;
    ctx.shadowColor = state.backgroundStyle === 'parchment' && !state.transparentBg ? 'rgba(0,0,0,0.22)' : currentColors.primary;

    // Outer circle ticks (orbit rotating if selected)
    ctx.save();
    ctx.strokeStyle = currentColors.primary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 0 : 8;
    ctx.translate(center, center);
    ctx.rotate(rotateAngle1);

    const maxTicksAngle = Math.PI * 2 * progress;
    for (let angle = 0; angle < maxTicksAngle; angle += Math.PI / 12) {
      ctx.beginPath();
      const rOuter = 260 * pulseFactor;
      const length = angle % (Math.PI / 2) === 0 ? 15 : 6;
      ctx.moveTo(Math.cos(angle) * rOuter, Math.sin(angle) * rOuter);
      ctx.lineTo(Math.cos(angle) * (rOuter - length), Math.sin(angle) * (rOuter - length));
      ctx.stroke();
    }
    ctx.restore();

    // RENDER WRITING TEXT AROUND COMPASS RING
    ctx.save();
    ctx.fillStyle = currentColors.primary;
    ctx.globalAlpha = 0.55;
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 0 : 4;

    const ringText = `HECHIZO FLUX: ${state.validationColor || 'NONE'} • GRIMORIO DE CASTEMARE 1576 • ANTIMATERIA MÈDULA: ${state.medulaState.toUpperCase()}`;
    const charsAround = ringText.split('');
    const visibleCharsCount = Math.floor(charsAround.length * progress);
    const activeChars = charsAround.slice(0, visibleCharsCount);
    const arcLength = Math.PI * 1.5;
    const angleStep = arcLength / charsAround.length;
    const startAngle = -Math.PI / 2 - arcLength / 2 + rotateAngle3 * 0.4;

    activeChars.forEach((char, i) => {
      const charAngle = startAngle + i * angleStep;
      const tx = center + Math.cos(charAngle) * 252 * pulseFactor;
      const ty = center + Math.sin(charAngle) * 252 * pulseFactor;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
    ctx.restore();

    // DRAW SPELL VECTOR SIGIL GEOMETRY
    const N = state.tokens.length;
    if (N > 0) {
      ctx.save();
      ctx.strokeStyle = currentColors.primary;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 4 : 18;
      ctx.shadowColor = currentColors.primary;

      const radius = 170 * pulseFactor;
      const points: { x: number; y: number; char: string; pinyin: string }[] = [];
      const sigilOrbitAngle = state.animationType === 'orbit' ? time * 0.04 : 0;

      for (let i = 0; i < N; i++) {
        const angle = (i * Math.PI * 2) / N - Math.PI / 2 + sigilOrbitAngle;
        const px = center + Math.cos(angle) * radius;
        const py = center + Math.sin(angle) * radius;
        const item = findLexiconItem(state.tokens[i]);
        points.push({
          x: px,
          y: py,
          char: state.tokens[i],
          pinyin: item?.pinyin || '??'
        });
      }

      // Draw primary boundary vectors segment by segment
      const currentSegmentProgress = progress * N;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      let brushX = points[0].x;
      let brushY = points[0].y;
      let showBrush = false;

      for (let i = 0; i < N; i++) {
        const startPt = points[i];
        const endPt = points[(i + 1) % N];

        if (currentSegmentProgress >= i + 1) {
          ctx.lineTo(endPt.x, endPt.y);
        } else if (currentSegmentProgress > i) {
          const ratio = currentSegmentProgress - i;
          brushX = startPt.x + (endPt.x - startPt.x) * ratio;
          brushY = startPt.y + (endPt.y - startPt.y) * ratio;
          ctx.lineTo(brushX, brushY);
          showBrush = true;
          break;
        } else {
          break;
        }
      }
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      // Alternate internal stellar links
      if (state.complexity === 'dense' || state.complexity === 'stellar') {
        const lineFadeProgress = Math.max(0, (progress - 0.4) * 1.66);
        if (lineFadeProgress > 0) {
          ctx.lineWidth = 0.8;
          ctx.globalAlpha = 0.35 * lineFadeProgress;
          ctx.beginPath();
          for (let i = 0; i < N; i++) {
            for (let j = i + 2; j < N + (N === 4 ? 1 : 0); j++) {
              const nextIdx = j % N;
              if (nextIdx !== i) {
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[nextIdx].x, points[nextIdx].y);
              }
            }
          }
          ctx.stroke();
        }
      }

      // Outer projecting alignment rays
      if (state.complexity === 'stellar') {
        const projectionFade = Math.max(0, (progress - 0.7) * 3.33);
        if (projectionFade > 0) {
          ctx.strokeStyle = currentColors.primary;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.2 * projectionFade;
          ctx.beginPath();
          points.forEach(pt => {
            const angle = Math.atan2(pt.y - center, pt.x - center);
            ctx.moveTo(center, center);
            ctx.lineTo(center + Math.cos(angle) * 235 * pulseFactor, center + Math.sin(angle) * 235 * pulseFactor);
          });
          ctx.stroke();
        }
      }

      // Draw node nodes
      points.forEach((pt, idx) => {
        const isReached = idx === 0 || currentSegmentProgress >= idx;
        if (!isReached) return;

        const age = idx === 0 ? currentSegmentProgress : currentSegmentProgress - idx;
        const popScale = Math.min(1.4, 1.0 + Math.sin(Math.min(age, 1.0) * Math.PI) * 0.35);

        ctx.save();
        ctx.fillStyle = state.backgroundStyle === 'parchment' && !state.transparentBg ? '#fdfaf2' : 'rgba(0,0,0,0.85)';
        ctx.strokeStyle = currentColors.primary;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.9;
        ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 2 : 10;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 14 * popScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = currentColors.primary;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4 * popScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = state.backgroundStyle === 'parchment' && !state.transparentBg ? '#2a1a08' : '#f3f4f6';
        ctx.shadowBlur = 0;
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';

        const angle = Math.atan2(pt.y - center, pt.x - center);
        const lx = pt.x + Math.cos(angle) * 26 * popScale;
        const ly = pt.y + Math.sin(angle) * 24 * popScale + 3;

        ctx.fillText(pt.char, lx, ly - 8);
        ctx.fillStyle = currentColors.primary;
        ctx.font = 'bold 5px monospace';
        ctx.fillText(pt.pinyin.toUpperCase(), lx, ly + 1);
        ctx.restore();
      });

      // Sparks and Brush
      if (showBrush) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = currentColors.primary;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(brushX, brushY, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = currentColors.primary;
        ctx.globalAlpha = 0.7;
        for (let s = 0; s < 6; s++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          const dist = Math.random() * 14;
          ctx.beginPath();
          ctx.arc(
            brushX + Math.cos(sparkAngle) * dist,
            brushY + Math.sin(sparkAngle) * dist,
            1.2 + Math.random() * 1.8,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();
    } else {
      // DEFAULT FALLBACK STAR
      ctx.save();
      ctx.strokeStyle = currentColors.primary;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 1;

      const defaultOrbitAngle = rotateAngle1 * 0.5;
      ctx.translate(center, center);
      ctx.rotate(defaultOrbitAngle);

      ctx.beginPath();
      ctx.arc(0, 0, 170 * pulseFactor, 0, Math.PI * 2);
      ctx.stroke();

      const steps = 8;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const angle = (i * Math.PI * 2) / steps;
        const r1 = (i % 2 === 0 ? 170 : 80) * pulseFactor;
        const x = Math.cos(angle) * r1;
        const y = Math.sin(angle) * r1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // DRAW CHINESE CALLIGRAPHY IN CENTER
    ctx.save();
    ctx.shadowBlur = state.backgroundStyle === 'parchment' && !state.transparentBg ? 2 : 20;
    ctx.shadowColor = currentColors.primary;

    if (state.tokens.length > 0) {
      const glyphString = state.tokens.join('');

      let fontSize = 48;
      if (glyphString.length === 1) fontSize = 84;
      else if (glyphString.length === 2) fontSize = 64;
      else if (glyphString.length === 3) fontSize = 54;
      else if (glyphString.length >= 6) fontSize = 36;

      const currentFontSize = fontSize * (0.85 + 0.15 * progress) * pulseFactor;
      ctx.font = `bold ${currentFontSize}px "KaiTi", "BiauKai", "DFKai-SB", "serif", "STKaiti"`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Outline shadow
      ctx.fillStyle = currentColors.primary;
      ctx.globalAlpha = 0.3 * progress;
      ctx.fillText(glyphString, center, center + 4);

      // Ink stamp lettering
      ctx.fillStyle = state.backgroundStyle === 'parchment' && !state.transparentBg ? '#1b1207' : '#f3f4f6';
      ctx.globalAlpha = 0.95 * progress;
      ctx.fillText(glyphString, center, center);
    } else {
      ctx.font = `bold ${74 * pulseFactor}px "KaiTi", "BiauKai", "DFKai-SB", "serif", "STKaiti"`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = state.backgroundStyle === 'parchment' && !state.transparentBg
        ? 'rgba(102, 67, 18, 0.28)'
        : 'rgba(245, 158, 11, 0.4)';
      ctx.fillText('基林', center, center);
    }
    ctx.restore();

    // DRAW RED SEAL STAMP
    ctx.save();
    ctx.shadowBlur = 0;
    const sealX = center + 140 * pulseFactor;
    const sealY = center + 140 * pulseFactor;
    const sealSize = 36;

    ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sealX - sealSize/2, sealY - sealSize/2, sealSize, sealSize, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(sealX - sealSize/2 + 3, sealY - sealSize/2 + 2, 2, 2);
    ctx.fillRect(sealX + sealSize/4, sealY - sealSize/3, 1.5, 1.5);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "KaiTi", "BiauKai", "serif"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('黑', sealX, sealY);
    ctx.restore();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const spellName = tokens.length > 0 ? tokens.join('-') : 'qilin';
    link.download = `glifo-hechizo-${spellName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="bg-[#120f0e] border border-amber-900/30 rounded-2xl p-5 shadow-xl relative overflow-hidden flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-3">
          <h2 className="text-sm font-serif font-bold text-amber-400 tracking-wider flex items-center gap-2">
            <Compass className="text-amber-500 animate-spin-slow" size={16} />
            FORJA DEL GLIFO DE PODER
          </h2>
          <span className="text-[9px] font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900 text-zinc-500">
            MOTOR GRAPHIC v2.0
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
          Cada combinación de caracteres traza vectores simétricos únicos dentro de la matriz circular del Qilin Negro.
        </p>

        {/* Canvas Render Container */}
        <div className="bg-[#070504] rounded-xl p-3 border border-zinc-900 flex justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-radial-gradient from-amber-500/0 via-transparent to-transparent opacity-30 pointer-events-none" />

          <canvas
            ref={canvasRef}
            className="w-full max-w-[270px] aspect-square rounded-lg shadow-2xl transition-all group-hover:scale-[1.01]"
            style={{ imageRendering: 'pixelated' }}
            title="Sello del Hechizo"
          />

          {tokens.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/75 backdrop-blur-[1px] text-center pointer-events-none">
              <Sparkles className="text-amber-600/40 mb-2 animate-bounce" size={24} />
              <p className="text-[11px] font-serif text-amber-500/80 italic">Esperando que traces caracteres para moldear el Glifo...</p>
            </div>
          )}
        </div>

        {/* Controller and Customizer Tools */}
        <div className="space-y-3 mt-4">

          {/* Theme Color Selector */}
          <div className="flex items-center justify-between gap-2 bg-zinc-950/50 p-2 rounded-lg border border-zinc-900 text-[10px]">
            <span className="text-zinc-400 font-mono flex items-center gap-1">
              <Palette size={11} className="text-amber-500" />
              Sintonía (Color Aura):
            </span>
            <div className="flex gap-1.5">
              {(['amber', 'violet', 'cyan', 'emerald', 'rose', 'gold'] as GlowTheme[]).map(t => {
                const colorMap = {
                  amber: 'bg-amber-500',
                  violet: 'bg-purple-500',
                  cyan: 'bg-cyan-500',
                  emerald: 'bg-emerald-500',
                  rose: 'bg-rose-500',
                  gold: 'bg-yellow-600'
                };
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`w-3.5 h-3.5 rounded-full ${colorMap[t]} border transition-transform cursor-pointer ${
                      theme === t ? 'scale-125 border-white' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title={`Aura ${t}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Toggle Layers Controls */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <button
              onClick={() => setShowRunicGrid(!showRunicGrid)}
              className={`p-1.5 rounded border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                showRunicGrid
                  ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-500'
              }`}
            >
              <Layers size={11} />
              <span>Guías Rúnicas</span>
            </button>

            <button
              onClick={() => setTransparentBg(!transparentBg)}
              className={`p-1.5 rounded border transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                transparentBg
                  ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-500'
              }`}
              title="Permite descargar el glifo con fondo transparente"
            >
              <Eye size={11} />
              <span>Fondo Alfa</span>
            </button>
          </div>

          {/* Background Selector Preset (Fondo diferente para resaltar) */}
          <div className="flex flex-col gap-1.5 p-2 bg-zinc-950/50 rounded-lg border border-zinc-900 text-[10px]">
            <div className="flex items-center justify-between text-zinc-400 font-mono">
              <span>Altar (Fondo de Contraste):</span>
              <span className="text-[8px] text-zinc-600 uppercase">
                {backgroundStyle === 'void' && 'Vacío Cósmico'}
                {backgroundStyle === 'parchment' && 'Pergamino Imperial (Alto contraste)'}
                {backgroundStyle === 'abyss' && 'Abismo Violeta'}
                {backgroundStyle === 'emerald' && 'Templo de Jade'}
                {backgroundStyle === 'scarlet' && 'Foso Carmesí'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 bg-[#090706] p-0.5 border border-zinc-900 rounded">
              {[
                { id: 'void', label: '🌌' },
                { id: 'parchment', label: '📜' },
                { id: 'abyss', label: '🌀' },
                { id: 'emerald', label: '🐉' },
                { id: 'scarlet', label: '🩸' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setBackgroundStyle(opt.id as BackgroundStyle)}
                  className={`py-1 text-center rounded text-xs transition-all cursor-pointer ${
                    backgroundStyle === opt.id
                      ? 'bg-amber-900/30 text-white border border-amber-500/30 shadow'
                      : 'hover:bg-zinc-900 opacity-60 hover:opacity-100 text-zinc-400'
                  }`}
                  title={opt.id}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Continuous Cosmic Motion Animation (Animaciones para los glifos) */}
          <div className="flex flex-col gap-1.5 p-2 bg-zinc-950/50 rounded-lg border border-zinc-900 text-[10px]">
            <div className="flex items-center justify-between text-zinc-400 font-mono">
              <span>Movimiento del Glifo (Animación):</span>
              <span className="text-[8px] text-zinc-600 uppercase">
                {animationType === 'orbit' && 'Órbita Astral'}
                {animationType === 'pulse' && 'Pulsación de Aura'}
                {animationType === 'aurora' && 'Aurora Cósmica'}
                {animationType === 'none' && 'Estático'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 bg-[#090706] p-0.5 border border-zinc-900 rounded">
              {[
                { id: 'orbit', label: 'Órbita' },
                { id: 'pulse', label: 'Latido' },
                { id: 'aurora', label: 'Aurora' },
                { id: 'none', label: 'Estático' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAnimationType(opt.id as AnimationType)}
                  className={`py-1 text-center rounded text-[9px] transition-all cursor-pointer font-mono ${
                    animationType === opt.id
                      ? 'bg-amber-900/35 text-amber-200 font-bold border border-amber-500/20'
                      : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Geometry Complexity Selectors */}
          <div className="flex items-center justify-between p-2 bg-zinc-950/50 rounded-lg border border-zinc-900 text-[10px]">
            <span className="text-zinc-400 font-mono">Complejidad:</span>
            <div className="flex gap-1 bg-[#090706] p-0.5 border border-zinc-900 rounded">
              {[
                { id: 'standard', label: 'Simple' },
                { id: 'dense', label: 'Densa' },
                { id: 'stellar', label: 'Estelar' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setComplexity(opt.id as any)}
                  className={`px-1.5 py-0.5 rounded text-[9px] transition-all cursor-pointer ${
                    complexity === opt.id
                      ? 'bg-amber-900/40 text-amber-200 font-bold'
                      : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Download trigger button */}
      <button
        id="btn-download-glyph"
        onClick={handleDownload}
        disabled={tokens.length === 0}
        className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-950/50 to-amber-900/40 hover:from-amber-900/30 hover:to-amber-800/30 disabled:from-zinc-950 disabled:to-zinc-950 disabled:text-zinc-700 disabled:border-zinc-900 border border-amber-800/20 rounded-xl text-xs font-serif font-bold text-amber-200 hover:text-amber-100 transition-all cursor-pointer flex items-center justify-center gap-2 tracking-wider shadow"
      >
        <Download size={13} />
        <span>DESCARGAR GLIFO MÁGICO</span>
      </button>
    </div>
  );
}
