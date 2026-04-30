import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mike Karras — Senior Software Engineer" },
      {
        name: "description",
        content:
          "Senior Software Engineer in Beaverton, OR specializing in Node.js, React, and AWS serverless architecture.",
      },
      { name: "author", content: "Mike Karras" },
      { property: "og:title", content: "Mike Karras — Senior Software Engineer" },
      {
        property: "og:description",
        content:
          "Senior Software Engineer in Beaverton, OR specializing in Node.js, React, and AWS serverless architecture.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Mike Karras — Senior Software Engineer" },
      { name: "description", content: "Portfolio for Mike Karras, Senior Software Engineer" },
      { property: "og:description", content: "Portfolio for Mike Karras, Senior Software Engineer" },
      { name: "twitter:description", content: "Portfolio for Mike Karras, Senior Software Engineer" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86842c4e-7705-4f08-a119-0837430b6a72/id-preview-81886043--a083b030-ccfc-49e6-9c4f-d107c3fa5322.lovable.app-1777564819358.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/86842c4e-7705-4f08-a119-0837430b6a72/id-preview-81886043--a083b030-ccfc-49e6-9c4f-d107c3fa5322.lovable.app-1777564819358.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
