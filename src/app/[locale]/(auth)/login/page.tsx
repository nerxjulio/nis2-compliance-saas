"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { signInWithMagicLink } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("login");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t("sending") : t("submit")}
    </Button>
  );
}

export default function LoginPage() {
  const t = useTranslations("login");
  const [state, formAction] = useActionState(signInWithMagicLink, { error: null, sent: false });

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-muted/30 px-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {state.error ? (
            <p className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          ) : null}

          {state.sent ? (
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              {t("checkEmail")}
            </p>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailLabel")}</Label>
                <Input id="email" name="email" type="email" placeholder={t("placeholder")} required />
              </div>
              <SubmitButton />
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
