import { Badge } from "@/components/ui/badge";

const groups: { title: string; items: string[] }[] = [
  {
    title: "Languages & Frameworks",
    items: ["Node.js", "React", "Next.js", "TypeScript", "Python", "PHP"],
  },
  {
    title: "Cloud / AWS",
    items: ["Lambda", "API Gateway", "S3", "SQS", "SNS", "EventBridge"],
  },
  {
    title: "Infra & DevOps",
    items: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MongoDB", "MySQL"],
  },
];

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Skills
      </h2>
      <div className="mt-8 space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-3 text-sm font-medium text-foreground/80">
              {g.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="border-border/60 px-3 py-1 text-xs font-normal text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
