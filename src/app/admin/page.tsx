import Link from "next/link";
import { Images, Mail, Newspaper } from "lucide-react";

import { loadCollection } from "@/lib/admin/load";
import { storageLabel } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

type Tile = {
  href: string;
  label: string;
  Icon: typeof Images;
  value: string;
  detail: string;
};

async function counts(): Promise<{ tiles: Tile[]; problems: string[] }> {
  const [images, blogs, enquiries] = await Promise.all([
    loadCollection("images"),
    loadCollection("blogs"),
    loadCollection("enquiries"),
  ]);

  // A broken file shows as a message and a zero, not as a crashed dashboard.
  const problems = [images, blogs, enquiries]
    .filter((result) => !result.ok)
    .map((result) => (result.ok ? "" : result.message));

  const blogRows = blogs.ok ? blogs.rows : [];
  const enquiryRows = enquiries.ok ? enquiries.rows : [];
  const published = blogRows.filter((blog) => blog.status === "published").length;
  const unread = enquiryRows.filter((enquiry) => enquiry.status === "unread").length;

  return {
    problems,
    tiles: [
      {
        href: "/admin/images",
        label: "Images",
        Icon: Images,
        value: String(images.ok ? images.rows.length : 0),
        detail: "in data/images.json",
      },
      {
        href: "/admin/blogs",
        label: "Blog posts",
        Icon: Newspaper,
        value: String(blogRows.length),
        detail: `${published} published, ${blogRows.length - published} draft`,
      },
      {
        href: "/admin/enquiries",
        label: "Enquiries",
        Icon: Mail,
        value: String(enquiryRows.length),
        detail: unread ? `${unread} unread` : "all read",
      },
    ],
  };
}

export default async function AdminDashboard() {
  const { tiles, problems } = await counts();
  const where = storageLabel();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Everything here is read from and written to JSON files in the project&rsquo;s /data directory. There
          is no database.
        </p>
      </div>

      {problems.length ? (
        <ul className="space-y-2">
          {problems.map((problem) => (
            <li
              key={problem}
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
            >
              {problem}
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="grid gap-4 sm:grid-cols-3">
        {tiles.map(({ href, label, Icon, value, detail }) => (
          <li key={href}>
            <Link
              href={href}
              className="hover:border-navy block rounded-lg border border-slate-200 bg-white p-5 transition hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
                <Icon size={15} aria-hidden="true" />
                {label}
              </span>
              <span className="mt-3 block text-3xl font-semibold">{value}</span>
              <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{detail}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="rounded-lg border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-semibold">Where things are stored</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          This panel is reading and writing <strong>{where}</strong>.
        </p>
        <ul className="mt-3 space-y-1.5 text-slate-600 dark:text-slate-300">
          <li>
            <code className="font-mono text-xs">images.json</code> — gallery metadata. Uploaded files are
            served from <code className="font-mono text-xs">/media</code>.
          </li>
          <li>
            <code className="font-mono text-xs">blogs.json</code> — posts written in this panel. The public
            journal is still built from the MDX in{" "}
            <code className="font-mono text-xs">brand-kit/content/journal</code>, so a post created here does
            not yet appear on the website.
          </li>
          <li>
            <code className="font-mono text-xs">enquiries.json</code> — a copy of each website enquiry,
            written when the form is submitted. Email remains the primary delivery.
          </li>
        </ul>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          On Vercel these live in a private Blob store and survive a deploy. In a local checkout they are real
          files in <code className="font-mono text-[11px]">data/</code> and{" "}
          <code className="font-mono text-[11px]">public/uploads</code>, which you can read, diff and commit.
        </p>
      </div>
    </div>
  );
}
