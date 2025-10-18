# Tasks: Daily Challenge Showcase Page

**Input**: Design documents from `/specs/001-daily-showcase-page/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/file-structure.md, research.md

**Tests**: Not requested in specification - tasks focus on implementation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- Repository root structure (flat)
- Showcase files: `index.html`, `showcase.css`, `showcase.js`
- Challenges: `day1/`, `day2/`, etc.
- Git automation: `.git/hooks/pre-commit`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Git automation infrastructure for manifest generation

- [x] T001 Create pre-commit hook at .git/hooks/pre-commit for manifest generation
- [x] T002 Make pre-commit hook executable with chmod +x
- [x] T003 Test pre-commit hook by running it manually and verifying manifest.json output

---

## Phase 2: User Story 1 - View All Challenges (Priority: P1) 🎯 MVP

**Goal**: Visitors can see all completed daily challenges listed in one place, with basic information (day number, title) and links to full pages

**Independent Test**: Open index.html in browser and verify all existing day folders (day1, day2) are displayed with their titles in a list format, newest first

**Why MVP**: This is the core value - without this, the showcase doesn't exist. Delivers immediate value by making challenges discoverable.

### Implementation for User Story 1

- [x] T004 [P] [US1] Create index.html with basic HTML5 structure, header showing "AI Sprint Challenge" title
- [x] T005 [P] [US1] Create showcase.css with base styles for page layout, header, and list structure
- [x] T006 [US1] Create showcase.js with manifest loading function (fetch manifest.json, parse JSON)
- [x] T007 [US1] Implement challenge list rendering in showcase.js (create card elements, newest first per FR-007)
- [x] T008 [US1] Add empty state handling in showcase.js for when no challenges exist (FR-005)
- [x] T009 [US1] Add responsive CSS in showcase.css for mobile/desktop (FR-006)
- [x] T010 [US1] Add navigation links in each challenge card to dayN/index.html (FR-003, SC-002)

**Checkpoint**: At this point, opening index.html should show a styled list of all challenges with titles, sorted newest first, with working links to full challenge pages

---

## Phase 3: User Story 2 - View Challenge Content Directly (Priority: P2)

**Goal**: Visitors can see the actual content of each challenge embedded directly on the showcase page using iframes, allowing browsing without clicking through

**Independent Test**: Open index.html and verify each challenge card shows the full challenge content in an iframe, with interactive elements (like Matter.js physics) working correctly

**Why after MVP**: Enhances UX by eliminating clicks, but requires iframe optimization. MVP is functional without this.

### Implementation for User Story 2

- [x] T011 [US2] Add iframe containers to challenge cards in showcase.js rendering logic
- [x] T012 [US2] Configure iframe sandbox attributes (allow-scripts allow-same-origin) per research.md security guidelines
- [x] T013 [US2] Implement Intersection Observer for lazy loading in showcase.js per research.md
- [x] T014 [US2] Add iframe virtual scrolling logic in showcase.js (unload distant iframes, max 20 rendered)
- [x] T015 [US2] Add CSS for responsive iframe containers in showcase.css (aspect-ratio or padding-top technique)
- [x] T016 [US2] Add loading states and error handling for failed iframe loads in showcase.js

**Checkpoint**: Each challenge card now embeds the full challenge content in an iframe. Scrolling loads/unloads iframes efficiently. Interactive elements work within iframes.

---

## Phase 4: User Story 3 - Access Latest Work (Priority: P3)

**Goal**: Returning visitors can quickly identify the most recent challenge with visual distinction

**Independent Test**: Open index.html with multiple challenges and verify the newest challenge (highest day number) has visual highlighting or prominent positioning

**Why lowest priority**: Nice UX improvement but not essential. Stories 1 & 2 provide full functionality.

### Implementation for User Story 3

- [x] T017 [US3] Add visual highlighting CSS in showcase.css for first challenge card (latest)
- [x] T018 [US3] Add "Latest" or "New" badge to the newest challenge in showcase.js rendering
- [x] T019 [US3] Ensure newest challenge is positioned at top of page per FR-007

**Checkpoint**: The most recent challenge is visually distinct, making it easy for repeat visitors to spot new content

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall quality

- [x] T020 [P] Add page metadata to index.html (title, description, Open Graph tags for sharing)
- [x] T021 [P] Add performance optimizations in showcase.js (throttle scroll events, cache manifest)
- [x] T022 [P] Add error recovery in showcase.js (retry failed manifest loads, fallback UI)
- [x] T023 Verify manifest.json matches contract schema from contracts/file-structure.md
- [x] T024 Test with existing day1/ and day2/ challenges and verify correct display
- [x] T025 [P] Add browser console logging for debugging (manifest load, iframe events)
- [x] T026 Test responsive design on mobile viewport (375px width)
- [x] T027 Test performance with manifest simulating 50+ challenges (verify <2 second load per SC-003)
- [x] T028 Validate HTML with W3C validator
- [x] T029 Update README.md with deployment instructions per quickstart.md
- [x] T030 Test edge cases: missing index.html, non-sequential days, empty manifest

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
  - Creates git infrastructure for manifest generation
  - Not a blocker for UI development, but needed before first commit

- **User Story 1 (Phase 2)**: No dependencies - can start immediately (even in parallel with Setup)
  - Creates the MVP showcase page
  - Can be tested manually even without manifest.json (use mock data)

- **User Story 2 (Phase 3)**: Depends on User Story 1 completion
  - Extends US1 cards with iframe embedding
  - Requires US1 card structure to exist

- **User Story 3 (Phase 4)**: Depends on User Story 1 completion
  - Adds visual highlighting to US1 cards
  - Independent of US2 (can be done in parallel with US2 if desired)

- **Polish (Phase 5)**: Depends on desired user stories being complete
  - Can start after US1 for MVP testing
  - Should include all stories for full testing

### User Story Dependencies

- **User Story 1 (P1)**: Independent - no dependencies on other stories ✅
- **User Story 2 (P2)**: Depends on US1 (extends card structure with iframes)
- **User Story 3 (P3)**: Depends on US1 (adds styling to cards), independent of US2

### Within Each User Story

**User Story 1 (Linear dependency chain)**:
1. T004, T005, T006 [P] → HTML, CSS, JS files can be created in parallel
2. T007 → Depends on T006 (needs manifest loading first)
3. T008, T009, T010 [P] → Can be added in parallel once T007 is complete

**User Story 2 (Linear dependency chain)**:
1. T011 → Depends on US1 card structure
2. T012, T013 [P] → Iframe setup and Intersection Observer can be done in parallel
3. T014, T015 [P] → Virtual scrolling and CSS can be done in parallel
4. T016 → Error handling can be added last

**User Story 3 (Simple additions)**:
1. T017, T018, T019 [P] → All can be done in parallel (CSS, badge, positioning)

### Parallel Opportunities

**Within Setup Phase**:
- T002 can run immediately after T001

**Within User Story 1**:
```bash
# Parallel group 1:
Task T004: Create index.html
Task T005: Create showcase.css
Task T006: Create showcase.js (manifest loading)

