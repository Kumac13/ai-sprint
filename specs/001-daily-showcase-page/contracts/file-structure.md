# File Structure Contract

**Feature**: Daily Challenge Showcase Page
**Date**: 2025-10-18
**Version**: 1.0.0

## Overview

This document defines the required file structure and naming conventions for the AI Sprint Challenge project. All components must adhere to these contracts to ensure the showcase page functions correctly.

---

## Repository Root Structure

### Required Files

```
ai-sprint/                    # Repository root
├── index.html                # Showcase page (landing page)
├── manifest.json             # Auto-generated challenge metadata
└── README.md                 # Project documentation
```

### Optional Files

```
ai-sprint/
├── showcase.css              # Showcase page styles
├── showcase.js               # Showcase page logic
├── .gitignore                # Git ignore rules
└── .git/
    └── hooks/
        └── pre-commit        # Manifest generator
```

---

## Challenge Folder Structure

### Naming Convention

**Pattern**: `day<N>` where `<N>` is a positive integer

**Valid Examples**:
- ✅ `day1`
- ✅ `day2`
- ✅ `day42`
- ✅ `day365`

**Invalid Examples**:
- ❌ `Day1` (capital D)
- ❌ `day01` (leading zero)
- ❌ `day-1` (dash separator)
- ❌ `challenge1` (wrong prefix)
- ❌ `day_1` (underscore separator)

**Validation Regex**: `/^day\d+$/`

---

### Required Challenge Files

```
dayN/
└── index.html              # REQUIRED: Challenge entry point
```

**Constraints**:
- **MUST** contain `index.html` file
- File name **MUST** be lowercase
- **MUST** be valid HTML5 document
- **SHOULD** be self-contained (all dependencies within folder or CDN)

---

### Optional Challenge Files

```
dayN/
├── index.html              # REQUIRED
├── style.css               # Optional: Challenge-specific styles
├── script.js               # Optional: Challenge-specific logic
├── assets/                 # Optional: Images, fonts, etc.
│   ├── image1.png
│   └── font.woff2
└── README.md               # Optional: Challenge documentation
```

**Best Practices**:
- Keep all challenge assets within `dayN/` folder
- Use relative paths for local assets
- Use CDN URLs for external libraries
- Avoid deep nesting (max 2 levels recommended)

---

## HTML Structure Contract

### Minimal Valid Challenge

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Challenge Title</title>
</head>
<body>
  <!-- Your challenge content -->
</body>
</html>
```

### Required HTML Elements

| Element | Requirement | Purpose |
|---------|-------------|---------|
| `<!DOCTYPE html>` | REQUIRED | HTML5 document type |
| `<html lang="...">` | REQUIRED | Document language |
| `<meta charset="UTF-8">` | REQUIRED | Character encoding |
| `<title>` | REQUIRED | Extracted for manifest metadata |
| `<meta name="viewport">` | RECOMMENDED | Responsive design |

---

### Optional Metadata Elements

For enhanced showcase display, challenges MAY include:

```html
<head>
  <!-- Basic metadata (extracted by manifest generator) -->
  <title>Day 1: Falling Stack</title>
  <meta name="description" content="Interactive physics simulation">
  <meta name="author" content="Your Name">

  <!-- Theme/category (custom convention) -->
  <meta name="challenge-theme" content="圧縮">
  <meta name="challenge-tags" content="physics,matter.js,animation">

  <!-- Social media (for sharing) -->
  <meta property="og:title" content="Day 1: Falling Stack">
  <meta property="og:description" content="Interactive physics simulation">
  <meta property="og:image" content="./assets/preview.png">
</head>
```

**Extraction Priority** (for manifest generation):
1. `<meta name="challenge-theme">` → `theme`
2. `<title>` → `title`
3. `<meta name="description">` → `description`
4. `<meta name="challenge-tags">` → `tags[]`

---

### Theme Marker Convention (Legacy)

Challenges created before metadata tags may use HTML markers:

```html
<body>
  <section style="...">
    <h2>Statement｜テーマ：「圧縮」</h2>
    <p>Challenge description...</p>
  </section>
</body>
```

**Extraction Pattern**: `/テーマ[：:]\s*[「"]([^」"]+)[」"]/`

This pattern will be deprecated in favor of `<meta name="challenge-theme">`.

---

## Manifest Contract

### File Location

**Path**: `/manifest.json` (repository root)

### JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["updated", "total", "days"],
  "properties": {
    "updated": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 timestamp of last generation"
    },
    "total": {
      "type": "integer",
      "minimum": 0,
      "description": "Total number of challenges"
    },
    "days": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["number", "folder", "url", "title"],
        "properties": {
          "number": {
            "type": "integer",
            "minimum": 1,
            "description": "Day number"
          },
          "folder": {
            "type": "string",
            "pattern": "^day\\d+$",
            "description": "Folder name"
          },
          "url": {
            "type": "string",
            "pattern": "^day\\d+/$",
            "description": "Relative URL path"
          },
          "title": {
            "type": "string",
            "minLength": 1,
            "description": "Challenge title from HTML"
          },
          "theme": {
            "type": "string",
            "description": "Optional theme/topic"
          },
          "created": {
            "type": "string",
            "format": "date-time",
            "description": "Optional creation timestamp"
          }
        }
      }
    }
  }
}
```

### Example Valid Manifest

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
    },
    {
      "number": 2,
      "folder": "day2",
      "url": "day2/",
      "title": "Day 2 Challenge",
      "created": "2025-10-18T09:11:00.000Z"
    }
  ]
}
```

