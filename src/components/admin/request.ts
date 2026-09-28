/** One shape for every call the panel makes, so no screen forgets an error path. */
export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function request<T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<ApiResult<T>> {
  const { json, ...rest } = init ?? {};
  try {
    const response = await fetch(url, {
      ...rest,
      headers:
        json === undefined ? rest.headers : { "content-type": "application/json", ...(rest.headers ?? {}) },
      body: json === undefined ? rest.body : JSON.stringify(json),
    });

    // An error page or a proxy timeout is not JSON, so never assume it parses.
    const text = await response.text();
    let payload: unknown = null;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const body = payload as { error?: string; fieldErrors?: Record<string, string> } | null;
      // A 413 usually comes from the host rather than the route, as plain
      // text, so there is no message to show. Say what actually happened.
      const fallback =
        response.status === 413
          ? "That file is too large to upload. Please use an image under 4MB."
          : `The server returned ${response.status}.`;

      return {
        ok: false,
        error: body?.error ?? fallback,
        fieldErrors: body?.fieldErrors,
      };
    }
    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }
}
