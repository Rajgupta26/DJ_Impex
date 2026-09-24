import { fail, handleError, ok, parseBody } from "@/lib/admin/api";
import { blogInputSchema, type AdminBlog } from "@/lib/admin/schemas";
import { revalidateJournal } from "@/lib/admin/revalidate";
import { mutate, newId, nowIso, readCollection } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const status = new URL(request.url).searchParams.get("status");
    const blogs = await readCollection("blogs");
    const filtered =
      status === "draft" || status === "published" ? blogs.filter((blog) => blog.status === status) : blogs;
    return ok({ blogs: filtered });
  } catch (error) {
    return handleError("blogs:list", error);
  }
}

export async function POST(request: Request) {
  try {
    const parsed = await parseBody(request, blogInputSchema);
    if (parsed.response) return parsed.response;

    // The slug is the public identity of a post, so it is checked inside the
    // lock: two people creating the same slug at once would otherwise both pass.
    const created = await mutate("blogs", (rows) => {
      if (rows.some((row) => row.slug === parsed.data.slug)) {
        return { rows, result: null };
      }
      const blog: AdminBlog = { ...parsed.data, id: newId(), updatedAt: nowIso() };
      return { rows: [blog, ...rows], result: blog };
    });

    if (!created) {
      return fail("A post with that slug already exists.", 409, {
        slug: "This slug is already in use.",
      });
    }
    revalidateJournal([created.slug]);
    return ok({ blog: created }, 201);
  } catch (error) {
    return handleError("blogs:create", error);
  }
}
