import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-3xl px-6 pt-24 pb-20 sm:pt-32">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" aria-hidden />
        <span>Beaverton, Oregon</span>
      </div>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
        Mike Karras
      </h1>
      <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
        Senior Software Engineer — Full Stack &amp; Cloud
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <a href="#contact">Get in touch</a>
        </Button>
        <Button asChild variant="outline">
          <a href="#projects">View projects</a>
        </Button>
      </div>
    </section>
  );
}
