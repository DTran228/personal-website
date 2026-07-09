// ─────────────────────────────────────────────────────────────
// YOUR HOMEWORK FILE — everything in [brackets] is a placeholder.
// This is the ONLY file you need to edit to make the Home page
// yours. The React components just render whatever is here.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Duc Tran",
  tagline: "[One sentence about you — e.g. 'CS student who loves building full-stack apps']",

  // 2–4 short paragraphs. Each string = one paragraph on the page.
  about: [
    "[Paragraph 1 — who you are, where you study, what you're into.]",
    "[Paragraph 2 — what you're aiming for, e.g. Summer 2026 internships.]",
  ],

  // Shown as a card: what you're building/learning right now.
  currentlyWorkingOn:
    "[e.g. 'This website! React + Express + TypeScript, mentored build.']",

  // Rendered as small pill badges. Add/remove freely.
  skills: ["TypeScript", "React", "Node.js", "[add yours]"],

  links: {
    github: "https://github.com/[your-username]",
    leetcode: "https://leetcode.com/u/[your-username]",
    email: "ductranzeot06@gmail.com",
  },
};

// TypeScript trick: this type is derived FROM the object above,
// so components importing Profile always match the real shape.
export type Profile = typeof profile;
