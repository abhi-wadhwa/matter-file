const fs = require("fs");
const path = require("path");

const SECTIONS_DIR = path.join(__dirname, "sections");
const OUTPUT_FILE = path.join(__dirname, "site", "data.json");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) meta[key.trim()] = rest.join(":").trim();
  });
  return { meta, body: match[2] };
}

function buildData() {
  const sections = [];
  const dirs = fs
    .readdirSync(SECTIONS_DIR)
    .filter((d) => !d.startsWith(".") && fs.statSync(path.join(SECTIONS_DIR, d)).isDirectory())
    .sort();

  for (const dir of dirs) {
    const dirPath = path.join(SECTIONS_DIR, dir);
    const indexPath = path.join(dirPath, "_index.md");
    let sectionTitle = dir.replace(/^\d+-/, "").replace(/-/g, " ");
    sectionTitle = sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1);

    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      const titleMatch = indexContent.match(/^#\s+(.+)/m);
      if (titleMatch) sectionTitle = titleMatch[1];
    }

    const topics = [];
    const files = fs
      .readdirSync(dirPath)
      .filter((f) => f.endsWith(".md") && f !== "_index.md" && f !== "placeholder.md")
      .sort();

    for (const file of files) {
      const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
      const { body } = parseFrontmatter(content);
      const titleMatch = body.match(/^#{1,3}\s+(.+)/m);
      const topicTitle = titleMatch ? titleMatch[1] : file.replace(".md", "").replace(/-/g, " ");
      topics.push({
        id: `${dir}--${file.replace(".md", "")}`,
        title: topicTitle,
        file: file,
        content: body,
      });
    }

    sections.push({
      id: dir,
      title: sectionTitle,
      topics,
    });
  }

  // Also include the full MATTER_FILE.md
  const matterPath = path.join(__dirname, "MATTER_FILE.md");
  let matterContent = "";
  if (fs.existsSync(matterPath)) {
    const raw = fs.readFileSync(matterPath, "utf-8");
    const { body } = parseFrontmatter(raw);
    matterContent = body;
  }

  return { sections, matterFile: matterContent, buildTime: new Date().toISOString() };
}

fs.mkdirSync(path.join(__dirname, "site"), { recursive: true });
const data = buildData();
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
console.log(
  `Built data.json: ${data.sections.length} sections, ${data.sections.reduce((s, sec) => s + sec.topics.length, 0)} topics`
);
