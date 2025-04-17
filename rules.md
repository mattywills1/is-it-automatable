# rules.md

## Purpose
This document defines coding and behavior guidelines for the AI coding agent when building the “Is This Automatable?” app. It merges structural, stylistic, and functional rules for clarity and robustness.

---

## General Rules
- Use clean, modular, and well-commented code.
- Stick to vanilla HTML, CSS, and JavaScript.
- Keep HTML semantic and accessible.
- Separate logic (JS), style (CSS), and structure (HTML) into distinct files.
- Avoid using external libraries unless explicitly instructed.

---

## UI Design
- Follow Quietly Smart brand colors:
  - Deep Violet: #46438a
  - Teal: #5cc0b5
  - Pale Ivory: #f4e3c9
- Use a modern sans-serif font (Montserrat or equivalent).
- Mobile-responsive layout with soft shadows and rounded corners.
- Slightly playful but not gimmicky.

---

## Data Handling
- Fetch data in real-time from FutureTools.io and There’s An AI For That.
- If scraping fails, fall back to weekly updated mock data.
- Respect the terms of service of source websites.
- Create caching mechanism to reduce load and increase speed.

---

## Matching Logic
- Use fuzzy keyword matching and context analysis.
- Consider full task phrasing, not just isolated words.
- Score tool matches (100% = perfect fit, 70–80% = partial match).
- Always provide at least one tool suggestion if possible.
- Bonus points for tools with APIs or Zapier integration.

---

## Safety & Reliability
- Validate user input to prevent script errors.
- Fail gracefully with friendly messaging if no tools match.
- Do not hardcode results — dynamically link to parsed or scraped data.
