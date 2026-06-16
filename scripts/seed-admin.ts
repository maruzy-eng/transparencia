import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }

  return value;
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const password = requireEnv("ADMIN_INITIAL_PASSWORD");

  const email = (process.env.ADMIN_SEED_EMAIL ?? "diego.maruzy@gmail.com")
    .trim()
    .toLowerCase();
  const name = process.env.ADMIN_SEED_NAME ?? "Diego Maruzy";

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: existing, error: lookupError } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error("Failed to lookup admin user:", lookupError.message);
    process.exit(1);
  }

  if (existing) {
    console.log(`Admin user already exists for ${email}. Skipping seed.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { error: insertError } = await supabase.from("admin_users").insert({
    name,
    email,
    password_hash: passwordHash,
    role: "admin",
    status: "active",
  });

  if (insertError) {
    console.error("Failed to create admin user:", insertError.message);
    process.exit(1);
  }

  console.log(`Admin user created successfully for ${email}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
