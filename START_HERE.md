# Start here

This folder is your project. Everything Claude Code needs is already inside.

```
nabeen-website/
├── START_HERE.md              ← you are here
├── CLAUDE_CODE_PROMPT.md      ← paste this into Claude Code
├── CLAUDE.md                  ← standing rules; Claude Code reads it automatically
└── brand-kit/
    ├── docs/                  ← brief, design system, pages, SEO/perf/a11y, open questions
    ├── content/               ← all page copy + site.json (facts with statuses) + 3 journal posts
    ├── design/                ← tokens.css + style-guide.html (open in a browser)
    ├── assets/                ← logos, gallery, manufacturing, brand imagery, brochure pages
    └── source-documents/      ← the client's original PDFs + Binoli's WhatsApp brief
```

## Steps
1. Unzip, and open `brand-kit/design/style-guide.html` in Chrome. This is the look and feel. Share a screenshot with Binoli for a quick yes before building much.
2. Open a terminal in `nabeen-website/`, run `git init`, then start Claude Code: `claude`.
3. Paste the full contents of `CLAUDE_CODE_PROMPT.md`.
4. Claude Code builds Phase 0 and 1, then stops and summarises. Check it with `npm run dev`.
5. Reply `continue with phase 2` (and so on) to carry on. Follow-up prompts are at the bottom of `CLAUDE_CODE_PROMPT.md`.
6. Send `brand-kit/docs/05-open-questions.md` to Binoli now, so answers arrive while you build.

## Splitting work with Akky
After Phase 1 (shared components) is merged, one person takes Phase 2 (home), the other takes Phase 3 (inner pages), on separate branches.
