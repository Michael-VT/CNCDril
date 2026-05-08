#!/bin/bash
# CNCDril - Git Deployment Script
# This script helps prepare and deploy the repository to GitHub

echo "🚀 CNCDril - Git Deployment Script"
echo "=================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Run: git init"
    exit 1
fi

echo "📋 Current Git Status:"
echo "===================="
git status --short
echo ""

echo "🧹 Cleaning up old files..."
# Remove old files from git tracking
git add -u
echo ""

echo "➕ Adding new files..."
# Add all new files
git add .
echo ""

echo "📊 What will be committed:"
echo "========================="
git status --short
echo ""

echo "📝 Commit message suggestion:"
echo "============================"
echo "feat: Add multi-platform CNCDril implementation"
echo ""
echo "This commit includes:"
echo "- Python CLI and GUI applications"
echo "- Web-based application with 6 language support"
echo "- Comprehensive documentation in EN, RU, UK, PT, DE, FR"
echo "- Proper repository structure with examples"
echo "- Updated .gitignore for all platforms"
echo "- MIT License"
echo ""

read -p "Do you want to commit these changes? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "💾 Committing changes..."
    git commit -m "feat: Add multi-platform CNCDril implementation

- Python CLI and GUI applications with optimization algorithms
- Web-based application with 6 language support
- Canvas visualization and drag-and-drop interface
- Comprehensive documentation in EN, RU, UK, PT, DE, FR
- Proper repository structure with examples
- Updated .gitignore for all platforms
- MIT License

All versions produce identical G-Code output and support:
- SortByX, SortByY, SortByPath (OPTICS) optimization
- P-CAD/Altium .drl file format
- Multi-tool support
- Interactive visualization"

    echo ""
    echo "✅ Changes committed successfully!"
    echo ""
    echo "🌍 Next steps to push to GitHub:"
    echo "=================================="
    echo "1. Create a new repository on GitHub.com"
    echo "2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/CNCDril.git"
    echo "3. Push: git push -u origin master"
    echo ""
else
    echo "❌ Commit cancelled. You can commit manually with:"
    echo "   git add ."
    echo "   git commit -m 'Your message here'"
fi