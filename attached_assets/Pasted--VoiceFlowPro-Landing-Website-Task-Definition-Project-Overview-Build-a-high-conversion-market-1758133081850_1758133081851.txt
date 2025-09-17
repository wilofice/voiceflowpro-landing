# VoiceFlowPro Landing Website Task Definition

## Project Overview
- Build a high-conversion marketing site for VoiceFlowPro, the cross-platform desktop transcription suite (Electron + React + Node.js) shipping on macOS, Windows, and Linux.
- Guide visitors through discovery → evaluation → download/subscribe using transparent messaging on privacy, performance, and team readiness.
- Position the site as the canonical source for product updates, pricing, legal policies, and support channels.

## Objectives & KPIs
- Conversion: Hero and pricing CTAs ≥6% click-through, download-to-signup ≥35%, paid upgrade ≥12% within 30 days.
- Engagement: Newsletter opt-in ≥4%, FAQ bounce <35%, average session duration >2:00.
- Quality: ≤1.5s LCP on mid-tier hardware, Lighthouse ≥90 across Performance/Accessibility/Best Practices/SEO, zero critical accessibility defects.

## Personas & Messaging Inputs
- Investigative Journalist "Alex": keyboard-first workflows, needs offline transcription, strict privacy guarantees, value prop "Own your interviews end-to-end." 
- Podcast Producer "Riley": batch automation, collaboration exports, expects automation hooks; value prop "Ship episodes faster with automated prep." 
- Secondary: Legal/Compliance reviewer (privacy posture, retention), Accessibility coordinator (WCAG compliance).
- Social proof priorities: customer logos (newsroom, podcast network), user count, cumulative transcript hours, Trustpilot/press quotes.

## Brand & Design Tokens (Extracted)
- Colors: Primary `#3B82F6`, Surface `#101827`, Surface Alt `#1F2937`, Text Primary `#F9FAFB`, Text Secondary `#9CA3AF`, Success `#10B981`, Warning `#F59E0B`, Danger `#EF4444`.
- Typography: Headlines `Inter` (weights 500/700), Body `Inter` 400/500, Mono `JetBrains Mono`. Scale: 12, 14, 16, 18, 20, 24, 32, 40.
- Spacing: 8px base grid, section padding 96px desktop / 64px tablet / 48px mobile, cards radius 12px, buttons radius 10px.
- Components: Tailwind + Radix UI primitives, motion guidelines (hero fade+slide 250ms, button hover 120ms).

## External Dependencies & Assets
- Provide zipped design kit (color styles, text styles, UI components) and high-res app screenshots (2560×1600, annotated and clean variants).
- Supply persona briefs, brand voice doc, and approved testimonials. Source comparison data versus MacWhisper, Descript, Otter.ai.
- Legal team to deliver Terms, Privacy, Cookie Policy, Data Processing Addendum drafts; marketing to provide press kit assets (logos, founder photos, boilerplate).

## Information Architecture & UX Flow
- Primary nav: Product, Features, Pricing, Resources, Download, Contact.
- Home: hero with OS-aware CTA, workflow narrative (Capture → Transcribe → Edit → Publish), accessibility & security callouts, testimonial carousel, competitor comparison, conversion footer.
- Pricing: Starter (free), Pro (monthly/annual, $ plans TBD), Team (seat-based). Include feature matrix, guarantee/refund note, urgency tactic (next price review date), anchor plan order.
- Download: OS tabs, installer links (direct CDN), checksum hashes, release notes, auto-update instructions, beta channel opt-in, system requirements.
- Resources hub: FAQ (searchable), Blog (launch article + roadmap teasers), API docs teaser, integration guides, support widget surface.
- Legal: dedicated hub linking Terms, Privacy, Cookie Policy, DPA request form.

## Technical Approach & Rationale
- Framework: Next.js 14 (App Router) with TypeScript for SSR/SSG flexibility, incremental static regeneration for blog/legal updates, internationalization readiness.
- Styling/UI: Tailwind CSS + Radix UI for parity with product UI components; ensures consistency and accessibility primitives out of the box.
- Content layer: MDX + Contentlayer or Supabase-backed CMS (reuse existing Supabase infrastructure) for collaborative editing; Supabase chosen for existing auth/storage, newsletter/contact table, beta-channel signup.
- Payments: Stripe Checkout (monthly/annual) with ability to switch to Paddle if tax handling required; integrate link from pricing CTAs.
- Forms & Integrations: Resend + Supabase edge functions for double opt-in, webhook for support requests, PostHog (or Plausible) for event tracking.
- Auto-update references: link to desktop app update feed, FAQ entry on in-app updater (Sparkle/macOS, Squirrel/Windows, AppImage update instructions).

## Distribution & Hosting Strategy
- Hosting on Vercel with production domain `voiceflowpro.com`; staging at `staging.voiceflowpro.com` (password-protected via Vercel protection or Basic Auth) and PR previews for reviews.
- Assets stored on CDN (Vercel Edge or Supabase Storage) with versioned installer paths (`/downloads/{os}/{version}/VoiceFlowPro-{os}-{version}.zip`).
- Provide beta/stable channels: beta toggle on download page, separate Supabase storage bucket and mailing list segment.
- Document bandwidth expectations and budget for CDN (estimate based on projected downloads; include monitoring plan).

## Conversion & Experimentation Plan
- Implement A/B testing via Vercel Experiments or GrowthBook (feature flag through Supabase) for hero copy, pricing CTA, download button color.
- Plan exit-intent modal offering newsletter sign-up or case study download; follow consent rules.
- Retargeting hooks: optional Meta/LinkedIn pixels (enable only after consent), include instructions for delaying load until acceptance.
- Social proof: dynamic counters for downloads, active teams, testimonials, press quotes slider; update schedule documented in CMS.

