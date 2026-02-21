# The Art of Light - Feedback PRD

> XIAOMI KOREA x JDZ CHUNG Exhibition Website
> Date: 2026-02-21
> Source: Figma (node-id=194-2)

---

## Feedback Status Legend

| Status | Meaning |
|--------|---------|
| [ ] | Not started |
| [~] | In progress |
| [x] | Complete |

---

## #1 Loading Page - Design Ratio

**Page:** Loading Page
**Feedback:** Design ratio application (light element size, font size, overall position)

**Tasks:**
- [ ] Light SVG element size matches Figma design
- [ ] Font size for "THE ART OF LIGHT" matches Figma
- [ ] Font size for "XIAOMI KOREA X JDZ CHUNG" matches Figma
- [ ] Overall vertical/horizontal centering and spacing

---

## #2 The Art of Light - Design Ratio

**Page:** The Art of Light (Exhibition)
**Feedback:** Design ratio application (button size, font size, overall position, photo angle)

**Tasks:**
- [ ] Button size matches Figma
- [ ] Font size matches Figma
- [ ] Overall layout position matches Figma
- [ ] Photo card angle matches Figma (currently rotateX=-10, rotateY=-18, rotateZ=2)

---

## #3 The Art of Light - Entrance Motion

**Page:** The Art of Light (Exhibition)
**Feedback:** Add motion when first starting

**Tasks:**
- [x] Diagonal scroll-in entrance animation on mount
- [x] Overshoot + bounce-back effect
- [x] Variable lerp (fast start, chewy end)

---

## #4 The Art of Light - Menu Button Motion

**Page:** The Art of Light (Exhibition)
**Feedback:** Apply menu button motion

**Tasks:**
- [ ] Menu button hover animation
- [ ] Menu button click animation
- [ ] Reference: menu.mp4

---

## #5 The Art of Light - Photo Hover & Click Motion

**Page:** The Art of Light (Exhibition)
**Feedback:** Add motion on photo hover & click

**Tasks:**
- [x] Hover: diagonal slide-down at card angle (translate 5vw, 1vw)
- [x] Hover: brightness increase + enhanced shadow
- [x] Click: card rotation to flat with scale-up (PhotoViewer open)
- [x] Click: scroll to center selected photo

---

## #6 The Art of Light - Double Photo Navigation Bug

**Page:** The Art of Light (Exhibition)
**Feedback:** After clicking a photo, sometimes two photos advance at once when hovering -> make it one at a time

**Tasks:**
- [ ] Verify wheel cooldown (currently 600ms) prevents double navigation
- [ ] Test with trackpad and mouse wheel
- [ ] Ensure single photo navigation per scroll gesture

---

## #7 The Art of Light - Unlimited Hover Navigation

**Page:** The Art of Light (Exhibition)
**Feedback:** Enable unlimited hover (scroll navigation) without interruption

**Tasks:**
- [ ] Verify continuous scroll navigation works smoothly
- [ ] No artificial limits on navigation speed (within cooldown)
- [ ] Smooth transition between rapid navigations

---

## #8 Overview Page - Design Ratio

**Page:** Overview
**Feedback:** Design ratio application (button size, font size, overall position)

**Tasks:**
- [ ] Button size matches Figma
- [ ] Font size matches Figma
- [ ] Overall layout position matches Figma

---

## #9 Overview Page - Box Animation Effect

**Page:** Overview
**Feedback:** Effect: First box appears with typing, blinks 3 times, then duplicates to create 2nd and 3rd boxes

**Tasks:**
- [ ] First box appears with typing animation
- [ ] Cursor/box blinks 3 times after typing
- [ ] Second box appears (duplication feel)
- [ ] Third box appears (duplication feel)

---

## #10 Master JDZ Page - Fade-in Effect

**Page:** Master JDZ
**Feedback:** Effect: JDZ photo & info fade in simultaneously

**Tasks:**
- [ ] JDZ portrait photo fade-in on mount
- [ ] Info text fade-in simultaneously with photo
- [ ] Smooth opacity transition

---

## #11 Master JDZ Page - Scroll Down Effect

**Page:** Master JDZ
**Feedback:** Effect: About text slides up from below on scroll down

**Tasks:**
- [ ] Detect scroll down
- [ ] About text animates from below (translateY)
- [ ] Smooth entrance with appropriate easing

---

## #12 Counting Page - Design & Effect Update

**Page:** Counting Page
**Feedback:** Design & effect update, design ratio application

**Tasks:**
- [ ] Design matches Figma
- [ ] Animation/effects updated
- [ ] Size ratios correct

---

## #13 Photo Application (The Art of Light + Overview)

**Page:** The Art of Light, Overview
**Feedback:** Apply actual photos

**Tasks:**
- [x] Download 22 real photos from Figma (photo01-photo22.jpg)
- [x] Update photos.ts with correct dimensions
- [x] Remove old placeholder photos (photo1-photo6.jpg)
- [ ] Apply photos to Overview page as well

---

## Summary

| # | Page | Status | Priority |
|---|------|--------|----------|
| 1 | Loading Page | [ ] | High |
| 2 | Exhibition | [ ] | High |
| 3 | Exhibition | [x] | - |
| 4 | Exhibition | [ ] | Medium |
| 5 | Exhibition | [x] | - |
| 6 | Exhibition | [ ] | High (Bug) |
| 7 | Exhibition | [ ] | Medium |
| 8 | Overview | [ ] | High |
| 9 | Overview | [ ] | Medium |
| 10 | Master JDZ | [ ] | Medium |
| 11 | Master JDZ | [ ] | Medium |
| 12 | Counting | [ ] | Medium |
| 13 | Exhibition + Overview | [~] | High |
