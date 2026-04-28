export const sectionOrder = ["top", "about", "skills", "projects", "contact"] as const;
export type SectionId = (typeof sectionOrder)[number];

const links: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export function Nav({
  active,
  onNavigate,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => onNavigate("top")}
          className="font-semibold tracking-tight text-foreground"
        >
          MK
        </button>
        <ul className="flex items-center gap-6 text-sm text-muted-foreground">
          {links.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onNavigate(l.id)}
                className={`transition-colors hover:text-foreground ${
                  active === l.id ? "text-foreground" : ""
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
