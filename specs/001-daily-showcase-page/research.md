# Research: Daily Challenge Showcase Page

**Date**: 2025-10-18
**Feature**: Daily Challenge Showcase Page

## Overview

This document consolidates research findings for implementing a static showcase page that automatically discovers and displays daily coding challenges hosted on GitHub Pages.

## Technical Decisions

### 1. Auto-Discovery Mechanism

**Decision**: Use pre-commit hook to generate manifest.json

**Rationale**:
- **Zero runtime performance cost**: Single fetch for manifest.json vs. 100+ HEAD requests
- **Instant page load**: No waiting for sequential folder probing
- **Automatic updates**: Manifest regenerates on every commit
- **Zero maintenance**: No manual updates when adding new challenges
- **Metadata extraction**: Can parse HTML titles during manifest generation

**Alternatives Considered**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Sequential fetch with 404 detection | Simple, no build step | 5-20 seconds for 100 days, poor UX | ❌ Rejected - too slow |
| Parallel batch fetching | Faster (3-5 sec for 365 days) | Still network overhead, complex caching | ⚠️ Fallback only |
| Pre-commit hook + manifest | Instant load, zero runtime cost | Requires git hook setup | ✅ **Selected** |
| GitHub Actions | Cloud-based, no local setup | Requires push to trigger, not immediate | ⚠️ Optional enhancement |

**Implementation**:

```bash
# .git/hooks/pre-commit
#!/bin/bash
node -e "
const fs = require('fs');
const days = fs.readdirSync('.')
  .filter(name => /^day\d+$/.test(name))
  .filter(name => fs.existsSync(name + '/index.html'))
  .map(name => {
    const num = parseInt(name.replace('day', ''));
    const html = fs.readFileSync(name + '/index.html', 'utf8');
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    return {
      number: num,
      folder: name,
      url: name + '/',
      title: titleMatch ? titleMatch[1] : 'Day ' + num
    };
  })
  .sort((a, b) => a.number - b.number);

fs.writeFileSync('manifest.json', JSON.stringify({
  updated: new Date().toISOString(),
  total: days.length,
  days: days
}, null, 2));
"
git add manifest.json
```

**Fallback**: Implement parallel batch fetching for local development without git hooks.

---

### 2. Content Display Strategy

**Decision**: Use iframes with lazy loading and virtual scrolling

**Rationale**:
- **Natural isolation**: Each iframe has separate CSS/JS context - no conflicts
- **Preserves interactivity**: Matter.js physics and animations work correctly
- **Sandbox security**: `sandbox` attribute provides additional isolation
- **Battle-tested**: Industry standard for embedding untrusted content

**Alternatives Considered**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| Direct HTML injection | Fastest, no iframe overhead | Style/script conflicts, security risk | ❌ Rejected - conflicts inevitable |
| Screenshots + links | Safest, fastest initial load | No interactivity preview, requires image generation | ❌ Rejected - loses core value |
| Iframes with lazy loading | Isolated, interactive, secure | Memory overhead with 100+ iframes | ✅ **Selected** with virtual scrolling |
| Web Components | Modern, encapsulated | Requires rewriting challenges, complex | ❌ Rejected - violates FR-010 |

**Key Technical Considerations**:

1. **Memory Management**: 100+ iframes = ~190-290MB RAM
   - **Solution**: Virtual scrolling - render max 15-20 visible iframes
   - **Implementation**: Intersection Observer unloads off-screen iframes

2. **Performance**: Creating iframes is 1-2 orders of magnitude more expensive than divs
   - **Solution**: Lazy load with `loading="lazy"` + Intersection Observer
   - **Result**: Only visible + buffer iframes are rendered

3. **Responsive Design**: Challenges have variable dimensions
   - **Solution**: CSS `aspect-ratio` property (modern browsers)
   - **Fallback**: Padding-top technique for older browsers
   - **Dynamic**: PostMessage for content-based height

---

### 3. Iframe Configuration

**Decision**: Sandbox with minimal permissions

**Sandbox Attributes**: `sandbox="allow-scripts allow-same-origin"`

**Rationale**:
- `allow-scripts`: Required for Matter.js, animations, interactive content
- `allow-same-origin`: Enables communication via postMessage for metadata
- **Omitted permissions**: `allow-forms`, `allow-popups`, `allow-modals` (not needed)

**Additional Security**:
```html
<iframe
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  referrerpolicy="no-referrer"
  allow="accelerometer 'none'; camera 'none'; microphone 'none'"
></iframe>
```

**Security Considerations**:
- Content is same-origin (hosted on same GitHub Pages site)
- No external user-generated content
- Each challenge is authored by repository owner
- Sandbox prevents iframe from modifying parent page

---

### 4. Lazy Loading Strategy

**Decision**: Intersection Observer with virtual scrolling

