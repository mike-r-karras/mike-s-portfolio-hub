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

  // Continuously mirror the live DOM of the source (the <main> stage) into the footer.
  useEffect(() => {
    const mirror = mirrorRef.current;
    const source = sourceRef.current;
    if (!mirror || !source) return;

    let rafId = 0;
    let cancelled = false;

    const sync = () => {
      // Throttle to ~30fps to keep reflection smooth without overworking the CPU.
      const now = performance.now();
      if (now - lastCloneAt.current < 33) {
        rafId = requestAnimationFrame(sync);
        return;
      }
      lastCloneAt.current = now;

      const clone = source.cloneNode(true) as HTMLElement;
      // Strip interactive bits — reflection should be visual only.
      clone.querySelectorAll("button, a, input, [tabindex]").forEach((el) => {
        (el as HTMLElement).removeAttribute("tabindex");
        (el as HTMLElement).setAttribute("aria-hidden", "true");
        (el as HTMLElement).style.pointerEvents = "none";
      });
      // Force size to match source so transform math lines up.
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
    <footer className="relative h-20 shrink-0 overflow-hidden border-t border-border/40 bg-background">
      {/* Wet pavement reflection — live mirror of the stage above */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute left-0 right-0 bottom-0"
          style={{
            // Flip vertically so the reflection sits "below" the content.
            transform: "scaleY(-1)",
            transformOrigin: "bottom center",
            // Pull the mirror up so the TOP edge of the source aligns with the
            // top of the footer (i.e. reflection of what sits just above the seam).
            height: "100vh",
            opacity: 0.55,
            filter: "saturate(0.9) brightness(0.7) contrast(1.05)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div ref={mirrorRef} className="h-full w-full" />
        </div>

        {/* Wet sheen veil */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--background) 20%, transparent) 0%, var(--background) 90%)",
          }}
        />
        {/* Subtle horizontal streak shimmer for "wet" feel */}
        <div
          className="absolute inset-0 opacity-15 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, color-mix(in oklab, var(--foreground) 25%, transparent), transparent 60%), radial-gradient(ellipse at 75% 0%, color-mix(in oklab, var(--foreground) 15%, transparent), transparent 55%)",
          }}
        />
      </div>

      {/* Foreground footer content */}
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-end gap-3 px-6 pb-4">
        <div className="flex gap-2">
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
