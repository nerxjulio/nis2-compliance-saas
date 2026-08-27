"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitDiagnosticAction } from "./actions";
import { SECTORS } from "@/lib/diagnostic/sectors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ANNEXE1 = SECTORS.filter((s) => s.tier === "annexe1");
const ANNEXE2 = SECTORS.filter((s) => s.tier === "annexe2");
const AUTRE = SECTORS.filter((s) => s.tier === "hors_champ");

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Calcul en cours…" : "Voir mon résultat"}
    </Button>
  );
}

export function DiagnosticForm() {
  const [state, formAction] = useActionState(submitDiagnosticAction, { error: null });

  return (
    <form action={formAction} className="space-y-6">
      {state.error ? (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Ton secteur d&apos;activité</CardTitle>
          <CardDescription>
            NIS2 s&apos;applique selon une liste précise de secteurs (annexes I et II de la
            directive).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select name="sector" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionne ton secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Annexe I — secteurs hautement critiques</SelectLabel>
                {ANNEXE1.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Annexe II — autres secteurs critiques</SelectLabel>
                {ANNEXE2.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                {AUTRE.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taille de ton organisation</CardTitle>
          <CardDescription>
            Le seuil d&apos;application de NIS2 dépend de l&apos;effectif et des chiffres
            financiers — donne les valeurs les plus récentes dont tu disposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="employees">Nombre de salariés</Label>
            <Input id="employees" name="employees" type="number" min={0} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="annual_turnover">Chiffre d&apos;affaires annuel (€)</Label>
            <Input id="annual_turnover" name="annual_turnover" type="number" min={0} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance_sheet">Total de bilan annuel (€)</Label>
            <Input id="balance_sheet" name="balance_sheet" type="number" min={0} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Opérations dans l&apos;UE</CardTitle>
          <CardDescription>
            NIS2 s&apos;applique aux entités établies dans l&apos;UE ou qui y fournissent des
            services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup name="eu_operations" defaultValue="oui" required className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="oui" /> Oui
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="non" /> Non
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Critères particuliers</CardTitle>
          <CardDescription>Coche ce qui s&apos;applique à ton organisation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="sole_provider" className="mt-0.5" />
            Tu es le seul fournisseur de ce service dans ton pays.
          </label>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="critical_public_impact" className="mt-0.5" />
            Une interruption de ton activité aurait un impact significatif sur la sécurité,
            la sûreté ou la santé publique.
          </label>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="is_financial_entity" className="mt-0.5" />
            Tu es une entité financière régulée (banque, assurance, paiement, gestion
            d&apos;actifs, crypto-actifs…) — pertinent pour DORA.
          </label>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
