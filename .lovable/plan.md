## Mike Karras — Developer Portfolio

A clean, toggleable light/dark-mode, single-page portfolio built on the existing TanStack Start + Tailwind stack. Everything lives in `src/routes/index.tsx` with a few small section components for readability.

### Page structure (single scroll)

1. **Header / Nav**
  - Minimal sticky top bar: "MK" monogram on the left, in-page anchor links on the right (About · Skills · Projects · Contact).
  - Subtle border on scroll, no heavy shadow.
2. **Hero**
  - Name: **Mike Karras**
  - Title: *Senior Software Engineer — Full Stack & Cloud*
  - Location line with a small pin icon: *Beaverton, Oregon*
  - Two quiet CTAs: "Get in touch" (scrolls to Contact) and "View projects" (scrolls to Projects).
  - Generous vertical spacing, large display type, no background image.
3. **About**
  - 3–5 sentence bio exactly as provided, plus the 3 "Strong background in" bullets rendered as a tight list.
4. **Skills**
  - Grouped chips/badges for visual scanability:
    - **Languages & Frameworks**: Node.js, React, Next.js, TypeScript,python,PHP
    - **Cloud / AWS**: Lambda, API Gateway, S3, SQS, SNS, EventBridge
    - **Infra & DevOps**: Docker, Kubernetes, Terraform, GitHub Actions, Jenkins
    - **Databases**: PostgreSQL, MongoDB, MySQL
  - Uses the existing shadcn `Badge` component, outlined variant, subtle hover.
5. **Projects** (4 cards, responsive grid: 1 col mobile, 2 col desktop)
  - Microservices Migration Platform — Node.js · AWS Lambda · API Gateway
  - Secure Document Collaboration System — AWS Lambda · S3 · Node.js
  - Branch-Aware Docker Environment — Docker · CI/CD · Bash
  - Healthcare SSO Integration — OAuth · Okta · Node.js
  - Each card: title, 1–2 sentence description, tech tags at the bottom. Border-only card, subtle border-color lift on hover (no scale/shadow chaos).
6. **Contact**
  - Email link: [mike.r.karras@gmail.com](mailto:mike.r.karras@gmail.com) (mailto)
  - GitHub link (placeholder `#`, opens in new tab)
  - LinkedIn link (placeholder `#`, opens in new tab)
  - Rendered as three clean icon + label rows.
7. **Footer**
  - © 2026 Mike Karras · small muted text.

### Design system

- **Mode**: Dark by default — add `class="dark"` to the `<html>` in `__root.tsx` so the existing dark tokens in `styles.css` take over. No theme toggle (keeps it minimal as requested).
- **Typography**: Inter via Google Fonts for body, tight tracking on the hero name. Existing Tailwind font stack otherwise.
- **Color**: Use existing semantic tokens (`background`, `foreground`, `muted-foreground`, `border`, `primary`) — no new palette needed. Accent kept neutral (no neon).
- **Spacing**: Section padding `py-24`, container `max-w-3xl` for text sections, `max-w-5xl` for projects grid.
- **Interactions**: `transition-colors` on links/cards only. No transforms, no parallax.
- **Responsive**: Mobile-first; nav collapses to just anchor text (no hamburger needed at this density).

### SEO / Meta

Update the root route head:

- Title: *Mike Karras — Senior Software Engineer*
- Description: *Senior Software Engineer in Beaverton, OR specializing in Node.js, React, and AWS serverless architecture.*
- og:title / og:description mirror the above.

### Technical notes

- Single route file: replace the placeholder in `src/routes/index.tsx` with the real homepage.
- Extract sections into `src/components/portfolio/{Hero,About,Skills,Projects,Contact,Nav,Footer}.tsx` for clarity (small files, easy to tweak).
- Use existing shadcn `Badge` and `Button` components; no new deps required.
- Add `lucide-react` icons (already a transitive dep via shadcn) for Mail / Github / Linkedin / MapPin.
- Smooth in-page scrolling via `scroll-behavior: smooth` on `html` in `styles.css` and `id="..."` anchors on each section.
- Update meta tags in `src/routes/__root.tsx` with the portfolio info.

No backend, no database, no auth — purely static content rendered by SSR.