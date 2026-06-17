import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin/constants";

export { ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };

export const JWT_CLOCK_TOLERANCE = "60s";

export function isSecureSessionCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isSecureSessionCookie(),
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  };
}

export function getClearSessionCookieOptions() {
  return {
    ...getSessionCookieOptions(),
    maxAge: 0,
  };
}
