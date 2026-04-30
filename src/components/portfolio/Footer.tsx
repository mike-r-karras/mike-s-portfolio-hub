import { useEffect, useState, type RefObject } from "react";
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
  const [stageHeight, setStageHeight] = useState(0);

  // Keep the reflected strip anchored to the real stage height so the
  // bottom edge of the section starts at the top of the reflection.
  useEffect(() => {
    let rafId = 0;
    let cancelled = false;

    const sync = () => {
      const nextHeight = sourceRef.current?.offsetHeight ?? 0;
      setStageHeight((current) => (Math.abs(current - nextHeight) > 1 ? nextHeight : current));

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
      {/* Reflection: a window onto the bottom slice of the stage, flipped
          vertically so the seam between footer and stage acts as the
          waterline of a puddle.  */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: "100%" }}
        aria-hidden
      >
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: stageHeight,
            height: stageHeight,
            transform: "scaleY(-1)",
            transformOrigin: "center top",
            opacity: 1,
            filter: "saturate(1.1) brightness(2.1) contrast(1.05)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0) 100%)",
            perspective: "1400px",
            perspectiveOrigin: "center center",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              transform: "translateZ(-180px) rotateY(10deg)",
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{
                width: `${sections.length * 100}%`,
                transform: `translateX(-${activeIndex * (100 / sections.length)}%)`,
              }}
            >
              {sections.map((s) => (
                <div
                  key={s.id}
                  className="h-full overflow-hidden"
                  style={{ width: `${100 / sections.length}%`, padding: "25px" }}
                >
                  <div
                    className="min-h-full flex items-end"
                    style={{
                      borderRadius: "20px",
                      border: "1.5px solid oklch(0.85 0.12 230)",
                      boxShadow:
                        "0 0 6px oklch(0.85 0.12 230 / 0.9), 0 0 18px oklch(0.78 0.18 230 / 0.7), 0 0 36px oklch(0.7 0.2 230 / 0.45), inset 0 0 12px oklch(0.85 0.15 230 / 0.25)",
                    }}
                  >
                    <div className="w-full">{s.node}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Light asphalt veil - wet, but you can still see through */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0.5) 100%)",
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
