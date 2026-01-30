#!/bin/bash
# Setup script for Matter File System

set -e

echo "🔧 Setting up Matter File System..."

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ -f /etc/debian_version ]]; then
    OS="debian"
elif [[ -f /etc/redhat-release ]]; then
    OS="redhat"
else
    OS="unknown"
fi

echo "Detected OS: $OS"

# Install pandoc
if ! command -v pandoc &> /dev/null; then
    echo "📦 Installing pandoc..."
    case $OS in
        macos)
            brew install pandoc
            ;;
        debian)
            sudo apt-get update && sudo apt-get install -y pandoc
            ;;
        redhat)
            sudo dnf install -y pandoc
            ;;
        *)
            echo "Please install pandoc manually: https://pandoc.org/installing.html"
            ;;
    esac
else
    echo "✓ pandoc already installed"
fi

# Install LaTeX (for PDF generation)
if ! command -v pdflatex &> /dev/null; then
    echo "📦 Installing LaTeX..."
    case $OS in
        macos)
            brew install --cask basictex
            # Update PATH for current session
            eval "$(/usr/libexec/path_helper)"
            # Install additional packages
            sudo tlmgr update --self
            sudo tlmgr install collection-fontsrecommended
            ;;
        debian)
            sudo apt-get install -y texlive-latex-recommended texlive-fonts-recommended texlive-latex-extra
            ;;
        redhat)
            sudo dnf install -y texlive-scheme-basic texlive-collection-fontsrecommended
            ;;
        *)
            echo "Please install LaTeX manually or use weasyprint as PDF engine"
            ;;
    esac
else
    echo "✓ LaTeX already installed"
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. Please install Python 3.8+"
else
    echo "✓ Python 3 found: $(python3 --version)"
fi

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x scripts/*.py 2>/dev/null || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Add your content to sections/"
echo "  2. Run ./scripts/compile.sh to build your PDF"
echo ""
