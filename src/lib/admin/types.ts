export type AdminRole = "admin" | "editor";
export type AdminStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSessionPayload {
  sub: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AdminUserRecord extends AdminUser {
  password_hash: string;
}
