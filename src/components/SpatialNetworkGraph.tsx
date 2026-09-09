"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight } from "lucide-react";

interface ProductNodeData {
  id: string;
  name: string;
  tagline: string;
  category: string;
  url: string;
  colorHex: number;
  pos: [number, number, number];
}

const PRODUCTS_DATA: ProductNodeData[] = [
  {
    id: "joi",
    name: "JOI Companion AI",
    tagline: "Emotional Presence & Supportive Dialogue",
    category: "EMOTION",
    url: "https://joi-ai-wq7f.vercel.app/",
    colorHex: 0x10b981,
    pos: [-46, -10, 8],
  },
  {
    id: "human-os",
    name: "Human OS",
    tagline: "Cognitive Profile & Reflection Vault",
    category: "COGNITION",
    url: "https://human-os-ptot.vercel.app/",
    colorHex: 0x00b2ff,
    pos: [0, 26, -4],
  },
  {
    id: "future",
    name: "Viyaan Future",
    tagline: "Future-Self Continuity & Memory Logs",
    category: "CONTINUITY",
    url: "https://viyaan-future-ai.vercel.app/",
    colorHex: 0xa855f7,
    pos: [46, -10, 8],
  },
];

export default function SpatialNetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<ProductNodeData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / (container.clientHeight || 340),
      0.1,
      1000
    );
    camera.position.z = isMobile ? 135 : 100;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight || 340);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    // Core Viyaan Root Node
    const centerGeom = new THREE.SphereGeometry(3.5, 32, 32);
    const centerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    scene.add(centerMesh);

    // Subtle core aura
    const centerAuraGeom = new THREE.SphereGeometry(6.5, 16, 16);
    const centerAuraMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const centerAura = new THREE.Mesh(centerAuraGeom, centerAuraMat);
    scene.add(centerAura);

    // Satellite Product Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    PRODUCTS_DATA.forEach((prod) => {
      const geom = new THREE.SphereGeometry(3.2, 24, 24);
      const mat = new THREE.MeshBasicMaterial({
        color: prod.colorHex,
        transparent: true,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(...prod.pos);
      mesh.userData = prod;
      scene.add(mesh);
      nodeMeshes.push(mesh);

      // Light aura ring
      const auraGeom = new THREE.RingGeometry(4.2, 4.6, 32);
      const auraMat = new THREE.MeshBasicMaterial({
        color: prod.colorHex,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const auraMesh = new THREE.Mesh(auraGeom, auraMat);
      mesh.add(auraMesh);
    });

    // Connecting Synaptic Lines
    const lineGroup = new THREE.Group();
    PRODUCTS_DATA.forEach((prod) => {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...prod.pos)];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: prod.colorHex,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(geom, mat);
      lineGroup.add(line);
    });
    scene.add(lineGroup);

    // Subtle raycasting for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    container.addEventListener("mousemove", onPointerMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Gentle floating constellation motion
      PRODUCTS_DATA.forEach((prod, idx) => {
        const mesh = nodeMeshes[idx];
        if (mesh) {
          mesh.position.y = prod.pos[1] + Math.sin(elapsed * 1.2 + idx * 2) * 1.5;
        }
      });

      // Gentle root node pulse
      centerMesh.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);

      // Raycast hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);

      if (intersects.length > 0) {
        const target = intersects[0].object as THREE.Mesh;
        setActiveNode(target.userData as ProductNodeData);
        target.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.15);
      } else {
        setActiveNode(null);
        nodeMeshes.forEach((m) => {
          m.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        });
      }

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("mousemove", onPointerMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[280px] sm:h-[340px] rounded-2xl border border-white/[0.05] bg-[#09090C]/40 overflow-hidden flex items-center justify-center"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" />

      {/* Top Legend */}
      <div className="absolute top-4 left-5 pointer-events-none flex items-center gap-2 text-xs text-neutral-400 font-sans">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FF]" />
        <span>Viyaan Intelligence Constellation</span>
      </div>

      {/* Active Node Flyout Card */}
      {activeNode && (
        <div className="absolute bottom-4 right-4 z-20 p-4 rounded-xl border border-white/10 bg-[#0E0E14]/90 backdrop-blur-md max-w-xs transition-all animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-sans uppercase tracking-wider text-neutral-400">
              {activeNode.category}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </div>
          <h4 className="font-display font-semibold text-sm text-white">{activeNode.name}</h4>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">{activeNode.tagline}</p>
          <a
            href={activeNode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 text-xs text-white hover:text-[#00B2FF] inline-flex items-center gap-1 font-sans transition-colors"
          >
            <span>Explore platform</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
