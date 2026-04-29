import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import html2canvas from "html2canvas";

/**
 * Renders a wet-asphalt style WebGL reflection of the DOM node referenced
 * by `sourceRef`. The reflection re-captures whenever `refreshKey` changes
 * (e.g. when the active section switches) and at a slow idle interval.
 */
export function WetReflectionGL({
  sourceRef,
  refreshKey,
  className,
  style,
}: {
  sourceRef: RefObject<HTMLElement | null>;
  refreshKey?: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!container || !canvas || !source) return;

    let animationId = 0;
    let disposed = false;

    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      1,
      1000,
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    // Placeholder texture until first capture lands
    const placeholder = document.createElement("canvas");
    placeholder.width = 4;
    placeholder.height = 4;
    let texture: THREE.Texture = new THREE.CanvasTexture(placeholder);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uTime;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          // Flip vertically — reflection of what sits above
          uv.y = 1.0 - uv.y;

          // Wave + ripple distortion (stronger near the "near" edge / top of reflection)
          float depth = vUv.y; // 0 at top of reflection (near content), 1 at bottom (far)
          float strength = mix(0.012, 0.003, depth);
          float wave   = sin(uv.y * 40.0 + uTime * 2.0) * strength;
          float ripple = sin(uv.y * 90.0 - uTime * 3.0) * strength * 0.5;
          uv.x += wave + ripple;

          if (uv.x < 0.0 || uv.x > 1.0) { gl_FragColor = vec4(0.0); return; }

          vec4 color = texture2D(uTexture, uv);

          // Wet-asphalt darkening + fade to black with depth
          color.rgb *= 0.55;
          float fade = smoothstep(0.0, 1.0, vUv.y);
          color.rgb *= (1.0 - fade * 0.85);
          color.a   *= (1.0 - fade * 0.6);

          gl_FragColor = color;
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let capturing = false;
    const capture = async () => {
      if (capturing || disposed) return;
      capturing = true;
      try {
        const snapshot = await html2canvas(source, {
          backgroundColor: null,
          logging: false,
          scale: 1,
          useCORS: true,
        });
        if (disposed) return;
        const next = new THREE.CanvasTexture(snapshot);
        next.wrapS = next.wrapT = THREE.MirroredRepeatWrapping;
        material.uniforms.uTexture.value = next;
        texture.dispose();
        texture = next;
      } catch {
        /* ignore capture failures */
      } finally {
        capturing = false;
      }
    };

    capture();
    const intervalId = window.setInterval(capture, 1500);

    const animate = () => {
      material.uniforms.uTime.value += 0.03;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      camera.left = w / -2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = h / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Re-capture shortly after refreshKey changes (lets DOM settle after transition)
    const kickId = window.setTimeout(capture, 600);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      window.clearInterval(intervalId);
      window.clearTimeout(kickId);
      ro.disconnect();
      renderer.dispose();
      material.dispose();
      mesh.geometry.dispose();
      texture.dispose();
    };
  }, [sourceRef, refreshKey]);

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", background: "#000" }}
      />
    </div>
  );
}
