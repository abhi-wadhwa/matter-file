#!/usr/bin/env python3
"""
Add Topic Helper for Matter File System

This script helps LLMs (Claude Code, etc.) add new topics to the matter file.
It handles:
- Finding the right section
- Creating properly formatted files
- Updating indexes

Usage:
    python add-topic.py --section "01-stock-arguments" --topic "carbon-taxes" --content "content.md"
    python add-topic.py --list-sections
    python add-topic.py --template > new-topic.md
"""

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime

SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
SECTIONS_DIR = PROJECT_DIR / "sections"
TEMPLATES_DIR = PROJECT_DIR / "templates"


def list_sections():
    """List all available sections."""
    print("Available sections:")
    print("-" * 40)
    for section in sorted(SECTIONS_DIR.iterdir()):
        if section.is_dir() and not section.name.startswith('.'):
            # Count topics in section
            topics = list(section.glob("*.md"))
            topics = [t for t in topics if t.name not in ("_index.md", "README.md")]
            print(f"  {section.name}/ ({len(topics)} topics)")
            for topic in sorted(topics)[:5]:
                print(f"    - {topic.stem}")
            if len(topics) > 5:
                print(f"    ... and {len(topics) - 5} more")
    print()


def get_template():
    """Return the topic template."""
    template_path = TEMPLATES_DIR / "topic-template.md"
    if template_path.exists():
        return template_path.read_text()
    
    # Default template if file doesn't exist
    return '''## [Topic Name]

#### TL;DR
[2-3 sentence summary of the core debate/tension]

### [Position A]

- **[Main argument].** [Supporting detail and explanation. Evidence or example.]
  - [Sub-point with additional nuance]
  - [Another sub-point]

- **[Second argument].** [More details here.]

### [Position B]

- **[Counter-argument].** [Explanation and evidence.]
  - [Sub-point]

### Key Data Points

- [Statistic 1]
- [Statistic 2]

### Case Studies

- **[Example 1]:** [Brief description]
- **[Example 2]:** [Brief description]

---
*Last updated: [DATE]*
*Sources: [List key sources]*
'''


def add_topic(section: str, topic: str, content: str = None, content_file: str = None):
    """Add a new topic to a section."""
    
    # Find the section
    section_path = None
    for s in SECTIONS_DIR.iterdir():
        if s.is_dir() and (s.name == section or s.name.endswith(f"-{section}")):
            section_path = s
            break
    
    if not section_path:
        print(f"❌ Section not found: {section}")
        print("Available sections:")
        for s in sorted(SECTIONS_DIR.iterdir()):
            if s.is_dir():
                print(f"  - {s.name}")
        sys.exit(1)
    
    # Sanitize topic name for filename
    topic_filename = topic.lower().replace(" ", "-").replace("_", "-")
    topic_filename = "".join(c for c in topic_filename if c.isalnum() or c == "-")
    topic_path = section_path / f"{topic_filename}.md"
    
    # Check if topic already exists
    if topic_path.exists():
        print(f"⚠️  Topic already exists: {topic_path}")
        response = input("Overwrite? [y/N]: ")
        if response.lower() != 'y':
            sys.exit(0)
    
    # Get content
    if content_file:
        content = Path(content_file).read_text()
    elif not content:
        content = get_template()
        content = content.replace("[Topic Name]", topic.title())
        content = content.replace("[DATE]", datetime.now().strftime("%Y-%m-%d"))
    
    # Write the topic file
    topic_path.write_text(content)
    print(f"✅ Created: {topic_path}")
    
    # Update section index if it exists
    index_path = section_path / "_index.md"
    if index_path.exists():
        index_content = index_path.read_text()
        # Check if topic is already listed
        if topic_filename not in index_content.lower():
            # Add to the index (assumes index has a list of topics)
            # This is a simple append; you might want smarter logic
            print(f"📝 Consider updating {index_path} to include the new topic")


def main():
    parser = argparse.ArgumentParser(
        description="Add topics to the Matter File System",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --list-sections
  %(prog)s --template > new-topic.md
  %(prog)s --section stock-arguments --topic "Carbon Taxes"
  %(prog)s --section 01-stock-arguments --topic sanctions --content-file research.md
        """
    )
    
    parser.add_argument("--list-sections", "-l", action="store_true",
                        help="List all available sections")
    parser.add_argument("--template", "-t", action="store_true",
                        help="Print the topic template")
    parser.add_argument("--section", "-s", type=str,
                        help="Section to add topic to")
    parser.add_argument("--topic", type=str,
                        help="Name of the new topic")
    parser.add_argument("--content", "-c", type=str,
                        help="Content for the topic (markdown string)")
    parser.add_argument("--content-file", "-f", type=str,
                        help="File containing content for the topic")
    
    args = parser.parse_args()
    
    if args.list_sections:
        list_sections()
    elif args.template:
        print(get_template())
    elif args.section and args.topic:
        add_topic(args.section, args.topic, args.content, args.content_file)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
