import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function requireSuperAdmin() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("auth_user_id", user.id)
    .eq("role", "superadmin")
    .single();

  if (adminError || !adminUser) {
    redirect("/login");
  }

  return {
    user,
    adminUser,
  };
}