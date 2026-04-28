import microservicesImage from "@/assets/microservices-network.png";

type Project = {
  title: string;
  description: string;
  stack: string[];
  image?: string;
};

const projects: Project[] = [
  {
    title: "Microservices Migration Platform",
    description:
      "Migrated a legacy monolith to scalable microservices using Node.js and AWS Lambda. Improved deployment speed and system scalability.",
    stack: ["Node.js", "AWS Lambda", "API Gateway"],
    image: microservicesImage,
  },
  {
    title: "Secure Document Collaboration System",
    description:
      "Built a secure document exchange platform with malware scanning using AWS Lambda.",
    stack: ["AWS Lambda", "S3", "Node.js"],
  },
  {
    title: "Branch-Aware Docker Environment",
    description:
      "Created a system to spin up multi-service environments with correct branch alignment for QA testing.",
    stack: ["Docker", "CI/CD", "Bash"],
  },
  {
    title: "Healthcare SSO Integration",
    description:
      "Implemented OAuth/Okta-based authentication and third-party integrations for healthcare systems.",
    stack: ["OAuth", "Okta", "Node.js"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Projects
      </h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <article
            key={p.title}
            className="group flex flex-col rounded-lg border border-border/60 bg-card/30 p-6 transition-colors hover:border-foreground/30"
          >
            <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {p.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-foreground/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
