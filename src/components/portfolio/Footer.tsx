import { sectionOrder, type SectionId } from "@/components/portfolio/Nav";
import { WetReflectionGL } from "@/components/portfolio/WetReflectionGL";
import type { RefObject } from "react";

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
  return (
    <footer
      className="relative shrink-0 overflow-hidden border-t border-border/40"
      style={{ height: "20vh", background: "#000" }}
    >
      {/* WebGL wet-asphalt reflection of the stage above */}
      <WetReflectionGL
        sourceRef={sourceRef}
        refreshKey={active}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Foreground footer content (dots + copyright) */}
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
