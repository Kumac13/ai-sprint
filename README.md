# AI Sprint Challenge

Everyday AI vibes coding challenge in 15 minutes.

## Rules
- AI gives you a theme for the day in one word in Japanese.
- You have 15 minutes to code something related to that theme.

## Important to note
- Do not think too much about what you create, just code it.

---

## 🌐 Showcase Page

View all challenges in one place:
- **Local**: Run `python3 -m http.server 8000` and visit http://localhost:8000
- **GitHub Pages**: Deploy this repository to GitHub Pages to see the showcase automatically

---

## 📝 How to Add a New Challenge

1. **Create a new folder**:
   ```bash
   mkdir day3
   ```

2. **Create index.html**:
   ```bash
   cat > day3/index.html << 'EOF'
   <!DOCTYPE html>
   <html lang="ja">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Day 3: Your Challenge Title</title>
   </head>
   <body>
     <h1>Day 3 Challenge</h1>
     <!-- Your challenge content here -->
   </body>
   </html>
   EOF
   ```

3. **Commit**:
   ```bash
   git add day3/
   git commit -m "feat: add day3 challenge"
   ```

   → The pre-commit hook will automatically update `manifest.json`!

4. **Push**:
   ```bash
   git push
   ```

**That's it!** Your new challenge will automatically appear on the showcase page.

---

## 🚀 Deploy to GitHub Pages

1. Go to repository Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` / Directory: `/ (root)`
4. Save

After a few minutes, access at `https://username.github.io/repository-name/`

---

## 🛠️ Tech Stack

- **HTML5 / CSS3 / JavaScript (ES6+)**
- **Vanilla JS** (no frameworks)
- **Intersection Observer API** (lazy loading)
- **iframes** (challenge embedding)
- **Git hooks** (automatic manifest.json generation)

---

## 📁 Project Structure

```
ai-sprint/
├── index.html          # Showcase page
├── showcase.css        # Showcase styles
├── showcase.js         # Showcase logic
├── manifest.json       # Auto-generated challenge list
├── day1/
│   └── index.html
├── day2/
│   └── index.html
└── README.md
```

---

## ⚡ Features

- ✅ List all challenges
- ✅ Display each challenge in an iframe (interactive elements work)
- ✅ Highlight the latest challenge
- ✅ Responsive design (mobile-friendly)
- ✅ Lazy loading (performance optimized)
- ✅ Auto-discovery (new challenges appear automatically)

---

## 📚 Detailed Documentation

For more details and customization options, see `/specs/001-daily-showcase-page/quickstart.md`
