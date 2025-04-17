# todo.md

## MVP Feature List

### 1. Input & UX
- [ ] Create a freeform text input for user task descriptions.
- [ ] Display 3–5 suggested example prompts below the field.
- [ ] Ensure clean, mobile-responsive layout with branded colors and fonts.

### 2. Processing Logic
- [ ] Implement keyword/context matching for tool selection.
- [ ] Generate an "Automatable Score" (basic logic or random for MVP).
- [ ] Show fallback message if no tools are found.

### 3. Output Display
- [ ] Confirm task is automatable with a friendly message.
- [ ] Show up to 3 matching AI tools as styled cards with:
  - Tool name
  - Tags / example tasks
  - Site link
- [ ] Include Automatable Score and brief insight (e.g. time saved).

---

## Technical Enhancements (AI-Agent Tasks)

### High Priority
- [ ] Implement web scraping for FutureTools.io
- [ ] Implement scraping for There's An AI For That
- [ ] Create caching mechanism to avoid overloading source sites
- [ ] Add error handling for failed requests or data issues

### Medium Priority
- [ ] Add “Copy Results” button for sharing outcomes
- [ ] Create a “Share Results” feature (e.g., Twitter/X link)
- [ ] Animate Automatable Score (e.g., count up)

### Low Priority
- [ ] Optional: Add dark mode toggle
- [ ] Add tooltips to explain score calculation
- [ ] Gamify by saving past inputs and showing cumulative time saved

---

## Deployment
- [ ] Make compatible with GitHub Pages or Replit
- [ ] Test for cross-browser compatibility and basic accessibility
