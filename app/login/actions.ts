"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function loginSuperAdmin(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  if (!username || !password) {
    redirect("/login?error=missing");
  }

  const { data: adminUser, error: lookupError } = await supabaseAdmin
    .from("admin_users")
    .select("email, role")
    .eq("username", username)
    .eq("role", "superadmin")
    .single();

  if (lookupError || !adminUser) {
    redirect("/login?error=invalid");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: adminUser.email,
    password,
  });

  if (error) {
    redirect("/login?error=invalid");
  }

  redirect("/admin/products/new");
}

export async function logoutSuperAdmin() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}