## Analytics & Privacy Alignment
- Default analytics: Plausible (self-hosted or EU region) with documented events (hero_cta_click, pricing_toggle, download_start, newsletter_opt_in).
- Optional GA4 flagged as disabled by default; document activation steps and privacy implications.
- Cookie consent banner (Radix Dialog) with granular toggles; store consent in Supabase, expose API for suppression.
- Publish privacy page section outlining data collected, retention schedule, DSR contact, and analytics partners.

## Accessibility, Security & Compliance
- WCAG 2.2 AA checklist embedded in QA; use axe-core CI and manual keyboard walkthrough.
- Security headers configured via `next.config.js` (CSP, HSTS, X-Frame-Options, Referrer-Policy). Weekly automated OWASP ZAP scan pre-launch.
- Comply with GDPR/CCPA: data mapping, DPA request workflow, unsubscribe automation. Document SOC2 roadmap statements consistent with business plans.

## Content Production & Editorial Calendar
- Screenshot requirements: 16:9 ratio, retina resolution, both light/dark modes; annotate key flows (Transcription, Batch automation, Integration settings).
- Video demo: 90-second hero video (script + storyboard) hosted on Vimeo Pro with privacy-enabled embed; 30-second social teaser variations.
- Testimonials: collect 3 journalist quotes, 2 podcast producers, include headshots (min 800×800) and attribution.
- Blog launch calendar: announcement post (Day 0), "Behind the Models" deep dive (Day 7), "Workflow automation" use case (Day 21).

## Competitive Positioning Guidance
- Comparison table columns: VoiceFlowPro, MacWhisper, Descript, Otter.ai. Rows: Offline support, Batch automation, Collaboration exports, Privacy (on-device vs cloud), Pricing, Platform availability.
- Highlight differentiators: Metal-accelerated offline inference, Supabase sync, keyboard-first UI, compliance commitments.
- Include competitor disclaimers and data sources (last verified date) to maintain credibility.

## Budget, Resources & Assumptions
- Estimated budget range: $35k–$55k covering design, development, QA, content production, analytics setup (adjust after discovery).
- Roles & owners: Web developer (implementation, CI), Product designer (Figma, components), Copywriter (marketing + legal coordination), Motion designer (hero/video), Product marketing (testimonials, PR), Legal counsel (policies), Analytics specialist (dashboards), Project manager (timeline + approvals).
- Scope guardrails: changes beyond defined pages/components require change request; maintain 10% contingency budget/time.

## Workflow, Milestones & Deliverables
1. Discovery (Week 1): confirm personas, finalize sitemap, audit existing Supabase infrastructure, gather assets, approve budget.
2. Design (Weeks 2-3): wireframes → high-fidelity comps → design system tokens → stakeholder review → motion prototypes.
3. Build (Weeks 4-6): implement pages, integrate CMS, configure analytics/testing, hook Supabase newsletter, Stripe checkout, auto-update info.
4. QA & Launch Prep (Week 7): accessibility audit, performance budget validation (Lighthouse, WebPageTest, SpeedCurve), cross-browser/device QA (Chrome, Safari, Firefox, Edge, iOS Safari, Android Chrome), content proofing, legal approval.
5. Launch & Post-Launch (Week 8): soft launch to beta list, monitor metrics, formal announcement, incident response plan. Post-launch review at +30 days with funnel analysis and experiment backlog.

## Success Metrics & Reporting
- Funnel definition: visits → hero CTA → download → install (tracked via in-app ping) → account creation → paid upgrade.
- Event spec doc: include event name, description, trigger, properties, owner, destination (Plausible/PostHog).
- Dashboards: weekly KPI snapshot in Supabase or Looker Studio; automated report every Monday with commentary.
- Set quarterly OKRs for site (traffic growth, conversion lifts) and align with product roadmap checkpoints.

## Launch & Promotion Strategy
- Staging reviews via password-protected `staging.voiceflowpro.com`; deploy preview links for async feedback.
- Soft launch: invite beta cohort (top 50 customers) 1 week prior, gather qualitative feedback, ensure installer mirrors production.
- Public launch: coordinate press embargo, publish blog + press release, schedule social media posts (LinkedIn, Twitter, YouTube demo), send newsletter + drip email sequence (announcement, customer story, feature deep dive).
- Support readiness: set up help center updates, live chat widget (Crisp/Intercom) or fallback contact form with 24h SLA.

## Trust Builders & Quick Wins
- Pricing psychology: display best-value badge on annual plan, mention 14-day refund policy, highlight limited-time launch offer.
- Trust signals: security badges (GDPR ready, SOC2 roadmap), company info (team bios, HQ), customer logos, G2/Trustpilot badges.
- Support widget integration (e.g., HelpScout Beacon) with context-aware suggestions; include knowledge base linking to desktop documentation.
- API documentation teaser with CTA to request early access if APIs forthcoming.
- Affiliate & partner program placeholder: capture interest via form, outline commission structure TBD.

## Handoff & Maintenance
- Deliver developer README (setup commands `npm install`, `npm run dev`, `npm run lint`, `npm run build`, `npm run test` if added), `.env.example`, infrastructure diagram.
- Document deployment workflow (Vercel branching strategy, approvals), content editing SOP, analytics governance (data retention, access levels).
- Establish backlog for ongoing CRO experiments, content refresh cadence (quarterly), and integration roadmap alignment with desktop release schedule.
