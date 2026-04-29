import profilePhoto from "@/assets/profile-photo.jpg";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        About
      </h2>
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <img
          src={profilePhoto}
          alt="Portrait photo"
          className="h-32 w-32 flex-shrink-0 rounded-full border border-white/80 object-cover"
        />
        <div className="space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            Senior Software Engineer with 15+ years of experience building
            scalable, cloud-based applications. Specializes in Node.js, React,
            and AWS serverless architecture.
          </p>
          <p>Strong background in:</p>
          <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
            <li>Microservices and system design</li>
            <li>CI/CD automation and infrastructure-as-code</li>
            <li>Debugging and improving complex production systems</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
