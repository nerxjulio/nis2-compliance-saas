"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("diagnostic");
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? t("calculating") : t("resultButton")}
    </Button>
  );
}

export function DiagnosticForm() {
  const t = useTranslations("diagnostic");
  const tSectors = useTranslations("diagnostic.sectors");
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
          <CardTitle>{t("sectorSectionTitle")}</CardTitle>
          <CardDescription>{t("sectorSectionDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select name="sector" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("sectorPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("annexe1")}</SelectLabel>
                {ANNEXE1.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {tSectors(s.value as "autre")}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t("annexe2")}</SelectLabel>
                {ANNEXE2.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {tSectors(s.value as "autre")}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                {AUTRE.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {tSectors(s.value as "autre")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("sizeSectionTitle")}</CardTitle>
          <CardDescription>{t("sizeSectionDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="employees">{t("employees")}</Label>
            <Input id="employees" name="employees" type="number" min={0} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="annual_turnover">{t("turnover")}</Label>
            <Input id="annual_turnover" name="annual_turnover" type="number" min={0} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance_sheet">{t("balanceSheet")}</Label>
            <Input id="balance_sheet" name="balance_sheet" type="number" min={0} required />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("euSectionTitle")}</CardTitle>
          <CardDescription>{t("euSectionDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup name="eu_operations" defaultValue="oui" required className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="oui" /> {t("yes")}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <RadioGroupItem value="non" /> {t("no")}
            </label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("criteriaSectionTitle")}</CardTitle>
          <CardDescription>{t("criteriaSectionDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="sole_provider" className="mt-0.5" />
            {t("soleProvider")}
          </label>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="critical_public_impact" className="mt-0.5" />
            {t("criticalImpact")}
          </label>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox name="is_financial_entity" className="mt-0.5" />
            {t("financialEntity")}
          </label>
        </CardContent>
      </Card>

      <SubmitButton />
    </form>
  );
}
