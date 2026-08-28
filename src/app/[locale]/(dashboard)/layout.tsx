import { getTranslations, getLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/[locale]/(auth)/actions";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const locale = await getLocale();
  const t = await getTranslations("nav");

  const NAV_LINKS = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/diagnostic", label: t("diagnostic") },
    { href: "/checklist", label: t("checklist") },
    { href: "/documents", label: t("documents") },
    { href: "/billing", label: t("billing") },
  ] as const;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, organizations(name)")
    .eq("user_id", user!.id)
    .limit(1)
    .maybeSingle();

  if (!membership) {
    redirect({ href: "/onboarding", locale });
  }

  const orgName = (membership!.organizations as unknown as { name: string } | null)?.name;

  return (
    <div className="min-h-svh bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-semibold">NIS2Ready</p>
              <p className="text-xs text-muted-foreground">{orgName}</p>
            </div>
            <nav className="flex items-center gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                {t("logout")}
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
