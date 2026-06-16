import { jwtVerify } from "jose";

export { ADMIN_SESSION_COOKIE } from "@/lib/admin/constants";

export async function verifyAdminSessionToken(
  token: string,
  secret: string,
): Promise<boolean> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
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
