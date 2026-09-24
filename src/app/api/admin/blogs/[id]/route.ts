import { fail, handleError, ok, parseBody } from "@/lib/admin/api";
import { blogPatchSchema, type AdminBlog } from "@/lib/admin/schemas";
import { mutate, nowIso, readCollection } from "@/lib/admin/store";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const blog = (await readCollection("blogs")).find((row) => row.id === id);
    if (!blog) return fail("That post is no longer in blogs.json.", 404);
    return ok({ blog });
  } catch (error) {
    return handleError("blogs:read", error);
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const parsed = await parseBody(request, blogPatchSchema);
    if (parsed.response) return parsed.response;

    // Spelled out because the callback has three exits and inference would
    // otherwise settle on whichever branch it read first.
    type Outcome = { kind: "missing" } | { kind: "duplicate" } | { kind: "ok"; blog: AdminBlog };

    const outcome = await mutate<"blogs", Outcome>("blogs", (rows) => {
      const index = rows.findIndex((row) => row.id === id);
      if (index === -1) return { rows, result: { kind: "missing" } };
      const slug = parsed.data.slug;
      if (slug && rows.some((row) => row.slug === slug && row.id !== id)) {
        return { rows, result: { kind: "duplicate" } };
      }
      const next = [...rows];
      next[index] = { ...next[index], ...parsed.data, updatedAt: nowIso() };
      return { rows: next, result: { kind: "ok", blog: next[index] } };
    });

    if (outcome.kind === "missing") return fail("That post is no longer in blogs.json.", 404);
    if (outcome.kind === "duplicate") {
      return fail("Another post already uses that slug.", 409, {
        slug: "This slug is already in use.",
      });
    }
    return ok({ blog: outcome.blog });
  } catch (error) {
    return handleError("blogs:update", error);
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const removed = await mutate("blogs", (rows) => {
      const match = rows.find((row) => row.id === id);
      if (!match) return { rows, result: null };
      return { rows: rows.filter((row) => row.id !== id), result: match };
    });
    if (!removed) return fail("That post is no longer in blogs.json.", 404);
    return ok({ id });
  } catch (error) {
    return handleError("blogs:delete", error);
  }
}