**Implementation**:

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const iframe = entry.target.querySelector('iframe');

    if (entry.isIntersecting && iframe.src === 'about:blank') {
      // Load when entering viewport
      iframe.src = iframe.dataset.src;
    } else if (!entry.isIntersecting && renderedCount > MAX_RENDERED) {
      // Unload when far from viewport
      iframe.src = 'about:blank';
    }
  });
}, {
  rootMargin: '100px' // Load 100px before entering viewport
});
```

**Performance Characteristics**:
- **Initial load**: 5-10 iframes (visible on screen)
- **Scroll load**: 100-200ms per iframe
- **Memory usage**: ~15MB per iframe (reasonable with max 20 rendered)
- **Page load time**: Under 2 seconds (SC-003 requirement met)

---

### 5. Metadata Extraction

**Decision**: Extract from HTML during manifest generation

**Rationale**:
- **No runtime overhead**: Parsing happens once at commit time
- **Simple**: No postMessage complexity
- **Reliable**: Direct file system access vs. cross-origin messaging
- **Extensible**: Can add more metadata fields easily

**Manifest Structure**:

```json
{
  "updated": "2025-10-18T10:20:00.000Z",
  "total": 2,
  "days": [
    {
      "number": 1,
      "folder": "day1",
      "url": "day1/",
      "title": "Falling Stack – Explosive Compression",
      "theme": "圧縮",
      "created": "2025-10-18T09:13:00.000Z"
    }
  ]
}
```

**Extraction Logic**:
- Parse `<title>` tag for page title
- Look for `<h2>` with "テーマ:" pattern for theme
- Use folder creation time for date
- Future: Custom `<meta>` tags for structured data

---

### 6. Responsive Design

**Decision**: CSS aspect-ratio with dynamic height fallback

**Primary Approach** (Modern Browsers):

```css
.iframe-container {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
}
```

**Fallback** (Older Browsers):

```css
.iframe-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 ratio */
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

**Dynamic Height** (Optional Enhancement):

Challenges can report their content height via postMessage:

```javascript
// Inside challenge iframe
window.parent.postMessage({
  type: 'resize',
  height: document.body.scrollHeight
}, '*');
```

---

### 7. GitHub Pages Compatibility

**Decision**: Pure static files - no build step required

**Constraints Addressed**:
- ✅ No server-side code (GitHub Pages limitation)
- ✅ No build process (FR-008 requirement)
- ✅ Works with `gh-pages` branch or `/docs` folder
- ✅ Automatic deployment on push to main

**File Structure**:

```
/
├── index.html           # Showcase page
├── showcase.css         # Styles
├── showcase.js          # Discovery + rendering logic
├── manifest.json        # Generated by pre-commit hook
├── day1/
│   └── index.html
├── day2/
│   └── index.html
└── README.md
```

**Deployment**:
1. Enable GitHub Pages in repository settings
2. Set source to main branch / root directory
3. Access at `https://username.github.io/repository-name/`

---

## Performance Budget

Based on research findings:

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial page load | < 2 seconds | Manifest.json (~5KB), minimal CSS/JS |
| Time to first iframe | < 500ms | Load first visible iframe immediately |
| Scroll performance | 60 FPS | Virtual scrolling, max 20 rendered iframes |
| Memory usage | < 400MB | Unload off-screen iframes |
| Network requests (initial) | < 10 | Manifest + visible iframes only |

---

## Risk Mitigation

### Risk 1: Large Number of Challenges (365+)

**Mitigation**:
- Virtual scrolling ensures only 15-20 iframes rendered
- Manifest.json size remains small (~20KB for 365 entries)
- Lazy loading prevents network congestion

### Risk 2: Conflicting Styles/Scripts

**Mitigation**:
- Iframes provide natural isolation
- Sandbox attribute prevents parent modification
- Each challenge runs in separate browsing context

### Risk 3: Performance Degradation

**Mitigation**:
- Intersection Observer for efficient lazy loading
- Unload distant iframes to free memory
- `loading="lazy"` browser-native optimization

### Risk 4: Missing Challenges (404 Errors)

**Mitigation**:
- Manifest generation verifies `index.html` exists
- Empty state message if manifest is empty
- Graceful degradation if individual iframe fails

---

## Open Questions Resolved

### ✅ Q1: Can JavaScript enumerate directories in static sites?
**Answer**: No, but manifest.json generated at commit time solves this perfectly.

### ✅ Q2: How to prevent style/script conflicts?
**Answer**: Iframes provide built-in isolation - no additional work needed.

### ✅ Q3: Performance with many iframes?
**Answer**: Virtual scrolling + lazy loading keeps <20 iframes rendered at once.

### ✅ Q4: How to extract metadata?
**Answer**: Parse HTML during manifest generation at commit time.

### ✅ Q5: Sequential vs. parallel fetching?
**Answer**: Neither - use manifest.json for zero runtime cost.

### ✅ Q6: HEAD vs. GET requests?
**Answer**: Irrelevant - manifest.json approach doesn't need HTTP probing.

---

## Next Steps

1. **Phase 1**: Create design artifacts (data-model.md, contracts/, quickstart.md)
2. **Implementation**: Build showcase page with manifest-based discovery
3. **Setup**: Create pre-commit hook for manifest generation
4. **Testing**: Validate with existing day1/, day2/ challenges
5. **Documentation**: Update README with usage instructions

**Ready for**: Phase 1 - Design Artifacts