### Validation Rules

| Rule | Requirement | Error Message |
|------|-------------|---------------|
| Valid JSON | MUST | "Invalid JSON in manifest.json" |
| `updated` format | MUST be ISO 8601 | "Invalid timestamp format" |
| `total` accuracy | MUST equal `days.length` | "Total mismatch: expected X, got Y" |
| `days` order | MUST be sorted by `number` ASC | "Days array must be sorted" |
| Unique day numbers | MUST have no duplicates | "Duplicate day number: N" |
| Folder existence | SHOULD exist in repository | "Warning: dayN folder not found" |

---

## Git Hook Contract

### Pre-commit Hook Location

**Path**: `.git/hooks/pre-commit`

### Hook Responsibilities

1. **Scan** repository root for `day*` folders
2. **Validate** each folder contains `index.html`
3. **Extract** metadata from each `index.html`
4. **Generate** `manifest.json` with sorted array
5. **Stage** manifest.json for commit

### Hook Exit Codes

| Code | Meaning | Action |
|------|---------|--------|
| 0 | Success | Manifest generated and staged |
| 1 | Error | Commit aborted (e.g., invalid HTML) |

### Hook Configuration

**Executable**: MUST have execute permissions
```bash
chmod +x .git/hooks/pre-commit
```

**Shebang**: MUST specify interpreter
```bash
#!/bin/bash
# or
#!/usr/bin/env node
```

---

## URL Routing Contract

### Showcase Page

**Production URL**: `https://username.github.io/repository-name/`
**Local URL**: `http://localhost:8000/` (when serving locally)

**Route**: `/` → `index.html` (showcase page)

### Challenge Pages

**Production URL**: `https://username.github.io/repository-name/dayN/`
**Local URL**: `http://localhost:8000/dayN/`

**Route**: `/dayN/` → `dayN/index.html` (challenge page)

### Asset Paths

**Relative** (recommended):
```html
<link rel="stylesheet" href="style.css">
<script src="script.js"></script>
<img src="assets/image.png">
```

**Root-relative** (avoid - breaks local testing):
```html
<!-- ❌ Don't use - breaks when repository is not at domain root -->
<link rel="stylesheet" href="/style.css">
```

**Absolute** (for CDN only):
```html
<script src="https://cdn.example.com/library.js"></script>
```

---

## GitHub Pages Contract

### Repository Settings

**Required Configuration**:
1. Enable GitHub Pages
2. Set source to `main` branch
3. Set directory to `/ (root)`

**Optional**:
- Custom domain
- Enforce HTTPS (recommended)

### Deployment Trigger

**Trigger**: Push to `main` branch

**Process**:
1. Pre-commit hook generates `manifest.json`
2. Commit includes updated manifest
3. Push to GitHub
4. GitHub Pages builds and deploys
5. Changes live within 1-2 minutes

---

## Breaking Changes

Changes to this contract that would break existing implementations:

### Major Version Bumps Required For:

- Changing folder naming pattern (e.g., `day1` → `challenge-1`)
- Changing manifest.json schema (removing required fields)
- Changing manifest.json location
- Changing index.html location or name

### Minor Version Bumps Required For:

- Adding optional fields to manifest.json
- Adding optional metadata tags to HTML
- Adding new optional files to challenge folders

### Patch Version Bumps Required For:

- Fixing bugs in validation rules
- Clarifying documentation
- Adding examples

---

## Validation Tools

### Local Validation Script

```bash
# Validate folder structure
ls -d day* 2>/dev/null | while read folder; do
  if [ ! -f "$folder/index.html" ]; then
    echo "❌ Missing index.html in $folder"
  else
    echo "✅ $folder"
  fi
done

# Validate manifest
node -e "
const fs = require('fs');
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
if (manifest.total !== manifest.days.length) {
  console.error('❌ Manifest total mismatch');
  process.exit(1);
}
console.log('✅ Manifest valid');
"
```

### CI/CD Validation (GitHub Actions)

```yaml
name: Validate Structure

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Validate folder structure
        run: |
          for dir in day*/; do
            if [ ! -f "$dir/index.html" ]; then
              echo "::error::Missing index.html in $dir"
              exit 1
            fi
          done

      - name: Validate manifest
        run: |
          node -e "
          const manifest = require('./manifest.json');
          if (manifest.total !== manifest.days.length) {
            console.error('Manifest validation failed');
            process.exit(1);
          }
          "
```

---

## Summary

**Core Contracts**:
1. **Folder naming**: `day<N>` pattern (lowercase, no padding)
2. **Required file**: `index.html` in each `dayN/` folder
3. **Manifest location**: `/manifest.json` at repository root
4. **Manifest format**: Valid JSON matching schema
5. **Git hook**: Auto-generates manifest on commit

**Validation**: Enforced at commit time (pre-commit hook) and optionally in CI/CD

**Versioning**: This contract follows semantic versioning (currently 1.0.0)

---

**Version**: 1.0.0
**Last Updated**: 2025-10-18
**Status**: ✅ Active
