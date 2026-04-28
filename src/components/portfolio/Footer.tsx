export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 py-10">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mike Karras
      </p>
    </footer>
  );
}
