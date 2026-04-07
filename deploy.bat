@echo off
echo ========================================
echo  AI SOC Sentinel - GitHub Pages Deploy
echo ========================================
echo.

REM Check if dist folder exists
if not exist "dist" (
    echo Building application...
    call npm run build
    if errorlevel 1 (
        echo Build failed! Please fix errors first.
        exit /b 1
    )
)

echo.
echo Application built successfully!
echo.
echo Next steps:
echo 1. Make sure you have a GitHub Personal Access Token
echo 2. Create the token at: https://github.com/settings/tokens/new
echo 3. Give it 'repo' scope
echo.
echo To deploy, run these commands:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit: AI SOC Sentinel v1.0"
echo    git remote add origin https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
echo    npx gh-pages -d dist
echo.
echo When prompted for password, paste your Personal Access Token.
echo.
echo After deployment, enable GitHub Pages:
echo 1. Go to https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/settings/pages
echo 2. Select "Deploy from a branch"
echo 3. Choose "gh-pages" branch and "/" folder
echo 4. Click Save
echo.
echo Your site will be live at:
echo https://thamaraiselvam-a.github.io/ai-soc-sentinel/
echo.
pause