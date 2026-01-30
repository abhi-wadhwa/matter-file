#!/bin/bash
# Compile matter file to PDF

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/output"
OUTPUT_NAME="${1:-matter-file.pdf}"

echo "🔨 Compiling Matter File..."

# First, combine all sections
"$SCRIPT_DIR/combine.sh"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Check for pandoc
if ! command -v pandoc &> /dev/null; then
    echo "❌ pandoc not found. Run ./scripts/setup.sh first."
    exit 1
fi

# Compile to PDF
echo ""
echo "📄 Generating PDF..."

# Try pdflatex first, fall back to other engines
if command -v pdflatex &> /dev/null; then
    pandoc "$PROJECT_DIR/MATTER_FILE.md" \
        -o "$OUTPUT_DIR/$OUTPUT_NAME" \
        --pdf-engine=pdflatex \
        --toc \
        --toc-depth=3 \
        -V geometry:margin=1in \
        -V fontsize=11pt \
        -V linestretch=1.15 \
        -V colorlinks=true \
        -V linkcolor=blue \
        -V urlcolor=blue \
        --highlight-style=tango \
        2>&1 | head -20
elif command -v weasyprint &> /dev/null; then
    # Convert to HTML first, then to PDF
    pandoc "$PROJECT_DIR/MATTER_FILE.md" \
        -o "$OUTPUT_DIR/temp.html" \
        --toc \
        --toc-depth=3 \
        --standalone
    weasyprint "$OUTPUT_DIR/temp.html" "$OUTPUT_DIR/$OUTPUT_NAME"
    rm "$OUTPUT_DIR/temp.html"
else
    echo "❌ No PDF engine found. Install LaTeX or weasyprint."
    echo "   For now, generating HTML instead..."
    pandoc "$PROJECT_DIR/MATTER_FILE.md" \
        -o "$OUTPUT_DIR/${OUTPUT_NAME%.pdf}.html" \
        --toc \
        --toc-depth=3 \
        --standalone \
        --css="https://cdn.simplecss.org/simple.min.css"
    echo "✅ Generated: $OUTPUT_DIR/${OUTPUT_NAME%.pdf}.html"
    exit 0
fi

if [[ -f "$OUTPUT_DIR/$OUTPUT_NAME" ]]; then
    echo ""
    echo "✅ PDF generated: $OUTPUT_DIR/$OUTPUT_NAME"
    echo "   Size: $(du -h "$OUTPUT_DIR/$OUTPUT_NAME" | cut -f1)"
else
    echo "❌ PDF generation failed"
    exit 1
fi
