import { Mail, Github, Linkedin } from "lucide-react";

const links = [
  {
    icon: Mail,
    label: "mike.r.karras@gmail.com",
    href: "mailto:mike.r.karras@gmail.com",
    external: false,
  },
  { icon: Github, label: "GitHub", href: "https://github.com/mike-r-karras", external: true },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mike-karras-187b481b/", external: true },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        Contact
      </h2>
      <p className="mt-6 text-base text-foreground/90">
        Open to senior engineering roles and interesting consulting work.
        <br />
        The fastest way to reach me is email.
      </p>
      <ul className="mt-8 space-y-3">
        {links.map(({ icon: Icon, label, href, external }) => (
          <li key={label}>
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group inline-flex items-center gap-3 text-foreground/80 transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
