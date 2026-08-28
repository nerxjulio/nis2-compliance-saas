import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  const plans = [
    { key: "free" as const, href: "/login", highlighted: false },
    { key: "starter" as const, href: "/login", highlighted: true },
    { key: "pro" as const, href: "/login", highlighted: false },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="font-semibold">NIS2Ready</span>
          <nav className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              {tNav("pricing")}
            </Link>
            <LanguageSwitcher />
            <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
              {tNav("login")}
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            {t("badge")}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("heroSubtitle")}</p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" render={<Link href="/login" />} nativeButton={false}>
              {t("ctaFree")}
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-5xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold">{t("pricingTitle")}</h2>
        <p className="mt-2 text-center text-muted-foreground">{t("pricingSubtitle")}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.key} className={plan.highlighted ? "border-primary shadow-md" : ""}>
              <CardHeader>
                {plan.highlighted ? (
                  <Badge className="mb-2 w-fit">{t("mostChosen")}</Badge>
                ) : null}
                <CardTitle>{t(`plans.${plan.key}.name`)}</CardTitle>
                <CardDescription>{t(`plans.${plan.key}.description`)}</CardDescription>
                <p className="pt-2 text-3xl font-bold">
                  {t(`plans.${plan.key}.price`)}
                  <span className="text-base font-normal text-muted-foreground">
                    {t(`plans.${plan.key}.period`)}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t.raw(`plans.${plan.key}.features`).map((f: string) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  render={<Link href={plan.href} />}
                  nativeButton={false}
                >
                  {t(`plans.${plan.key}.cta`)}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
          {t("footer", { year: new Date().getFullYear() })}
        </div>
      </footer>
    </div>
  );
}
