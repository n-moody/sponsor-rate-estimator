RUNBOOK — Sponsor Rate Estimator

Date: 2026-03-18 (session)

Objective: Build an on-demand Sponsor Rate Estimator for podcasters that produces a polished media-kit PDF tailored to their inputs.

Actions completed
- Selected approach: Netlify Functions + DocRaptor for on-demand HTML->PDF rendering.
- Created and polished landing page (index.html) and media-kit HTML templates (small/mid/large).
- Implemented GitHub Actions flow to generate initial PDFs during development (committed PDFs to repo). Used a temporary PAT secret to allow the workflow to push generated PDFs.
- Added a Netlify Function plan and sample function code (to be implemented) to render HTML and call DocRaptor.
- Set up deploy automation (deploy keys) to allow agent pushes; created and used deploy_key_2 for repo pushes.
- Added automated workflow (.github/workflows/generate-pdfs.yml) to generate PDFs on push; revised to use REPO_PUSH_TOKEN secret for pushing.
- Polished HTML/CSS for landing and media kits and pushed to repo; Netlify site is live at https://silly-cannoli-3ea7d2.netlify.app/.

Files of interest
- index.html — landing page (polished) (repo root)
- media_kit_small.html, media_kit_mid.html, media_kit_large.html — template files (repo root)
- media_kit_*.pdf — generated PDF outputs (repo root)
- .github/workflows/generate-pdfs.yml — GH Actions workflow for PDF generation
- netlify/functions/generate-pdf.js — function (mock + DocRaptor path)
- RUNBOOK.md — this file (versioned in repo)

Rate-limit event (logs captured)
- 2026-03-18T18:27:23Z — agent/embedded reported an OpenAI rate-limit:
  "Rate limit reached for gpt-5-mini in organization org-0vAbuUboOft1UF2MtvZaHXGb on tokens per min (TPM): Limit 500000, Used 351917, Requested 157026. Please try again in 1.073s."

Mitigations applied / to apply
- Added Rate-limit & API‑Respect policy to SOUL.md (throttling, batching, subagents).  
- Operational mitigations: batch commits, throttle background scans, limit LLM calls for low-value tasks, use client-side preview for PDFs, use DocRaptor for high-fidelity server generation.
- Action item: add monitoring to log rate-limit events and backoff logic in subagents (exponential backoff and alerting to RUNBOOK.md).

Next steps (recommended and required items)
1) DocRaptor key: add DOC_RAPTOR_KEY to Netlify environment variables (or provide key for me to add). This enables on-demand PDF generation.
2) Netlify function implementation: I will add netlify/functions/generate-pdf.js to the repo (Node) which will: accept POST JSON, render HTML, call DocRaptor, and return PDF (base64). I will connect the frontend form to this function.
3) Improve design: refine the landing form and media-kit layout with podcast-specific styling and improved copy. I will implement a first design pass.
4) Outreach list: prepare 40 target contacts and outreach copy (ready for your review). No sends until you approve.
5) Security: after automation is validated, rotate or revoke any temporary deploy keys / PATs if you want. (You currently requested to keep keys for now.)

If you need any of these performed now (deploy the Netlify function, convert PDFs via API, or finalize outreach), say which step and I'll do it.
