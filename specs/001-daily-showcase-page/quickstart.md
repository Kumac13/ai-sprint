# Quickstart Guide: Daily Challenge Showcase

**Feature**: Daily Challenge Showcase Page
**Date**: 2025-10-18

## Overview

This guide will help you set up and use the AI Sprint Challenge showcase page. After setup, adding new challenges is as simple as creating a `dayN/index.html` file and committing it.

---

## Prerequisites

- Git repository initialized
- Basic knowledge of HTML
- Node.js installed (for manifest generation)
- GitHub account (for GitHub Pages deployment)

---

## Initial Setup

### Step 1: Install Pre-commit Hook

The pre-commit hook automatically generates `manifest.json` when you commit new challenges.

```bash
# Create the hook file
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

echo "Generating manifest.json..."

node -e "
const fs = require('fs');
const path = require('path');

// Find all day folders
const days = fs.readdirSync('.')
  .filter(name => /^day\d+\$/.test(name))
  .filter(name => {
    const indexPath = path.join(name, 'index.html');
    return fs.existsSync(indexPath);
  })
  .map(name => {
    const dayNum = parseInt(name.replace('day', ''));
    const indexPath = path.join(name, 'index.html');

    // Extract title from HTML
    let title = \`Day \${dayNum}\`;
    let theme = '';

    try {
      const html = fs.readFileSync(indexPath, 'utf8');

      // Extract title
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      if (titleMatch) title = titleMatch[1];

      // Extract theme (optional)
      const themeMatch = html.match(/テーマ[：:]\s*[「\"]([^」\"]+)[」\"]/);
      if (themeMatch) theme = themeMatch[1];
    } catch (e) {
      console.error(\`Warning: Could not parse \${indexPath}\`);
    }

    const stats = fs.statSync(name);

    return {
      number: dayNum,
      folder: name,
      url: \`\${name}/\`,
      title: title,
      theme: theme || undefined,
      created: stats.birthtime.toISOString()
    };
  })
  .sort((a, b) => a.number - b.number);

const manifest = {
  updated: new Date().toISOString(),
  total: days.length,
  days: days
};

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));
console.log(\`✓ Generated manifest with \${days.length} challenges\`);
"

# Add manifest.json to the commit
git add manifest.json
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

**Verify installation**:
```bash
ls -l .git/hooks/pre-commit
# Should show: -rwxr-xr-x (executable)
```

---

### Step 2: Create Showcase Page Files

**Create `index.html`** (showcase landing page):

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Sprint Challenge - Daily Coding Projects</title>
  <link rel="stylesheet" href="showcase.css">
</head>
<body>
  <header class="showcase-header">
    <h1>AI Sprint Challenge</h1>
    <p class="tagline">毎日15分のAIコーディングチャレンジ</p>
    <p class="challenge-count">Loading challenges...</p>
  </header>

  <main id="showcase-grid" class="showcase-grid">
    <!-- Challenge cards will be inserted here -->
  </main>

  <script src="showcase.js"></script>
</body>
</html>
```

**Create `showcase.css`**:

```css
:root {
  --bg: #0b1020;
  --panel: #111827;
  --ink: #e5e7eb;
  --accent: #a5b4fc;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Meiryo, sans-serif;
  background: var(--bg);
  color: var(--ink);
  line-height: 1.6;
}

.showcase-header {
  text-align: center;
  padding: 3rem 1rem;
  border-bottom: 1px solid #333;
}

.showcase-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.tagline {
  color: #9ca3af;
  font-size: 1.125rem;
}

.challenge-count {
  margin-top: 1rem;
  color: var(--accent);
  font-weight: 500;
}

.showcase-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  gap: 2rem;
}

.challenge-card {
  background: var(--panel);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.challenge-header {
  padding: 1.5rem;
  border-bottom: 1px solid #333;
}

.challenge-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.challenge-theme {
  color: var(--accent);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.challenge-date {
  color: #9ca3af;
  font-size: 0.875rem;
}

.iframe-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  background: #0a0f1f;
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.view-full {
  display: block;
  padding: 1rem;
  text-align: center;
  color: var(--accent);
  text-decoration: none;
  border-top: 1px solid #333;
  transition: background 0.2s;
}

.view-full:hover {
  background: rgba(165, 180, 252, 0.1);
}

@media (max-width: 768px) {
  .showcase-header h1 {
    font-size: 2rem;
  }

  .challenge-header {
    padding: 1rem;
  }

  .challenge-header h2 {
    font-size: 1.25rem;
  }
}
```

