import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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

  // Listen for in-page anchor clicks (Hero CTAs use href="#contact" etc.)
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

  // Arrow key nav
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Nav active={active} onNavigate={goTo} />

      <main className="relative flex-1 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ width: `${sections.length * 100}%`, transform: `translateX(-${activeIndex * (100 / sections.length)}%)` }}
        >
          {sections.map((s) => (
            <div
              key={s.id}
              className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ width: `${100 / sections.length}%` }}
              aria-hidden={s.id !== active}
            >
              <div className="flex min-h-full items-center">
                <div className="w-full">{s.node}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Prev / Next buttons */}
        <button
          type="button"
          onClick={() => activeIndex > 0 && setActive(sectionOrder[activeIndex - 1])}
          disabled={activeIndex === 0}
          aria-label="Previous section"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background/70 p-2 text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-2">
          {sectionOrder.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-label={`Go to ${id}`}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
