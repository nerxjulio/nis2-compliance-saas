import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRICING = [
  {
    name: "Free",
    price: "0€",
    period: "",
    description: "Diagnostic complet, pour savoir où tu en es.",
    features: ["Diagnostic NIS2 & DORA", "Résultat immédiat", "Email de suivi"],
    cta: "Faire le diagnostic",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "149€",
    period: "/mois",
    description: "Pour démarrer ta mise en conformité.",
    features: [
      "1 organisation",
      "Checklist priorisée",
      "5 documents clés générés",
      "Export PDF",
      "1 utilisateur",
    ],
    cta: "Commencer",
    href: "/login",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "299€",
    period: "/mois",
    description: "Pour piloter la conformité à plusieurs.",
    features: [
      "Multi-utilisateurs",
      "Documents illimités",
      "Dossier d'audit complet",
      "Historique d'avancement",
      "Support prioritaire",
    ],
    cta: "Commencer",
    href: "/login",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="font-semibold">NIS2Ready</span>
          <nav className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Tarifs
            </Link>
            <Button size="sm" render={<Link href="/login" />} nativeButton={false}>
              Se connecter
            </Button>
          </nav>
        </div>
      </header>

      <section className="border-b bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            NIS2 · DORA
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            En 10 minutes, sache si NIS2 ou DORA te concerne
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Ensuite, obtiens automatiquement ta checklist priorisée et tes documents de
            conformité — politique de sécurité, registre des risques, plan de gestion
            d&apos;incidents. Conçu pour les dirigeants et RSSI solo de PME/ETI, sans équipe
            conformité ni budget cabinet de 10-15k€.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button size="lg" render={<Link href="/login" />} nativeButton={false}>
              Faire le diagnostic gratuit
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto w-full max-w-5xl px-4 py-20">
        <h2 className="text-center text-3xl font-semibold">Tarifs simples, sans surprise</h2>
        <p className="mt-2 text-center text-muted-foreground">
          Commence gratuitement, passe à un plan payant quand tu es prêt à agir.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PRICING.map((plan) => (
            <Card key={plan.name} className={plan.highlighted ? "border-primary shadow-md" : ""}>
              <CardHeader>
                {plan.highlighted ? (
                  <Badge className="mb-2 w-fit">Le plus choisi</Badge>
                ) : null}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <p className="pt-2 text-3xl font-bold">
                  {plan.price}
                  <span className="text-base font-normal text-muted-foreground">
                    {plan.period}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  render={<Link href={plan.href} />}
                  nativeButton={false}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted-foreground">
          © {new Date().getFullYear()} NIS2Ready
        </div>
      </footer>
    </div>
  );
}
