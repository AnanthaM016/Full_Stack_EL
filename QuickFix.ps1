# Quick Fix Script for Search Teammates Page
# Run this from the project root directory

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  TeamFinder - Quick Fix Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path ".\frontend\src\pages")) {
    Write-Host "❌ ERROR: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   (The directory containing 'frontend' and 'backend' folders)" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Step 1: Checking current state..." -ForegroundColor Yellow
$searchTeammatesExists = Test-Path ".\frontend\src\pages\SearchTeammates.jsx"
$searchTeammates2Exists = Test-Path ".\frontend\src\pages\SearchTeammates2.jsx"

if ($searchTeammatesExists) {
    Write-Host "   ⚠️  Found corrupted SearchTeammates.jsx" -ForegroundColor Yellow
    Write-Host "   🗑️  Removing corrupted file..." -ForegroundColor Yellow
    Remove-Item ".\frontend\src\pages\SearchTeammates.jsx" -Force
    Write-Host "   ✅ Removed" -ForegroundColor Green
}

if ($searchTeammates2Exists) {
    Write-Host "   ℹ️  Found SearchTeammates2.jsx (partial file)" -ForegroundColor Cyan
    Write-Host "   🗑️  Removing partial file..." -ForegroundColor Yellow
    Remove-Item ".\frontend\src\pages\SearchTeammates2.jsx" -Force
    Write-Host "   ✅ Removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan  
Write-Host "📝 Manual Steps Required:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The SearchTeammates.jsx file has been removed." -ForegroundColor White
Write-Host ""
Write-Host "🔧 TO FIX:" -ForegroundColor Yellow
Write-Host "   1. Open this file: .\FEATURES_UPDATE.md" -ForegroundColor White
Write-Host "   2. Go to section '1. Fix SearchTeammates.jsx'" -ForegroundColor White  
Write-Host "   3. Copy the ENTIRE code block" -ForegroundColor White
Write-Host "   4. Create new file: frontend\src\pages\SearchTeammates.jsx" -ForegroundColor White
Write-Host "   5. Paste the code and save" -ForegroundColor White
Write-Host ""
Write-Host "✨ THEN:" -ForegroundColor Yellow
Write-Host "   6. Follow sections 2 & 3 in FEATURES_UPDATE.md" -ForegroundColor White
Write-Host "   7. Update Register.jsx (3 small changes)" -ForegroundColor White
Write-Host "   8. Update authController.js (1 line)" -ForegroundColor White
Write-Host ""
Write-Host "🚀 FINALLY:" -ForegroundColor Yellow
Write-Host "   9. Restart your frontend: npm run dev (in frontend folder)" -ForegroundColor White
Write-Host "   10. Test the new features!" -ForegroundColor White
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📚 Need help? Check FEATURES_SUMMARY.md for overview" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Cleanup complete! Ready for manual updates." -ForegroundColor Green
Write-Host ""

# Ask if user wants to open the documentation
$response = Read-Host "Would you like to open FEATURES_UPDATE.md now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Start-Process ".\FEATURES_UPDATE.md"
    Write-Host "📖 Opened documentation!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
