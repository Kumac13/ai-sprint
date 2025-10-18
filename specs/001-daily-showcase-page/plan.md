# Implementation Plan: Daily Challenge Showcase Page

**Branch**: `001-daily-showcase-page` | **Date**: 2025-10-18 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-daily-showcase-page/spec.md`

## Summary

Create a static showcase page that automatically displays all daily coding challenges (dayX/index.html) in reverse chronological order. The page will embed each challenge's content directly using iframes, allowing visitors to browse all challenges in a single, cohesive gallery view. The solution must be deployable to GitHub Pages without build tools, and new challenges should appear automatically without manual updates.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES6+
**Primary Dependencies**: None (vanilla JavaScript only)
**Storage**: File system (day1/, day2/, ... folders)
**Testing**: Manual browser testing
**Target Platform**: Static web hosting (GitHub Pages)
**Project Type**: Single static site
**Performance Goals**: Page load under 2 seconds, support 100+ challenges
**Constraints**: Must work without server-side code, must auto-discover folders, no build step
**Scale/Scope**: 365+ daily challenges (1 year of daily coding)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: N/A - No constitution file found. Project appears to be in early stage with no established architectural principles yet.

**Recommendation**: Consider creating a constitution after this first feature to establish patterns for future development.

## Project Structure

### Documentation (this feature)

```
specs/001-daily-showcase-page/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── file-structure.md  # Expected folder/file conventions
└── tasks.md             # Created by /speckit.tasks command
```

### Source Code (repository root)

```
/
├── index.html           # NEW: Main showcase page
├── showcase.css         # NEW: Showcase page styles
├── showcase.js          # NEW: Auto-discovery and iframe logic
├── day1/
│   └── index.html       # Existing challenge pages
├── day2/
│   └── index.html
├── dayN/
│   └── index.html
└── README.md
```

**Structure Decision**: Flat structure chosen to minimize complexity. The showcase page lives at the root (`index.html`) and scans for `dayX/` folders. This aligns with the static site constraint and GitHub Pages compatibility.

**Alternative Considered**: Organizing showcase files in a subdirectory (`/showcase/`) was rejected because it would require visitors to navigate to a subdirectory instead of landing directly on the showcase at the root URL.

## Complexity Tracking

*No constitution violations to track - no constitution exists yet.*

## Phase 0: Research & Technical Decisions

### Research Topics

1. **Auto-discovery mechanism**: How to enumerate day folders without server-side directory listing
2. **Iframe isolation**: Best practices for embedding multiple HTML pages with potentially conflicting styles/scripts
3. **GitHub Pages constraints**: Limitations and capabilities for static sites
4. **Performance optimization**: Lazy loading strategies for 100+ iframes

### Technical Unknowns to Resolve

- **Q1**: Can JavaScript enumerate directories in a static site context?
  - **Initial assessment**: No, cannot use `fs` or directory APIs in browser
  - **Alternative approach**: Generate a manifest file OR use fetch with predictable paths (day1, day2, ...) and handle 404s

- **Q2**: How to prevent style/script conflicts between embedded challenges?
  - **Initial assessment**: Iframes provide natural isolation via separate document context
  - **Consideration**: Need `sandbox` attribute configuration

- **Q3**: Performance with many iframes?
  - **Initial assessment**: Use Intersection Observer API for lazy loading
  - **Fallback**: Load first N challenges immediately, rest on scroll

- **Q4**: How to extract metadata (theme/title) from each challenge?
  - **Initial assessment**: Parse `<title>` tag or look for specific HTML elements
  - **Alternative**: Add optional metadata JSON file per challenge (but violates FR-010 simplicity)

## Phase 1: Design Artifacts

*To be generated after research phase*

### Planned Artifacts

1. **data-model.md**: Challenge metadata structure and discovery protocol
2. **contracts/file-structure.md**: Expected folder naming and file conventions
3. **quickstart.md**: How to add new challenges and deploy to GitHub Pages

## Next Steps

1. Complete Phase 0 research on technical unknowns
2. Generate Phase 1 design artifacts
3. Create tasks.md with implementation steps (via `/speckit.tasks`)
4. Implement and test

**Ready for**: Phase 0 Research
