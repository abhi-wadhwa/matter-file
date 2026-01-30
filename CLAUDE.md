# Claude Code Instructions for Matter File

This file contains instructions for Claude Code when working with this matter file system.

## Project Overview

This is a modular debate matter file system. Content is organized in `sections/` as markdown files, which get compiled into a single PDF.

## Directory Structure

- `sections/` - All content lives here, organized by category
- `scripts/` - Build and helper scripts
- `templates/` - Templates for new content
- `output/` - Compiled PDF output

## How to Add New Content

### Adding a New Topic to an Existing Section

1. Check existing sections: `ls sections/`
2. Read the template: `cat templates/topic-template.md`
3. Create a new file in the appropriate section:
   ```bash
   # Example: adding "carbon-taxes" to stock arguments
   cp templates/topic-template.md sections/01-stock-arguments/carbon-taxes.md
   ```
4. Edit the new file with the content
5. Compile: `./scripts/compile.sh`

### Adding a New Section

1. Create a new numbered directory: `mkdir sections/05-new-section`
2. Create an index file: `cp templates/section-template.md sections/05-new-section/_index.md`
3. Add topic files as needed

### Integrating ChatGPT Research

When the user provides content from ChatGPT:
1. Review the content for formatting consistency
2. Ensure it matches the style in `templates/topic-template.md`
3. Place it in the correct section
4. Update the section's `_index.md` if it exists

## Formatting Rules

### Hierarchy
- `#` (H1) = Section titles only (in `_index.md`)
- `##` (H2) = Topic titles
- `###` (H3) = Positions/subtopics (e.g., "For X", "Against X")
- `####` (H4) = Special labels (TL;DR, Key Statistics)

### Argument Format
```markdown
- **Bold claim.** Explanation with evidence.
  - Sub-point with detail
  - Another sub-point
```

### Inline Lists
Use `(1)`, `(2)`, `(3)` for inline enumeration within sentences.

## Common Tasks

### "Add a section about X"
1. Determine which existing section it belongs to
2. Research X (or use provided content)
3. Create file following template
4. Ensure consistent formatting

### "Update section X with new information"
1. Find the file: `find sections -name "*keyword*"`
2. Read current content
3. Add new information in the appropriate place
4. Maintain formatting consistency

### "Compile the matter file"
```bash
./scripts/compile.sh
```

### "List all topics"
```bash
find sections -name "*.md" -not -name "_index.md" -not -name "README.md"
```

## Quality Checklist

Before committing changes:
- [ ] Follows the topic template structure
- [ ] Has TL;DR section
- [ ] Includes both sides of the argument
- [ ] Has specific statistics/data where relevant
- [ ] Uses proper markdown hierarchy
- [ ] Bold claims in bullet points
- [ ] No orphan sections (every section has at least one topic)
