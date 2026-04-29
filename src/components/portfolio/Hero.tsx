import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import portrait from "@/assets/mike-portrait.jpg";

export function Hero() {
  return (
    <section id="top" className="mx-auto max-w-3xl px-6 pt-24 pb-20 sm:pt-32">
      <div className="flex items-start gap-6">
        <img
          src={portrait}
          alt="Mike Karras portrait"
          className="h-24 w-24 rounded-full border border-white/80 object-cover sm:h-32 sm:w-32"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden />
            <span>Beaverton, Oregon</span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Mike Karras
          </h1>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Senior Software Engineer — Full Stack &amp; Cloud
          </p>
        </div>
      </div>
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
