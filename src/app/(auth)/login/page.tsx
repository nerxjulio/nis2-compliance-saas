"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithMagicLink } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Envoi en cours…" : "Recevoir le lien de connexion"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(signInWithMagicLink, { error: null, sent: false });

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Connexion à NIS2Ready</CardTitle>
          <CardDescription>
            Entre ton email professionnel, on t&apos;envoie un lien de connexion sécurisé — pas de
            mot de passe à retenir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.error ? (
            <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          {state.sent ? (
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              Vérifie ta boîte mail : un lien de connexion vient de t&apos;être envoyé.
            </p>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input id="email" name="email" type="email" placeholder="vous@entreprise.fr" required />
              </div>
              <SubmitButton />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
