import { fail, handleError, ok } from "@/lib/admin/api";
import { revalidateGallery } from "@/lib/admin/revalidate";
import { imageSchema, type AdminImage } from "@/lib/admin/schemas";
import {
  deleteUpload,
  mutate,
  newId,
  nowIso,
  readCollection,
  saveUpload,
  UPLOAD_URL_BASE,
} from "@/lib/admin/store";

export const dynamic = "force-dynamic";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
  ["image/gif", ".gif"],
  // No SVG. It is served from the site's own origin, and an SVG can carry
  // script, so an upload would be a stored cross-site scripting hole. It also
  // cannot pass through next/image without dangerouslyAllowSVG.
]);

export async function GET() {
  try {
    const images = await readCollection("images");
    return ok({ images });
  } catch (error) {
    return handleError("images:list", error);
  }
}

/** Multipart upload: the file lands in public/uploads, the row in images.json. */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return fail("Please choose an image to upload.", 400, { file: "An image is required." });
    }
    if (file.size > MAX_BYTES) {
      return fail(`That file is ${(file.size / 1024 / 1024).toFixed(1)}MB. The limit is 8MB.`, 413, {
        file: "The file is too large.",
      });
    }
    // The browser-declared type is a hint, not proof, so the extension we write
    // comes from this list rather than from the name the client supplied.
    const extension = ALLOWED.get(file.type);
    if (!extension) {
      return fail("Please upload a JPEG, PNG, WebP, AVIF or GIF.", 415, {
        file: "That file type is not supported.",
      });
    }

    const title = String(form.get("title") ?? "").trim() || file.name;
    const candidate = {
      id: newId(),
      src: "",
      title,
      alt: String(form.get("alt") ?? "").trim(),
      category: String(form.get("category") ?? "").trim(),
      caption: String(form.get("caption") ?? "").trim(),
      fileName: null,
      sizeBytes: file.size,
      uploadedAt: nowIso(),
    };

    // Validate the metadata before anything touches the disk, so a missing alt
    // text does not leave an orphan file behind.
    const checked = imageSchema.safeParse({ ...candidate, src: "/pending" });
    if (!checked.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of checked.error.issues) {
        fieldErrors[String(issue.path[0] ?? "form")] ??= issue.message;
      }
      return fail("Please check the highlighted fields.", 400, fieldErrors);
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const stem = file.name.replace(/\.[^.]*$/, "");
    const fileName = await saveUpload(`${stem}${extension}`, bytes, file.type);

    const image: AdminImage = {
      ...candidate,
      fileName,
      src: `${UPLOAD_URL_BASE}/${fileName}`,
    };

    try {
      await mutate("images", (rows) => ({ rows: [image, ...rows], result: null }));
    } catch (error) {
      // The bytes are already stored. If the row cannot be written the upload
      // has not happened as far as anyone can see, so take the file back out
      // rather than leave it paying for storage with nothing pointing at it.
      await deleteUpload(fileName);
      throw error;
    }
    revalidateGallery();
    return ok({ image }, 201);
  } catch (error) {
    return handleError("images:upload", error);
  }
}
