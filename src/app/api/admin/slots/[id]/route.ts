import { fail, handleError, ok } from "@/lib/admin/api";
import { revalidateSlots } from "@/lib/admin/revalidate";
import { deleteUpload, mutate } from "@/lib/admin/store";
import { IMAGE_SLOTS } from "@/lib/slots";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

/** Revert a slot to the image the design shipped with. */
export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const slot = IMAGE_SLOTS.find((entry) => entry.id === id);
    if (!slot) return fail("That image slot does not exist.", 404);

    const removed = await mutate("slots", (rows) => {
      const match = rows.find((entry) => entry.id === id);
      if (!match) return { rows, result: null };
      return { rows: rows.filter((entry) => entry.id !== id), result: match };
    });

    if (!removed) return fail("That slot is already showing its original image.", 404);

    await deleteUpload(removed.fileName);
    revalidateSlots();
    return ok({ slot: { ...slot, src: slot.defaultSrc, alt: slot.defaultAlt, replaced: false } });
  } catch (error) {
    return handleError("slots:revert", error);
  }
}
