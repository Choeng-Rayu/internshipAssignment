---
name: awesome-design-md
description: 'Use the awesome-design-md catalog to design and implement frontend UIs with a clear visual direction. Use when selecting a brand-inspired style, generating design tokens, drafting layout and component rules, and shipping responsive pages.'
argument-hint: 'UI goal + product type + preferred brand/style (optional) + tech stack'
---

# Awesome Design MD Frontend Workflow

## What This Skill Produces
- A design direction anchored to one style from the `awesome-design-md` catalog
- A project-ready design brief (theme, typography, colors, spacing, components, and motion)
- Implementation guidance mapped to existing codebase conventions
- A completion checklist for visual consistency, accessibility, and responsiveness

## Source Material
- [Catalog overview](../../../awesome-design-md/README.md)
- [Quality and contribution criteria](../../../awesome-design-md/CONTRIBUTING.md)
- Brand entry format example: [Vercel entry](../../../awesome-design-md/design-md/vercel/README.md)

## When To Use
- User asks to design a frontend, refresh a UI, or match a known product aesthetic
- A screen exists but lacks cohesive visual direction
- The team needs fast style exploration before implementation

## Inputs To Collect
1. Page or screen goal
2. Target audience and product domain
3. Preferred style reference (brand from this catalog, if any)
4. Constraints:
- Existing design system to preserve
- Light, dark, or adaptive theme
- Framework and styling approach
- Accessibility targets

## Procedure
1. Define outcome and boundaries
- Summarize page purpose and success criteria
- List non-negotiables (existing components, brand limits, typography constraints)

2. Choose visual direction from the catalog
- If user names a brand, start from that brand entry
- If no brand is given, propose 2 to 3 candidates from matching categories in [README](../../../awesome-design-md/README.md)
- Justify each candidate in one sentence using tone keywords (technical, editorial, playful, premium)
- If an entry only links externally, follow that link to gather details before implementation

3. Create a DESIGN.md-style brief for the target UI
- Define atmosphere, palette roles, type hierarchy, component styling, layout principles, depth, do and do not rules, and responsive behavior
- Translate inspiration into reusable traits; do not copy logos or proprietary brand assets

4. Map the brief into project implementation
- Reuse existing components and tokens first
- Create or extend CSS variables for palette, spacing, radius, and shadows
- Add intentional motion (entry transitions, staggered reveals, hover and active feedback)
- Keep changes aligned with project structure and lint rules

5. Validate quality before finalizing
- Visual consistency: heading hierarchy, spacing rhythm, and state behavior are coherent
- Responsiveness: mobile, tablet, and desktop layouts are verified
- Accessibility: text and control contrast remain readable, with clear focus states
- Scope safety: no unrelated refactors or design drift

## Decision Rules
- Existing design system present:
Preserve system primitives and apply inspiration as theme-level adjustments only.
- No clear style preference:
Offer 3 style options with trade-offs and ask the user to choose.
- Aesthetic conflicts with usability:
Prioritize readability, hierarchy, and responsive behavior over visual effects.
- Multi-page requests:
Create shared tokens first, then page-specific overrides.

## Completion Checks
1. A single style direction is selected and explained
2. Tokens are semantic and consistently applied
3. Components include relevant interactive states
4. Layout scales from small to large screens without hierarchy breaks
5. Final output includes actionable implementation steps or code edits

## Prompt Starters
- Use awesome-design-md to propose 3 homepage directions for a B2B AI product, then implement the selected one in Next.js.
- Create a DESIGN.md-style brief inspired by Linear and Vercel for this dashboard, then refactor existing page styles.
- Match this onboarding flow to a premium dark aesthetic from awesome-design-md while preserving existing component APIs.
