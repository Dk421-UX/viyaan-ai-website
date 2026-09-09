"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

interface SpatialIntelligenceCoreProps {
  className?: string;
  interactive?: boolean;
}

export default function SpatialIntelligenceCore({
  className = "",
  interactive = true,
}: SpatialIntelligenceCoreProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback 2D canvas renderer if WebGL is unsupported
  const renderFallback2D = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 220);

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.5 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 178, 255, 0.4)";
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 70) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 102, 255, ${(1 - dist / 70) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 220;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    try {
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (!gl) return renderFallback2D(canvas);
    } catch {
      return renderFallback2D(canvas);
    }

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const particleCount = isReducedMotion ? 60 : isMobile ? 90 : 220;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / (container.clientHeight || 220),
      0.1,
      1000
    );
    camera.position.z = 180;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });

    renderer.setSize(container.clientWidth, container.clientHeight || 220);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));

    // Central Core Topology
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // Inner Glowing Nucleus
    const nucleusGeom = new THREE.SphereGeometry(2.5, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const nucleus = new THREE.Mesh(nucleusGeom, nucleusMat);
    centralGroup.add(nucleus);

    // Layered orbital structures (Cognitive Topology)
    const ringMat = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });
    const ringMatCyan = new THREE.LineBasicMaterial({
      color: 0x00b2ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });

    const createTopologyRing = (radius: number, segments: number, mat: THREE.Material) => {
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.LineLoop(geom, mat);
    };

    const ring1 = createTopologyRing(28, 64, ringMat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    centralGroup.add(ring1);

    const ring2 = createTopologyRing(42, 64, ringMatCyan);
    ring2.rotation.x = -Math.PI / 3.5;
    ring2.rotation.y = Math.PI / 4;
    centralGroup.add(ring2);

    const ring3 = createTopologyRing(58, 72, ringMat);
    ring3.rotation.x = Math.PI / 2.2;
    centralGroup.add(ring3);

    // Particle Cloud Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color(0x00b2ff);
    const colorBlue = new THREE.Color(0x0066ff);
    const colorWhite = new THREE.Color(0xe4e4e7);

    const fieldRadius = isMobile ? 42 : 62;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = fieldRadius * Math.cbrt(Math.random()) * (0.35 + Math.random() * 0.65);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      const z = r * Math.cos(phi) * 0.55;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const rnd = Math.random();
      const col = new THREE.Color();
      if (rnd > 0.85) {
        col.copy(colorWhite);
      } else if (rnd > 0.4) {
        col.copy(colorCyan);
      } else {
        col.copy(colorBlue);
      }

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Point Texture
    const particleTexture = (() => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 32;
      pCanvas.height = 32;
      const pCtx = pCanvas.getContext("2d");
      if (pCtx) {
        const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.3, "rgba(0,178,255,0.7)");
        grad.addColorStop(0.65, "rgba(0,102,255,0.15)");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        pCtx.fillStyle = grad;
        pCtx.fillRect(0, 0, 32, 32);
      }
      return new THREE.CanvasTexture(pCanvas);
    })();

    const material = new THREE.PointsMaterial({
      size: isMobile ? 2.6 : 3.0,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const pointCloud = new THREE.Points(geometry, material);
    centralGroup.add(pointCloud);

    // Subtle Synapse Connections
    const maxLines = isMobile ? 30 : 70;
    const linePositions = new Float32Array(maxLines * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const neuralLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    centralGroup.add(neuralLines);

    // Mouse interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    };

    const handlePointerLeave = () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight || 220;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // IntersectionObserver: Pause when out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera perspective lerp based on cursor
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      camera.position.x = mouse.x * 16;
      camera.position.y = mouse.y * 10;
      camera.lookAt(0, 0, 0);

      // Slow organic rotation of central spatial form
      const rotSpeed = isReducedMotion ? 0.01 : 0.035;
      centralGroup.rotation.y = elapsedTime * rotSpeed;
      centralGroup.rotation.x = Math.sin(elapsedTime * 0.02) * 0.04;

      // Gentle pulse on core nucleus
      nucleus.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.06);

      // Subtle breathing drift of particles
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      const driftSpeed = isReducedMotion ? 0.2 : 0.5;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] = originalPositions[i3] + Math.sin(elapsedTime * driftSpeed + i) * 1.5;
        posArray[i3 + 1] = originalPositions[i3 + 1] + Math.cos(elapsedTime * driftSpeed + i * 1.2) * 1.5;
        posArray[i3 + 2] = originalPositions[i3 + 2] + Math.sin(elapsedTime * driftSpeed + i * 0.8) * 1.0;
      }
      posAttr.needsUpdate = true;

      // Synaptic lines
      const linePosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;
      let lineCount = 0;
      const threshold = isMobile ? 16 : 22;
      const stride = isMobile ? 4 : 3;

      for (let i = 0; i < particleCount && lineCount < maxLines; i += stride) {
        const i3 = i * 3;
        for (let j = i + stride; j < particleCount && lineCount < maxLines; j += stride) {
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < threshold * threshold) {
            const l6 = lineCount * 6;
            linePosArray[l6] = posArray[i3];
            linePosArray[l6 + 1] = posArray[i3 + 1];
            linePosArray[l6 + 2] = posArray[i3 + 2];
            linePosArray[l6 + 3] = posArray[j3];
            linePosArray[l6 + 4] = posArray[j3 + 1];
            linePosArray[l6 + 5] = posArray[j3 + 2];
            lineCount++;
          }
        }
      }

      for (let k = lineCount * 6; k < maxLines * 6; k++) {
        linePosArray[k] = 0;
      }
      linePosAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      nucleusGeom.dispose();
      nucleusMat.dispose();
      ringMat.dispose();
      ringMatCyan.dispose();
      renderer.dispose();
    };
  }, [interactive, renderFallback2D]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />
    </div>
  );
}