**Create `showcase.js`**:

```javascript
(function() {
  const grid = document.getElementById('showcase-grid');
  const countEl = document.querySelector('.challenge-count');

  // Lazy loading configuration
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target.querySelector('iframe');
        if (iframe && iframe.dataset.src && iframe.src === 'about:blank') {
          iframe.src = iframe.dataset.src;
        }
      }
    });
  }, {
    rootMargin: '100px'
  });

  // Load and render challenges
  async function loadChallenges() {
    try {
      const response = await fetch('manifest.json');
      const manifest = await response.json();

      // Update count
      countEl.textContent = `${manifest.total} challenges completed`;

      // Render challenges (newest first)
      const challenges = [...manifest.days].reverse();

      challenges.forEach(day => {
        const card = createChallengeCard(day);
        grid.appendChild(card);
        observer.observe(card);
      });

    } catch (error) {
      console.error('Failed to load manifest:', error);
      countEl.textContent = 'Failed to load challenges';
      grid.innerHTML = '<p style="text-align: center; color: #9ca3af;">No challenges found. Create your first challenge in a day1/ folder!</p>';
    }
  }

  function createChallengeCard(day) {
    const card = document.createElement('article');
    card.className = 'challenge-card';
    card.dataset.day = day.number;

    const date = day.created ? new Date(day.created).toLocaleDateString('ja-JP') : '';

    card.innerHTML = `
      <div class="challenge-header">
        <h2>Day ${day.number}: ${day.title}</h2>
        ${day.theme ? `<p class="challenge-theme">テーマ: ${day.theme}</p>` : ''}
        ${date ? `<time class="challenge-date" datetime="${day.created}">${date}</time>` : ''}
      </div>

      <div class="iframe-container">
        <iframe
          data-src="${day.url}"
          src="about:blank"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerpolicy="no-referrer"
        ></iframe>
      </div>

      <a href="${day.url}" class="view-full">View Full Page →</a>
    `;

    return card;
  }

  // Initialize
  loadChallenges();
})();
```

---

### Step 3: Test Locally

```bash
# Serve the site locally (Python 3)
python3 -m http.server 8000

# Or using Node.js
npx http-server -p 8000

# Open in browser
open http://localhost:8000
```

**Expected result**: You should see the showcase page with your existing challenges (day1, day2, etc.).

---

### Step 4: Deploy to GitHub Pages

**Enable GitHub Pages**:

1. Go to repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select branch: `main`
5. Select folder: `/ (root)`
6. Click "Save"

**Access your site**:
```
https://<username>.github.io/<repository-name>/
```

Example: `https://kumac13.github.io/ai-sprint/`

---

## Daily Workflow

### Adding a New Challenge

**Step 1**: Create a new day folder

```bash
# Automatically increment day number
mkdir day3
```

**Step 2**: Create `index.html`

```bash
cat > day3/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Day 3: My Challenge Title</title>
  <meta name="challenge-theme" content="テーマ名">
</head>
<body>
  <h1>Day 3 Challenge</h1>
  <!-- Your challenge content here -->
</body>
</html>
EOF
```

**Step 3**: Commit and push

```bash
git add day3/
git commit -m "feat: add day3 challenge"
# Pre-commit hook automatically generates manifest.json
git push
```

**That's it!** The new challenge will appear on your showcase page automatically.

---

### Adding Assets to a Challenge

```bash
# Create assets folder
mkdir day3/assets

# Add images, fonts, etc.
cp image.png day3/assets/

# Reference in HTML using relative paths
# <img src="assets/image.png">
```

---

### Using External Libraries

**Via CDN** (recommended):

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js"></script>
</head>
```

**Local copy** (optional):

```bash
# Download library
curl -o day3/matter.min.js https://cdn.jsdelivr.net/npm/matter-js@0.20.0/build/matter.min.js

# Reference in HTML
# <script src="matter.min.js"></script>
```

---

## Troubleshooting

### Manifest not updating

**Problem**: New challenges don't appear on showcase page.

**Solution**:
1. Check pre-commit hook is executable: `ls -l .git/hooks/pre-commit`
2. Run hook manually: `.git/hooks/pre-commit`
3. Verify manifest.json was updated: `cat manifest.json`
4. Ensure manifest.json is committed: `git add manifest.json && git commit --amend --no-edit`

---

### Challenge not showing in showcase

**Problem**: Created `day4/` but it doesn't appear.

**Checklist**:
- [ ] Folder name matches pattern: `day4` (lowercase, no padding)
- [ ] `index.html` exists in folder
- [ ] `index.html` has `<title>` tag
- [ ] manifest.json includes the challenge
- [ ] Changes are committed and pushed

**Verify**:
```bash
# Check folder structure
ls -la day4/

