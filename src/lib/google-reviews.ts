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
};

const FIELD_MASK = "googleMapsUri,reviews";

/**
 * Gets live Google reviews on the server. Google review content must not be
 * stored, so this intentionally bypasses Next's data cache.
 */
export async function getPositiveGoogleReviews(): Promise<GoogleReviewTestimonial[] | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

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
      console.error("[google-reviews] Google Places request failed:", response.status);
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
        role: "Google review · 4–5 stars",
        status: "confirmed" as const,
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
