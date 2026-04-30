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
      // Resample ~30fps to capture scroll + section transitions.
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
      // Match the reflected section's exact width and position; preserve the
      // source's 3D transforms (perspective + rotateY) so the tilt carries
      // into the puddle correctly.
      mirror.style.width = `${rect.width}px`;
      mirror.style.height = `${rect.height}px`;
      mirror.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.position = "relative";
      clone.style.overflow = "hidden";
      clone.style.margin = "0";

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
      {/* Reflection: a window onto the bottom slice of the stage, flipped
          vertically so the seam between footer and stage acts as the
          waterline of a puddle.  */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{ height: "100%" }}
        aria-hidden
      >
        <div
          ref={mirrorRef}
          className="absolute top-0"
          style={{
            transform: "scaleY(-1)",
            transformOrigin: "center top",
            opacity: 0.9,
            filter: "saturate(0.85) brightness(0.65) contrast(1.05)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%)",
          }}
        />

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
