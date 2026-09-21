/**
 * A very small parser for the structured briefs in brand-kit/content/*.md.
 *
 * Those files mix three things: client copy (plain paragraphs), labelled values
 * (`**H1:** ...` or `Heading: ...`) and build notes (lines in parentheses, or
 * starting with "Note:"). Components read the first two and ignore the third,
 * so editing a content file changes the site without touching any component.
 */

export type Section = {
  /** Slugified heading, e.g. "our-story". The intro before the first H2 is "". */
  id: string;
  /** Heading text as written, without the leading hashes. */
  heading: string;
  level: 1 | 2 | 3;
  /** Prose paragraphs, with build notes removed. */
  paragraphs: string[];
  /** `**Label:** value` and `Label: value` pairs, keyed by slugified label. */
  fields: Record<string, string>;
  /** List items, ordered or unordered, with any `**Lead-in.**` split out. */
  items: ListItem[];
};

export type ListItem = {
  /** The bold lead-in, if the item starts with one: `**Inspiring Admiration.** ...` */
  lead?: string;
  text: string;
};

export type ParsedDoc = {
  title: string;
  sections: Section[];
};

/** Labels that appear without bold markers in the briefs. */
const PLAIN_LABELS = new Set([
  "heading",
  "intro",
  "link",
  "body",
  "buttons",
  "image",
  "images",
  "data",
  "headline",
  "sub",
  "big-number",
  "sign-off",
  "primary-cta",
]);

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/®|™/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Strip the inline markdown we allow in the briefs. */
export function plain(input: string): string {
  return input
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1")
    .trim();
}

function isBuildNote(line: string): boolean {
  if (/^\([\s\S]*\)$/.test(line)) return true;
  return /^(note|notes)\b[:.]/i.test(line);
}

/** Split `Label: value`, tolerating `**Label (client):** value`. */
function readField(line: string): { key: string; value: string } | null {
  const bold = /^\*\*(.+?):?\*\*:?\s*(.*)$/.exec(line);
  if (bold) {
    return { key: slugify(bold[1].replace(/\s*\(.*?\)\s*/g, " ")), value: plain(bold[2]) };
  }
  const plainMatch = /^([A-Za-z][A-Za-z0-9 '&/-]{0,32}?)(\s*\(.*?\))?:\s+(.+)$/.exec(line);
  if (plainMatch) {
    const key = slugify(plainMatch[1]);
    if (PLAIN_LABELS.has(key)) return { key, value: plain(plainMatch[3]) };
  }
  return null;
}

function readListItem(line: string): ListItem | null {
  const match = /^(?:[-*]|\d+\.)\s+(.*)$/.exec(line);
  if (!match) return null;
  const body = match[1];
  const lead = /^\*\*(.+?)\.?\*\*\s*(.*)$/.exec(body);
  if (lead) return { lead: lead[1].replace(/\.$/, ""), text: plain(lead[2]) };
  return { text: plain(body) };
}

export function parseDoc(markdown: string): ParsedDoc {
  const lines = markdown.split("\n");
  let title = "";
  const sections: Section[] = [];
  let current: Section = { id: "", heading: "", level: 2, paragraphs: [], fields: {}, items: [] };
  let buffer: string[] = [];

  const flushParagraph = () => {
    if (buffer.length === 0) return;
    const text = buffer.join(" ").trim();
    buffer = [];
    if (!text || isBuildNote(text)) return;
    const field = readField(text);
    if (field) {
      current.fields[field.key] = field.value;
      return;
    }
    current.paragraphs.push(plain(text));
  };

  const flushSection = () => {
    flushParagraph();
    if (current.heading || current.paragraphs.length || Object.keys(current.fields).length || current.items.length) {
      sections.push(current);
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    const heading = /^(#{1,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushSection();
      const level = heading[1].length as 1 | 2 | 3;
      const text = plain(heading[2]);
      if (level === 1 && !title) title = text;
      current = { id: slugify(text), heading: text, level, paragraphs: [], fields: {}, items: [] };
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    const item = readListItem(line.trim());
    if (item) {
      flushParagraph();
      if (!isBuildNote(item.text)) current.items.push(item);
      continue;
    }

    buffer.push(line.trim());
  }

  flushSection();
  return { title, sections };
}

/** Find a section by its slugified heading. Throws so content drift fails the build. */
export function section(doc: ParsedDoc, id: string): Section {
  const found = doc.sections.find((s) => s.id === id);
  if (!found) {
    throw new Error(
      `Content section "${id}" not found. Available: ${doc.sections.map((s) => s.id).join(", ")}`,
    );
  }
  return found;
}

/** Read a labelled value from a section. Throws when the label is gone. */
export function field(from: Section, key: string): string {
  const value = from.fields[key];
  if (value === undefined) {
    throw new Error(
      `Content field "${key}" not found in section "${from.id || "intro"}". Available: ${Object.keys(from.fields).join(", ")}`,
    );
  }
  return value;
}
