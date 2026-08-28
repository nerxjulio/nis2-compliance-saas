import { getTranslations } from "next-intl/server";
import { DiagnosticForm } from "./diagnostic-form";

export default async function DiagnosticPage() {
  const t = await getTranslations("diagnostic");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>
      <DiagnosticForm />
    </div>
  );
}
