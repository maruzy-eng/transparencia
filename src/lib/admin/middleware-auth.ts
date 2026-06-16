import { jwtVerify } from "jose";

import {
  ADMIN_SESSION_COOKIE,
  JWT_CLOCK_TOLERANCE,
} from "@/lib/admin/cookie-options";

export { ADMIN_SESSION_COOKIE };

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      clockTolerance: JWT_CLOCK_TOLERANCE,
    });

    return (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "admin" || payload.role === "editor")
    );
  } catch {
    return false;
  }
}
