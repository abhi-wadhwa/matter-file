#!/bin/bash
# Combine all section markdown files into a single MATTER_FILE.md

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
SECTIONS_DIR="$PROJECT_DIR/sections"
OUTPUT_FILE="$PROJECT_DIR/MATTER_FILE.md"

echo "📚 Combining sections into MATTER_FILE.md..."

# Start with header
cat > "$OUTPUT_FILE" << 'EOF'
---
title: "Matter File"
author: "Your Name"
date: \today
geometry: margin=1in
fontsize: 11pt
linestretch: 1.15
toc: true
toc-depth: 3
---

EOF

# Function to process a directory
process_directory() {
    local dir="$1"
    local dir_name=$(basename "$dir")
    
    # Skip hidden directories
    [[ "$dir_name" == .* ]] && return
    
    # Check if _index.md exists for section header
    if [[ -f "$dir/_index.md" ]]; then
        echo "" >> "$OUTPUT_FILE"
        cat "$dir/_index.md" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
    
    # Process all .md files in the directory (except _index.md)
    for file in "$dir"/*.md; do
        [[ ! -f "$file" ]] && continue
        [[ "$(basename "$file")" == "_index.md" ]] && continue
        [[ "$(basename "$file")" == "README.md" ]] && continue
        
        echo "  Adding: $(basename "$file")"
        echo "" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "\\newpage" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    done
}

# Process sections in order (sorted by directory name)
for section_dir in $(find "$SECTIONS_DIR" -mindepth 1 -maxdepth 1 -type d | sort); do
    section_name=$(basename "$section_dir")
    echo "Processing section: $section_name"
    process_directory "$section_dir"
done

echo ""
echo "✅ Combined into: $OUTPUT_FILE"
echo "   Total lines: $(wc -l < "$OUTPUT_FILE")"
