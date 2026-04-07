# 🚀 SOC Sentinel AI — Complete Deployment Guide

Deploy your AI SOC Sentinel to GitHub Pages and make it accessible to the world!

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed and configured
- GitHub account (THAMARAISELVAM-A)
- A terminal/command prompt

---

## 🎯 Quick Deploy (Automated)

### Step 1: Install Dependencies
```bash
cd ai-soc-sentinel
npm install
```

### Step 2: Build the Application
```bash
npm run build
```

### Step 3: Deploy to GitHub Pages

#### Option A: Using Personal Access Token (Recommended)

1. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens/new
   - Note: "SOC Sentinel Deploy"
   - Expiration: 90 days (or your preference)
   - Scopes: ✅ `repo` (full control of private repositories)
   - Click **Generate token** and copy it

2. **Set the token as environment variable:**
   ```bash
   # Windows Command Prompt
   set GITHUB_TOKEN=your_token_here

   # Windows PowerShell
   $env:GITHUB_TOKEN="your_token_here"

   # macOS/Linux
   export GITHUB_TOKEN=your_token_here
   ```

3. **Configure git:**
   ```bash
   git config --global user.email "your-github-email@example.com"
   git config --global user.name "THAMARAISELVAM-A"
   ```

4. **Initialize git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI SOC Sentinel v1.0"
   ```

5. **Add remote and deploy:**
   ```bash
   git remote add origin https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
   npm run deploy
   ```

#### Option B: Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Clone your repository:**
   ```bash
   cd ..
   git clone https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
   cd ai-soc-sentinel
   ```

3. **Switch to gh-pages branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf . 2>/dev/null || true
   ```

4. **Copy built files:**
   ```bash
   # From the ai-soc-sentinel directory (where you built)
   cp -r ../ai-soc-sentinel/dist/* .
   
   # Or if on Windows PowerShell:
   Copy-Item -Path ..\ai-soc-sentinel\dist\* -Destination . -Recurse
   ```

5. **Commit and push:**
   ```bash
   git add -A
   git commit -m "Deploy SOC Sentinel AI v1.0 — World Monitor Intelligence Engine"
   git push origin gh-pages --force
   ```

---

## 🔧 Enable GitHub Pages

1. Go to your repository: https://github.com/THAMARAISELVAM-A/ai-soc-sentinel
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** → **/ (root)**
4. Click **Save**

🎉 **Your site will be live at:**
```
https://thamaraiselvam-a.github.io/ai-soc-sentinel/
```

---

## 🔄 Updating Your Deployment

### For Code Changes:

1. **Make your changes** in the `src/` directory
2. **Build the project:**
   ```bash
   npm run build
   ```
3. **Deploy:**
   ```bash
   npm run deploy
   ```

### For Major Updates:

```bash
# Update main branch
git add .
git commit -m "Update: [your changes]"
git push origin main

# Deploy to gh-pages
npm run deploy
```

---

## 🌐 Custom Domain (Optional)

If you want to use your own domain:

1. **Add CNAME file:**
   ```bash
   echo "yourdomain.com" > public/CNAME
   ```

2. **Update DNS settings** at your domain registrar:
   - Create a CNAME record pointing to `thamaraiselvam-a.github.io`

3. **Deploy again:**
   ```bash
   npm run deploy
   ```

4. **Configure in GitHub:**
   - Go to Settings → Pages
   - Under "Custom domain", enter your domain
   - Click **Save**

---

## 🐛 Troubleshooting

### Issue: "Permission denied" when pushing
**Solution:** Use a Personal Access Token instead of password.

### Issue: "gh-pages branch already exists"
**Solution:** 
```bash
git branch -D gh-pages
git push origin --delete gh-pages
npm run deploy
```

### Issue: Build fails
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Site shows blank page
**Solution:** Check browser console for errors. Common fixes:
- Ensure `homepage` in package.json is correct
- Check that all assets loaded properly
- Verify GitHub Pages is enabled for gh-pages branch

---

## 📊 Deployment Status

After deployment, you can check:

1. **GitHub Actions** (if you set up CI/CD)
2. **GitHub Pages URL**: https://thamaraiselvam-a.github.io/ai-soc-sentinel/
3. **Repository Insights** → **Traffic** to see visitor stats

---

## 🎨 Post-Deployment Customization

### Update Site Metadata
Edit `index.html`:
```html
<meta name="description" content="Your custom description">
<meta property="og:title" content="AI SOC Sentinel - Your Custom Title">
<meta property="og:description" content="Custom description for social media">
```

### Add Analytics
Add Google Analytics or other tracking to `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## 🚀 Advanced: Continuous Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 📞 Support

If you encounter issues:

1. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
2. Review the browser console for errors
3. Verify your GitHub repository settings
4. Check the [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)

---

## ✅ Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Git configured with GitHub account
- [ ] Personal Access Token created
- [ ] Dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] GitHub Pages enabled for gh-pages branch
- [ ] Site accessible at https://thamaraiselvam-a.github.io/ai-soc-sentinel/
- [ ] Custom domain configured (optional)
- [ ] Analytics added (optional)

---

**🎉 Congratulations!** Your AI SOC Sentinel is now live and accessible worldwide!

**Live URL:** https://thamaraiselvam-a.github.io/ai-soc-sentinel/

---

*For more help, visit the [GitHub Pages documentation](https://docs.github.com/en/pages) or open an issue in the repository.*