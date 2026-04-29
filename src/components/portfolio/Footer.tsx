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
      const rect = source.getBoundingClientRect();
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.position = "relative";

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

      {/* Reflection: live mirror of the stage, flipped + rippled + faded */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            transform: "scaleY(-1)",
            transformOrigin: "bottom center",
            height: "100vh",
            opacity: 0.7,
            filter: "url(#wet-ripple) saturate(0.85) brightness(0.55) contrast(1.1)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div ref={mirrorRef} className="h-full w-full" />
        </div>

        {/* Black wet veil — heavier than before, this is asphalt */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 70%, #000 100%)",
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
