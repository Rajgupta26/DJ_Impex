import "server-only";

import type { Testimonial } from "@/lib/site";

type GoogleReview = {
  authorAttribution?: {
    displayName?: string;
    uri?: string;
  };
  googleMapsUri?: string;
  rating?: number;
  text?: { text?: string };
};

type PlaceDetailsResponse = {
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

export type GoogleReviewTestimonial = Testimonial & {
  authorHref?: string;
  sourceHref?: string;
  rating?: number;
};

const FIELD_MASK = "googleMapsUri,reviews";

/** Env values arrive with stray quotes and whitespace often enough to be worth stripping. */
function clean(value: string | undefined): string {
  return (value ?? "").replace(/^["']|["']$/g, "").trim();
}

/**
 * The place id on its own, however it was pasted in.
 *
 * Google's Place ID finder shows the id followed by the formatted address, and
 * the whole line had been pasted into GOOGLE_PLACE_ID: "ChIJ... Gopal Gully,
 * Mangaldas Mkt, ... Mumbai ... India". Every home page request then failed
 * with `INVALID_ARGUMENT`, silently, on a billed API. A place id contains no
 * whitespace, so taking the first token recovers it and makes the same paste
 * harmless in future.
 */
function placeIdFrom(value: string | undefined): string {
  return clean(value).split(/\s+/)[0] ?? "";
}

/**
 * Gets live Google reviews on the server. Google review content must not be
 * stored, so this intentionally bypasses Next's data cache.
 */
export async function getPositiveGoogleReviews(): Promise<GoogleReviewTestimonial[] | null> {
  const apiKey = clean(process.env.GOOGLE_MAPS_API_KEY);
  const placeId = placeIdFrom(process.env.GOOGLE_PLACE_ID);

  if (!apiKey || !placeId) return null;

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      // The status alone is unactionable: a 400 from Places means a malformed
      // place id, a rejected field mask or a key restriction, and they are not
      // distinguishable without the body. This was failing on every home page
      // request with nothing in the log but "400".
      const detail = await response.text().catch(() => "");
      console.error(
        "[google-reviews] Google Places request failed: %s %s",
        response.status,
        detail.slice(0, 400),
      );
      return null;
    }

    const place = (await response.json()) as PlaceDetailsResponse;
    const reviews = (place.reviews ?? [])
      .filter(
        (review): review is GoogleReview & { rating: number; text: { text: string } } =>
          typeof review.rating === "number" && review.rating >= 4 && Boolean(review.text?.text?.trim()),
      )
      .map((review) => ({
        quote: review.text.text.trim(),
        name: review.authorAttribution?.displayName ?? null,
        role: "",
        status: "confirmed" as const,
        rating: review.rating,
        authorHref: review.authorAttribution?.uri,
        sourceHref: review.googleMapsUri ?? place.googleMapsUri,
      }));

    // Google provides up to five relevant reviews. Randomizing the eligible
    // entries gives the slider variety without persisting Google content.
    for (let index = reviews.length - 1; index > 0; index -= 1) {
      const replacement = Math.floor(Math.random() * (index + 1));
      [reviews[index], reviews[replacement]] = [reviews[replacement], reviews[index]];
    }

    return reviews;
  } catch (error) {
    console.error("[google-reviews] Unable to retrieve Google reviews:", error);
    return null;
  }
}
