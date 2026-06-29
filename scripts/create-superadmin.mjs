import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || ".env.local",
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const username = process.env.SUPERADMIN_USERNAME;
const email = process.env.SUPERADMIN_EMAIL;
const password = process.env.SUPERADMIN_PASSWORD;

console.log("Checking env variables...");
console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "FOUND" : "MISSING");
console.log("SUPABASE_SERVICE_ROLE_KEY:", serviceRoleKey ? "FOUND" : "MISSING");
console.log("SUPERADMIN_USERNAME:", username ? "FOUND" : "MISSING");
console.log("SUPERADMIN_EMAIL:", email ? "FOUND" : "MISSING");
console.log("SUPERADMIN_PASSWORD:", password ? "FOUND" : "MISSING");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

if (!username || !email || !password) {
  throw new Error(
    "Missing SUPERADMIN_USERNAME, SUPERADMIN_EMAIL, or SUPERADMIN_PASSWORD."
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function main() {
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existingUser = existingUsers.users.find((user) => user.email === email);

  let authUserId;

  if (existingUser) {
    authUserId = existingUser.id;

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUserId,
      {
        password,
        email_confirm: true,
        user_metadata: {
          username,
          role: "superadmin",
        },
      }
    );

    if (updateError) {
      throw updateError;
    }
  } else {
    const { data: createdUser, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          username,
          role: "superadmin",
        },
      });

    if (createError) {
      throw createError;
    }

    authUserId = createdUser.user.id;
  }

  const { error: upsertError } = await supabase.from("admin_users").upsert(
    {
      auth_user_id: authUserId,
      username,
      email,
      role: "superadmin",
    },
    {
      onConflict: "auth_user_id",
    }
  );

  if (upsertError) {
    throw upsertError;
  }

  console.log("Superadmin ready:");
  console.log({
    username,
    email,
    authUserId,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});