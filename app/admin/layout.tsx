import AdminShell from "./AdminShell";
import { requireSuperAdmin } from "@/lib/auth/requireSuperAdmin";
import { logoutSuperAdmin } from "@/app/login/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { adminUser } = await requireSuperAdmin();

  return (
    <AdminShell username={adminUser.username} logoutAction={logoutSuperAdmin}>
      {children}
    </AdminShell>
  );
}