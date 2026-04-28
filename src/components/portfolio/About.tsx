export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        About
      </h2>
      <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/90">
        <p>
          Senior Software Engineer with 15+ years of experience building
          scalable, cloud-based applications. Specializes in Node.js, React, and
          AWS serverless architecture.
        </p>
        <p>Strong background in:</p>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Microservices and system design</li>
          <li>CI/CD automation and infrastructure-as-code</li>
          <li>Debugging and improving complex production systems</li>
        </ul>
      </div>
    </section>
  );
}
