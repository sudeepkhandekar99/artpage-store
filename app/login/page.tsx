import { loginSuperAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Login",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="soft-card border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
                Ranin Art
              </p>

              <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-[#241521]">
                Welcome back
              </h1>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Sign in to manage products, images, pricing, and store data.
              </p>
            </div>

            {params.error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                Invalid username or password.
              </div>
            )}

            <form action={loginSuperAdmin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-bold">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  required
                  placeholder="admin"
                  className="h-12 rounded-xl border-[#ead7e2] bg-white font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className="h-12 rounded-xl border-[#ead7e2] bg-white font-semibold shadow-sm"
                />
              </div>

              <Button
                type="submit"
                className="soft-button h-12 w-full rounded-xl bg-[#F9B2D7] text-base font-extrabold text-[#241521] hover:bg-[#f6a5cd]"
              >
                Login
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Superadmin access only
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}