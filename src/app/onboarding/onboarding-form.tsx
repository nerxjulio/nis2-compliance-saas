"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createOrganizationAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Création…" : "Créer mon organisation"}
    </Button>
  );
}

export function OnboardingForm() {
  const [state, formAction] = useActionState(createOrganizationAction, { error: null });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bienvenue sur NIS2Ready</CardTitle>
        <CardDescription>
          Quelques informations sur ton organisation pour démarrer le diagnostic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.error ? (
          <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l&apos;organisation</Label>
            <Input id="name" name="name" placeholder="Acme SAS" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Secteur d&apos;activité</Label>
            <Input id="sector" name="sector" placeholder="Énergie, santé, industrie…" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size_band">Effectif</Label>
            <Select name="size_band">
              <SelectTrigger id="size_band" className="w-full">
                <SelectValue placeholder="Sélectionne une tranche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-49">1 à 49 salariés</SelectItem>
                <SelectItem value="50-249">50 à 249 salariés</SelectItem>
                <SelectItem value="250-999">250 à 999 salariés</SelectItem>
                <SelectItem value="1000+">1000 salariés et plus</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
