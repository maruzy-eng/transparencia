import "server-only";

export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto =
    forwardedProto ??
    new URL(request.url).protocol.replace(":", "") ??
    "https";

  if (host) {
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

export function buildRequestUrl(
  request: Request,
  pathname: string,
  params?: Record<string, string>,
): URL {
  const url = new URL(pathname, getRequestOrigin(request));

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  return url;
}
