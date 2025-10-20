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
   mkdir -p challenges/day4
   ```

2. **Create index.html**:
   ```bash
   cat > challenges/day4/index.html << 'EOF'
   <!DOCTYPE html>
   <html lang="ja">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Day 4: Your Challenge Title</title>
   </head>
   <body>
     <h1>Day 4 Challenge</h1>
     <!-- Your challenge content here -->
   </body>
   </html>
   EOF
   ```

3. **Update manifest.json**:
   ```bash
   # Edit challenges/manifest.json to add your new challenge
   # Update "total" count and add a new entry to "days" array:
   {
     "number": 4,
     "folder": "day4",
     "url": "day4/",
     "title": "Your Challenge Title",
     "theme": "テーマ",
     "created": "2025-10-20T00:00:00.000Z"
   }
   ```

4. **Commit and push**:
   ```bash
   git add challenges/day4/ challenges/manifest.json
   git commit -m "feat: add day4 challenge"
   git push
   ```

**That's it!** Your new challenge will appear on the showcase page after GitHub Pages deploys.

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
- **Dynamic showcase** (manifest.json-based)

---

## 📁 Project Structure

```
ai-sprint/
├── index.html          # Redirect to challenges/
├── challenges/         # Main showcase and challenges
│   ├── index.html      # Showcase page
│   ├── showcase.css    # Showcase styles
│   ├── showcase.js     # Showcase logic
│   ├── manifest.json   # Challenge list (update manually)
│   ├── day1/
│   │   └── index.html
│   ├── day2/
│   │   └── index.html
│   └── day3/
│       └── index.html
└── README.md
```

---

## ⚡ Features

- ✅ List all challenges
- ✅ Display challenge links (direct navigation)
- ✅ Highlight the latest challenge
- ✅ Responsive design (mobile-friendly)
- ✅ Dynamic loading (manifest.json-based)
- ✅ Simple and fast (vanilla JavaScript)

---

## 📚 Detailed Documentation

For more details and customization options, see `/specs/001-daily-showcase-page/quickstart.md`
