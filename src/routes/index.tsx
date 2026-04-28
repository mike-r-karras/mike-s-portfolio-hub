import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Nav, type SectionId, sectionOrder } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mike Karras — Senior Software Engineer" },
      {
        name: "description",
        content:
          "Senior Software Engineer in Beaverton, OR specializing in Node.js, React, and AWS serverless architecture.",
      },
      { property: "og:title", content: "Mike Karras — Senior Software Engineer" },
      {
        property: "og:description",
        content:
          "Senior Software Engineer in Beaverton, OR specializing in Node.js, React, and AWS serverless architecture.",
      },
    ],
  }),
});

function Index() {
  const [active, setActive] = useState<SectionId>("top");

  const goTo = useCallback((id: SectionId) => {
    setActive(id);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const id = href.slice(1) as SectionId;
      if ((sectionOrder as readonly string[]).includes(id)) {
        e.preventDefault();
        setActive(id);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = sectionOrder.indexOf(active);
      if (e.key === "ArrowRight" && idx < sectionOrder.length - 1) {
        setActive(sectionOrder[idx + 1]);
      } else if (e.key === "ArrowLeft" && idx > 0) {
        setActive(sectionOrder[idx - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const activeIndex = sectionOrder.indexOf(active);

  const sections = [
    { id: "top" as const, node: <Hero /> },
    { id: "about" as const, node: <About /> },
    { id: "skills" as const, node: <Skills /> },
    { id: "projects" as const, node: <Projects /> },
    { id: "contact" as const, node: <Contact /> },
  ];

  const renderPanel = (s: (typeof sections)[number]) => (
    <div
      key={s.id}
      className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ width: `${100 / sections.length}%`, padding: "25px" }}
      aria-hidden={s.id !== active}
    >
      <div
        className="min-h-full flex items-center"
        style={{
          borderRadius: "20px",
          border: "1.5px solid oklch(0.85 0.12 230)",
          boxShadow:
            "0 0 6px oklch(0.85 0.12 230 / 0.9), 0 0 18px oklch(0.78 0.18 230 / 0.7), 0 0 36px oklch(0.7 0.2 230 / 0.45), inset 0 0 12px oklch(0.85 0.15 230 / 0.25)",
          padding: "10px",
        }}
      >
        <div className="w-full">{s.node}</div>
      </div>
    </div>
  );

  const stageRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Nav active={active} onNavigate={goTo} />

      <main className="relative flex-1 overflow-hidden" style={{ perspective: "1400px" }} ref={stageRef}>
        {/* Tilted stage — angles away from viewer L→R */}
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
            {sections.map(renderPanel)}
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button
          type="button"
          onClick={() => activeIndex > 0 && setActive(sectionOrder[activeIndex - 1])}
          disabled={activeIndex === 0}
          aria-label="Previous section"
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() =>
            activeIndex < sectionOrder.length - 1 && setActive(sectionOrder[activeIndex + 1])
          }
          disabled={activeIndex === sectionOrder.length - 1}
          aria-label="Next section"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </main>

      <Footer
        active={active}
        activeIndex={activeIndex}
        sections={sections}
        onNavigate={goTo}
        sourceRef={stageRef}
      />
    </div>
  );
}