# Sequential:
Task T007: Implement rendering (depends on T006)

# Parallel group 2:
Task T008: Empty state
Task T009: Responsive CSS
Task T010: Navigation links
```

**Within User Story 2**:
```bash
# Sequential:
Task T011: Add iframe containers (depends on US1)

# Parallel group 1:
Task T012: Sandbox attributes
Task T013: Intersection Observer

# Parallel group 2:
Task T014: Virtual scrolling
Task T015: Responsive iframe CSS

# Sequential:
Task T016: Error handling
```

**Within User Story 3**:
```bash
# Parallel (all tasks):
Task T017: Highlighting CSS
Task T018: Latest badge
Task T019: Positioning
```

**Within Polish Phase**:
```bash
# Parallel group:
Task T020: Page metadata
Task T021: Performance optimizations
Task T022: Error recovery
Task T025: Console logging
Task T026: Mobile testing
Task T029: README update

# Sequential validation tasks:
Task T023: Schema validation
Task T024: Test with existing challenges
Task T027: Performance testing
Task T028: HTML validation
Task T030: Edge case testing
```

---

## Parallel Example: User Story 1 Initial Setup

```bash
# Launch all initial files in parallel:
Task T004: "Create index.html with basic HTML5 structure, header showing 'AI Sprint Challenge' title"
Task T005: "Create showcase.css with base styles for page layout, header, and list structure"
Task T006: "Create showcase.js with manifest loading function (fetch manifest.json, parse JSON)"
```

After these three complete, the core files exist and T007 can proceed.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Fastest path to a working showcase:**

1. **Phase 1**: Setup (T001-T003) - Create git hook for manifest generation
2. **Phase 2**: User Story 1 (T004-T010) - Build basic showcase page
3. **Validation**:
   - Manually create manifest.json with day1 and day2 data
   - Open index.html in browser
   - Verify both challenges listed, newest first
   - Click links to verify navigation works
4. **Deploy**: Push to GitHub Pages, enable in settings

**Result**: A functional, publicly accessible showcase page listing all challenges

**Timeline estimate**: 2-4 hours for someone familiar with HTML/CSS/JS

---

### Incremental Delivery

**Recommended approach for maximum value delivery:**

1. **Phase 1 + Phase 2** (Setup + US1):
   - Delivers: Basic working showcase ✅
   - Test independently: List of challenges with links
   - Deploy: MVP is live and usable
   - **STOP HERE FOR MVP** ⭐

2. **Add Phase 3** (US2):
   - Delivers: Embedded challenge content ✅
   - Test independently: Iframes load, interactivity works
   - Deploy: Enhanced browsing experience
   - **This is the "deluxe" version**

3. **Add Phase 4** (US3):
   - Delivers: Visual highlighting of latest ✅
   - Test independently: Newest challenge stands out
   - Deploy: Improved UX for repeat visitors
   - **This is the "polished" version**

4. **Add Phase 5** (Polish):
   - Delivers: Production-ready quality ✅
   - Test independently: Edge cases, performance
   - Deploy: Fully tested and documented

**Each increment adds value without breaking previous functionality**

---

### Parallel Team Strategy

If working with multiple people or AI agents:

**Single developer** (recommended sequence):
1. T001-T003 (Setup)
2. T004-T010 (US1) → MVP complete
3. T011-T016 (US2) → Enhanced version
4. T017-T019 (US3) → Polished version
5. T020-T030 (Polish) → Production-ready

**Two developers**:
- Dev A: T001-T003 (Setup) + T004-T010 (US1 core)
- Dev B: T017-T019 (US3 CSS/styling) in parallel with US1
- Then both: T011-T016 (US2 together - more complex)

**Three developers** (after US1 foundation):
- Dev A: T011-T016 (US2 iframe embedding)
- Dev B: T017-T019 (US3 highlighting)
- Dev C: T020-T030 (Polish & testing)

---

## Notes

- **[P] marker**: Tasks that touch different files and have no sequential dependencies
- **[US1]/[US2]/[US3] labels**: Track which user story each task belongs to for independent testing
- **Commits**: Commit after completing each user story phase for incremental history
- **Testing checkpoints**: Each user story phase ends with a checkpoint - test independently before proceeding
- **No test files**: This project uses manual browser testing rather than automated tests
- **Git hook is critical**: T001-T003 must work correctly or manifest won't auto-update
- **Manifest first approach**: Can manually create manifest.json for testing before git hook is working
- **Local testing**: Use `python3 -m http.server 8000` to test locally before deploying

---

## Task Count Summary

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (US1 - MVP)**: 7 tasks ⭐
- **Phase 3 (US2)**: 6 tasks
- **Phase 4 (US3)**: 3 tasks
- **Phase 5 (Polish)**: 11 tasks

**Total**: 30 tasks

**Parallel opportunities identified**: 12 tasks can run in parallel across different phases

**Independent test criteria**:
- ✅ US1: List view with links works
- ✅ US2: Iframe embedding works
- ✅ US3: Latest highlighting works

**Suggested MVP scope**: Phase 1 (Setup) + Phase 2 (US1) = 10 tasks for a functional showcase

---

## Success Criteria Mapping

| Success Criterion | Addressed By |
|-------------------|--------------|
| SC-001: Single page load, no pagination | T007 (render all challenges) |
| SC-002: Navigate in ≤2 clicks | T010 (direct links to challenges) |
| SC-003: Load under 2 seconds | T021 (performance optimization), T027 (perf testing) |
| SC-004: 100% auto-discovery | T001-T003 (git hook), T006 (manifest loading) |
| SC-005: Visually cohesive | T005 (CSS), T009 (responsive), T017 (highlighting) |

All functional requirements (FR-001 through FR-010) are addressed across the task phases.
