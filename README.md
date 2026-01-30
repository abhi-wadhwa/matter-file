# Matter File System

A modular, LLM-friendly debate matter file system designed for easy additions via Claude Code or ChatGPT.

## Quick Start

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd matter-file-system
chmod +x scripts/*.sh

# 2. Install dependencies (one-time)
./scripts/setup.sh

# 3. Compile your matter file to PDF
./scripts/compile.sh
```

## Directory Structure

```
matter-file-system/
├── README.md                     # This file
├── MATTER_FILE.md               # Master file (auto-generated from sections)
├── sections/                     # All content lives here
│   ├── 00-frontmatter/
│   │   └── disclaimers.md
│   ├── 01-stock-arguments/
│   │   ├── _index.md            # Section intro + table of contents
│   │   ├── state-ownership.md
│   │   ├── interest-rates.md
│   │   └── ...
│   ├── 02-substantive/
│   ├── 03-international-relations/
│   └── 04-southeast-asia/
├── scripts/
│   ├── setup.sh                 # Install dependencies
│   ├── compile.sh               # Build PDF from markdown
│   ├── combine.sh               # Merge sections into MATTER_FILE.md
│   └── add-topic.py             # Helper for LLM additions
├── templates/
│   ├── section-template.md      # Template for new sections
│   ├── topic-template.md        # Template for new topics
│   └── chatgpt-prompt.md        # Prompt for ChatGPT research
├── output/
│   └── matter-file.pdf          # Compiled PDF
└── .github/workflows/
    └── compile.yml              # Auto-compile on push (optional)
```

## Adding New Content

### Method 1: Claude Code (Recommended)

Just tell Claude Code what you want:

```
"Add a section about the 2024 Argentina peso crisis under Currency Strength"
"Add arguments for and against carbon taxes in the stock arguments"
"Update the FOMC section with the latest rate decisions"
```

Claude Code will:
1. Research the topic (or use info you provide)
2. Format it according to the templates
3. Add it to the correct section file
4. Commit the changes

### Method 2: ChatGPT Research → Claude Code Execution

1. **Use ChatGPT for research** (copy the prompt from `templates/chatgpt-prompt.md`):
   ```
   Research [TOPIC] for a debate matter file. Provide:
   - TL;DR (2-3 sentences)
   - Key arguments FOR (with bullet points)
   - Key arguments AGAINST (with bullet points)
   - Important statistics/data points
   - Notable examples/case studies
   - Sources
   
   Format as markdown following this structure: [paste template]
   ```

2. **Copy ChatGPT's output** to a file like `new-content.md`

3. **Tell Claude Code to integrate it**:
   ```
   "Add the content from new-content.md to the appropriate section in my matter file"
   ```

### Method 3: Manual Editing

1. Copy `templates/topic-template.md`
2. Fill in your content
3. Save to the appropriate `sections/` folder
4. Run `./scripts/compile.sh`

## Formatting Guide

### Hierarchy

```markdown
# Section Title (H1) - Major categories like "Stock Arguments"

## Topic Title (H2) - Specific topics like "State Ownership"

### Subtopic (H3) - Sub-areas like "Nationalization" vs "Privatization"

#### TL;DR (H4) - Brief summary

- **Bullet points** for arguments
  - Sub-bullets for supporting details
  - Use (1), (2), (3) for inline lists
```

### Argument Format

```markdown
## Topic Name

#### TL;DR
Brief 2-3 sentence summary of the core tension/debate.

### Position A (e.g., "For Nationalization")

- **Main argument.** Supporting detail and explanation. Evidence or example.
  - Sub-point with additional nuance
  - Another sub-point

- **Second argument.** More details here.

### Position B (e.g., "For Privatization")

- **Counter-argument.** Explanation and evidence.
```

## Compiling

```bash
# Full compile (combines sections + generates PDF)
./scripts/compile.sh

# Just combine sections (no PDF)
./scripts/combine.sh

# Compile with custom output name
./scripts/compile.sh my-custom-name.pdf
```

## ChatGPT Integration Tips

ChatGPT's research mode is excellent for:
- Finding recent statistics and data
- Discovering new case studies
- Getting multiple perspectives on controversial topics
- Fact-checking existing content

**Workflow:**
1. Use ChatGPT to research and draft content
2. Save the output to a `.md` file in your repo
3. Use Claude Code to:
   - Clean up formatting
   - Integrate into the correct section
   - Ensure consistency with existing style
   - Commit changes

**Pro tip:** Create a ChatGPT "GPT" with your formatting instructions pre-loaded for consistent output.

## Backup & Version Control

This system is designed for Git:

```bash
# After making changes
git add -A
git commit -m "Add section on [topic]"
git push

# To see history of a topic
git log --oneline sections/01-stock-arguments/interest-rates.md

# To revert a change
git revert HEAD
```

## Dependencies

- **pandoc** - Markdown to PDF conversion
- **texlive** - LaTeX for PDF generation (or use --pdf-engine=weasyprint for lighter install)
- **Python 3.8+** - For helper scripts

Install via:
```bash
# macOS
brew install pandoc basictex

# Ubuntu/Debian
sudo apt install pandoc texlive-latex-recommended texlive-fonts-recommended

# Or use the setup script
./scripts/setup.sh
```

## License

Your content. Your rules.
