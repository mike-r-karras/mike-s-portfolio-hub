import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
