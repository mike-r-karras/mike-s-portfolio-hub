import type { ReactNode } from "react";
import { sectionOrder, type SectionId } from "@/components/portfolio/Nav";

type Section = { id: SectionId; node: ReactNode };

export function Footer({
  active,
  activeIndex,
  sections,
  onNavigate,
}: {
  active: SectionId;
  activeIndex: number;
  sections: Section[];
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <footer className="relative h-20 shrink-0 overflow-hidden border-t border-border/40 bg-background">
      {/* Wet pavement reflection of the active section */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ perspective: "1400px" }}
        aria-hidden
      >
        <div
          className="h-full w-full"
          style={{
            transform: "rotateY(10deg) scaleY(-1)",
            transformOrigin: "right top",
            transformStyle: "preserve-3d",
            opacity: 0.6,
            filter: "saturate(0.9) brightness(0.75)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)",
          }}
        >
          <div
            className="flex h-[600%] transition-transform duration-500 ease-in-out"
            style={{
              width: `${sections.length * 100}%`,
              transform: `translateX(-${activeIndex * (100 / sections.length)}%)`,
            }}
          >
            {sections.map((s) => (
              <div
                key={s.id}
                className="overflow-hidden"
                style={{ width: `${100 / sections.length}%` }}
              >
                <div className="flex min-h-full items-center">
                  <div className="w-full">{s.node}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wet sheen / streetlight gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--background) 30%, transparent) 0%, var(--background) 85%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-screen"
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

      {/* Reference active id to keep prop used (a11y / future hooks) */}
      <span className="sr-only">Current section: {active}</span>
    </footer>
  );
}
