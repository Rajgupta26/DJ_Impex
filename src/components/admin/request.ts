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
      return {
        ok: false,
        error: body?.error ?? `The server returned ${response.status}.`,
        fieldErrors: body?.fieldErrors,
      };
    }
    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, error: "Could not reach the server. Check your connection." };
  }
}
