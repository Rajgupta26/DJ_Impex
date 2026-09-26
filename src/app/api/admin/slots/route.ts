import { fail, handleError, ok } from "@/lib/admin/api";
import { revalidateSlots } from "@/lib/admin/revalidate";
import type { AdminSlot } from "@/lib/admin/schemas";
import { mutate, nowIso, saveUpload, UPLOAD_URL_BASE } from "@/lib/admin/store";
import { IMAGE_SLOTS, resolveSlots } from "@/lib/slots";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  // No SVG, for the same reason the gallery refuses it: served from this
  // origin, an SVG can carry script.
]);

export async function GET() {
  try {
    return ok({ slots: await resolveSlots() });
  } catch (error) {
    return handleError("slots:list", error);
  }
}

/** Put a new image into a slot. The slot must already exist in the registry. */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const id = String(form.get("id") ?? "");
    const slot = IMAGE_SLOTS.find((entry) => entry.id === id);
    if (!slot) return fail("That image slot does not exist.", 404);

    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return fail("Please choose an image.", 400, { file: "An image is required." });
    }
    if (file.size > MAX_BYTES) {
      return fail(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.`, 413, {
        file: "The file is too large.",
      });
    }
    const extension = ALLOWED.get(file.type);
    if (!extension) {
      return fail("Please upload a JPEG, PNG, WebP or AVIF.", 415, {
        file: "That file type is not supported.",
      });
    }

    const alt = String(form.get("alt") ?? "").trim() || slot.defaultAlt;
    const bytes = Buffer.from(await file.arrayBuffer());
    const stem = file.name.replace(/\.[^.]*$/, "");
    const fileName = await saveUpload(`${stem}${extension}`, bytes, file.type);

    const row: AdminSlot = {
      id: slot.id,
      src: `${UPLOAD_URL_BASE}/${fileName}`,
      alt,
      fileName,
      updatedAt: nowIso(),
    };

    // One row per slot: replacing again overwrites, and the file the previous
    // replacement uploaded is removed so the store does not accumulate images
    // nothing points at.
    const previous = await mutate("slots", (rows) => {
      const existing = rows.find((entry) => entry.id === slot.id) ?? null;
      return { rows: [row, ...rows.filter((entry) => entry.id !== slot.id)], result: existing };
    });

    if (previous?.fileName) {
      const { deleteUpload } = await import("@/lib/admin/store");
      await deleteUpload(previous.fileName);
    }

    revalidateSlots();
    return ok({ slot: { ...slot, src: row.src, alt: row.alt, replaced: true } }, 201);
  } catch (error) {
    return handleError("slots:replace", error);
  }
}