# Check manifest
cat manifest.json | grep "day4"

# Test locally
python3 -m http.server 8000
```

---

### Iframe not loading

**Problem**: Challenge card shows blank iframe.

**Possible causes**:
1. **404 error**: File doesn't exist at expected path
   - Check: `curl http://localhost:8000/day4/index.html`
2. **CORS error**: Serving from file:// instead of http://
   - Solution: Use local server (python/node)
3. **Sandbox restrictions**: Missing required permissions
   - Check browser console for errors

---

### GitHub Pages not updating

**Problem**: Pushed changes but site not updating.

**Steps**:
1. Check GitHub Actions tab for deployment status
2. Wait 1-2 minutes for deployment
3. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Clear browser cache if needed

---

## Advanced Usage

### Custom Metadata

Add custom metadata to challenges:

```html
<head>
  <title>Day 5: Physics Simulation</title>
  <meta name="challenge-theme" content="物理エンジン">
  <meta name="challenge-tags" content="physics,matter.js,canvas">
  <meta name="description" content="Interactive physics demonstration">

  <!-- Social media -->
  <meta property="og:title" content="Day 5: Physics Simulation">
  <meta property="og:description" content="Interactive physics demonstration">
  <meta property="og:image" content="./assets/preview.png">
</head>
```

**Note**: Tags and social metadata are not yet extracted by manifest generator but are reserved for future enhancement.

---

### Dynamic Height Iframes

Make iframes resize to content height:

**In challenge page** (day5/index.html):

```html
<script>
  // Report height to parent
  function reportHeight() {
    const height = document.body.scrollHeight;
    window.parent.postMessage({
      type: 'resize',
      height: height
    }, '*');
  }

  window.addEventListener('load', reportHeight);

  // Update on content changes
  const observer = new ResizeObserver(reportHeight);
  observer.observe(document.body);
</script>
```

**In showcase.js**, add listener:

```javascript
window.addEventListener('message', (event) => {
  if (event.data.type === 'resize') {
    const iframe = Array.from(document.querySelectorAll('iframe'))
      .find(f => f.contentWindow === event.source);

    if (iframe && event.data.height) {
      const container = iframe.closest('.iframe-container');
      container.style.paddingTop = '0';
      container.style.height = `${event.data.height}px`;
    }
  }
});
```

---

### Skip Days

You can skip day numbers (e.g., day1, day2, day5):

```bash
mkdir day5  # day3 and day4 don't exist
```

The showcase will display only existing challenges in order. Gaps are allowed.

---

## Best Practices

### 1. Keep Challenges Self-Contained

✅ **Good**:
```
day5/
├── index.html
├── style.css
└── assets/
    └── image.png
```

❌ **Avoid**:
```
day5/
└── index.html  (references ../shared/style.css)
shared/
└── style.css
```

**Why**: Each challenge should work independently.

---

### 2. Use Descriptive Titles

✅ **Good**: `<title>Day 5: Physics Simulation - Bouncing Balls</title>`

❌ **Poor**: `<title>Day 5</title>`

**Why**: Titles appear in showcase and browser tabs.

---

### 3. Optimize Performance

- Use lazy loading for heavy assets
- Minimize external dependencies
- Keep HTML file size reasonable (<500KB)
- Compress images

---

### 4. Test Responsively

Ensure challenges work on mobile:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Test at multiple screen sizes:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

---

## Next Steps

✅ Setup complete! You're ready to:

1. **Create your first challenge**: `mkdir day1 && edit day1/index.html`
2. **Commit and see it live**: `git add . && git commit -m "feat: add day1" && git push`
3. **Share your showcase**: `https://<username>.github.io/<repo-name>/`

**Happy coding! 🚀**

---

## Quick Reference

| Task | Command |
|------|---------|
| Create new challenge | `mkdir dayN && touch dayN/index.html` |
| Test locally | `python3 -m http.server 8000` |
| Regenerate manifest | `.git/hooks/pre-commit` |
| View manifest | `cat manifest.json` |
| Deploy | `git push` |
| View live site | `https://<user>.github.io/<repo>/` |

---

**Need help?** Check the [file structure contract](./contracts/file-structure.md) for detailed specifications.
