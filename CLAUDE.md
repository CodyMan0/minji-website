# Project: Minji - The Art of Light Exhibition

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Framer Motion, GSAP
- Tailwind CSS v4
- Font: IBM Plex Sans Condensed

## Code Quality: Toss Frontend Clean Code (Always Applied)

Based on [Frontend Fundamentals](https://frontend-fundamentals.com/code-quality/) by Toss.
**All code in this project MUST follow these principles.**

### 1. Readability (가독성)
- Functions should do ONE thing only
- Max nesting depth: 2 levels — use Early Return
- Name complex conditions: `const canAccess = age >= 19 && hasVerified`
- No magic numbers — use named constants
- Abstract implementation details into named functions

### 2. Predictability (예측 가능성)
- Function names must accurately describe behavior
- Consistent return types for similar functions
- No hidden side effects — separate pure logic from side effects
- No name collisions within the same scope

### 3. Cohesion (응집도)
- Co-locate files that change together (domain-based, not type-based)
- Group related form state together
- Shared constants in a single source of truth

### 4. Coupling (결합도)
- Single responsibility per component/function
- Prefer explicit duplication over premature abstraction
- Avoid Props Drilling — use Context or state management
- Minimize blast radius of changes

### Trade-off Priority
| Situation | Priority |
|-----------|----------|
| Bug-prone if separated | Cohesion > Readability |
| Low-risk duplication | Readability > Cohesion |
| Limit change impact | Coupling > Cohesion |

### Code Review Checklist (Auto-applied)
- [ ] Each function does one thing
- [ ] Nesting ≤ 2 levels
- [ ] Conditions named with intent
- [ ] No magic numbers
- [ ] Function names match behavior
- [ ] Consistent return types
- [ ] No hidden side effects
- [ ] Related files co-located
- [ ] Single responsibility components
- [ ] No unnecessary abstraction
