import { useEffect, useRef, type RefObject } from "react";
import { sectionOrder, type SectionId } from "@/components/portfolio/Nav";

type Section = { id: SectionId; node: React.ReactNode };

export function Footer({
  active,
  activeIndex,
  sections,
  onNavigate,
  sourceRef,
}: {
  active: SectionId;
  activeIndex: number;
  sections: Section[];
  onNavigate: (id: SectionId) => void;
  sourceRef: RefObject<HTMLElement | null>;
}) {
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const lastCloneAt = useRef(0);

  // Live-mirror the stage DOM into the footer. Browser renders the clone
  // with real CSS (oklch, gradients, etc.), so colors stay accurate.
  useEffect(() => {
    const mirror = mirrorRef.current;
    const source = sourceRef.current;
    console.log("[Footer] mirror effect", { mirror: !!mirror, source: !!source });
    if (!mirror || !source) return;

    let rafId = 0;
    let cancelled = false;

    const sync = () => {
      const now = performance.now();
      if (now - lastCloneAt.current < 33) {
        rafId = requestAnimationFrame(sync);
        return;
      }
      lastCloneAt.current = now;

      const clone = source.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("button, a, input, [tabindex]").forEach((el) => {
        (el as HTMLElement).removeAttribute("tabindex");
        (el as HTMLElement).setAttribute("aria-hidden", "true");
        (el as HTMLElement).style.pointerEvents = "none";
      });
      // The stage uses CSS 3D (perspective + rotateY) which, when cloned and
      // flipped, projects content outside the footer's clip region. Remove
      // only the 3D bits; keep the 2D translateX that drives the carousel.
      clone.style.perspective = "none";
      clone.querySelectorAll<HTMLElement>("*").forEach((el) => {
        const t = el.style.transform;
        if (t && /rotate[XY]|translateZ|perspective/.test(t)) {
          el.style.transform = "none";
        }
        el.style.perspective = "none";
        el.style.transformStyle = "flat";
      });

      const rect = source.getBoundingClientRect();
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.position = "relative";
      clone.style.overflow = "hidden";

      mirror.replaceChildren(clone);


      if (!cancelled) rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [sourceRef]);

  return (
    <footer
      className="relative shrink-0 overflow-hidden border-t border-border/40"
      style={{ height: "20vh", background: "#000" }}
    >
      {/* SVG wet-ripple displacement filter */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="wet-ripple" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.06"
              numOctaves="2"
              seed="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="14s"
                values="0.012 0.06; 0.018 0.07; 0.012 0.06"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Reflection: live mirror of the stage, flipped + rippled + faded.
          Anchored at the TOP of the footer so the puddle reflects the
          content sitting just above the seam. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-0 right-0 top-0"
          style={{
            transform: "scaleY(-1)",
            transformOrigin: "top center",
            height: "80vh",
            opacity: 0.85,
            filter: "url(#wet-ripple) saturate(0.85) brightness(0.6) contrast(1.05)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div ref={mirrorRef} className="h-full w-full" />
        </div>

        {/* Light asphalt veil - wet, but you can still see through */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Specular streak shimmer */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 30% 0%, rgba(255,255,255,0.25), transparent 60%), radial-gradient(ellipse 70% 35% at 75% 0%, rgba(255,255,255,0.15), transparent 55%)",
          }}
        />
      </div>

      {/* Foreground footer content */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 pb-4">
        <div className="pointer-events-auto flex gap-2">
          {sectionOrder.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-label={`Go to ${id}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mike Karras
        </p>
      </div>

      <span className="sr-only">
        Current section: {active} ({sections.length} total)
      </span>
    </footer>
  );
}
