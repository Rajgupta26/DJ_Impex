import { fail, handleError, ok } from "@/lib/admin/api";
import { revalidateSlots } from "@/lib/admin/revalidate";
import { slotPatchSchema, type AdminSlot } from "@/lib/admin/schemas";
import { deleteUpload, mutate, nowIso } from "@/lib/admin/store";
import { IMAGE_SLOTS } from "@/lib/slots";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

/** Update text metadata for a slot. */
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const slot = IMAGE_SLOTS.find((entry) => entry.id === id);
    if (!slot) return fail("That slot does not exist.", 404);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON payload.", 400);
    }

    const parsed = slotPatchSchema.safeParse(body);
    if (!parsed.success) {
      return fail(parsed.error.issues[0]?.message || "Validation error.", 422);
    }

    const patch = parsed.data;

    const saved = await mutate("slots", (rows) => {
      const existing = rows.find((entry) => entry.id === id);
      const row: AdminSlot = {
        id: slot.id,
        src: existing?.src ?? slot.defaultSrc,
        alt: patch.alt !== undefined ? patch.alt : (existing?.alt ?? slot.defaultAlt),
        title: patch.title !== undefined ? patch.title : (existing?.title ?? slot.defaultTitle),
        description: patch.description !== undefined ? patch.description : (existing?.description ?? slot.defaultDescription),
        weave: patch.weave !== undefined ? patch.weave : (existing?.weave ?? slot.defaultWeave),
        fileName: existing?.fileName ?? null,
        updatedAt: nowIso(),
      };

      return {
        rows: [row, ...rows.filter((entry) => entry.id !== id)],
        result: row,
      };
    });

    revalidateSlots();

    return ok({
      slot: {
        ...slot,
        src: saved.src,
        alt: saved.alt,
        title: saved.title || slot.defaultTitle || slot.label,
        description: saved.description || slot.defaultDescription || "",
        weave: saved.weave || slot.defaultWeave || "",
        replaced: true,
      },
    });
  } catch (error) {
    return handleError("slots:patch", error);
  }
}

/** Revert a slot to the media the design shipped with. */
export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const slot = IMAGE_SLOTS.find((entry) => entry.id === id);
    if (!slot) return fail("That media slot does not exist.", 404);

    const removed = await mutate("slots", (rows) => {
      const match = rows.find((entry) => entry.id === id);
      if (!match) return { rows, result: null };
      return { rows: rows.filter((entry) => entry.id !== id), result: match };
    });

    if (!removed) return fail("That slot is already showing its original media.", 404);

    if (removed.fileName) {
      await deleteUpload(removed.fileName);
    }
    revalidateSlots();
    return ok({
      slot: {
        ...slot,
        src: slot.defaultSrc,
        alt: slot.defaultAlt,
        title: slot.defaultTitle || slot.label,
        description: slot.defaultDescription || "",
        weave: slot.defaultWeave || "",
        replaced: false,
      },
    });
  } catch (error) {
    return handleError("slots:revert", error);
  }
}
