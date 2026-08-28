"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
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

const SIZE_BANDS = ["1-49", "50-249", "250-999", "1000+"] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("onboarding");
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t("creating") : t("submit")}
    </Button>
  );
}

export function OnboardingForm() {
  const t = useTranslations("onboarding");
  const [state, formAction] = useActionState(createOrganizationAction, { error: null });

  return (
    <Card className="w-full max-w-md">
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

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("orgName")}</Label>
            <Input id="name" name="name" placeholder={t("orgNamePlaceholder")} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">{t("sector")}</Label>
            <Input id="sector" name="sector" placeholder={t("sectorPlaceholder")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size_band">{t("size")}</Label>
            <Select name="size_band">
              <SelectTrigger id="size_band" className="w-full">
                <SelectValue placeholder={t("sizePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {SIZE_BANDS.map((band) => (
                  <SelectItem key={band} value={band}>
                    {t(`sizeOptions.${band}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
