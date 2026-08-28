import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getResend, EMAIL_FROM } from "./resend";

type FollowupParams = {
  to: string;
  locale: Locale;
  orgName: string;
  nis2Classification: "essentielle" | "importante" | "hors_champ";
  doraConcerned: boolean;
  dashboardUrl: string;
};

async function buildHtml(p: FollowupParams): Promise<{ subject: string; html: string }> {
  const t = await getTranslations({ locale: p.locale, namespace: "email.diagnosticFollowup" });
  const tClassification = await getTranslations({
    locale: p.locale,
    namespace: "dashboard.classification",
  });

  const nis2Line =
    p.nis2Classification === "hors_champ"
      ? t("nis2OutOfScope")
      : t("nis2InScope", {
          orgName: p.orgName,
          classification: tClassification(p.nis2Classification),
        });

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h1 style="font-size: 20px;">${t("heading")}</h1>
      <p>${nis2Line}</p>
      ${p.doraConcerned ? `<p>${t("doraLine")}</p>` : ""}
      <p>${t("nextSteps")}</p>
      <p style="margin-top: 24px;">
        <a href="${p.dashboardUrl}" style="background: #111827; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
          ${t("button")}
        </a>
      </p>
      <p style="margin-top: 32px; font-size: 12px; color: #6b7280;">
        ${t("footer")}
      </p>
    </div>
  `;

  return { subject: t("subject"), html };
}

export async function sendDiagnosticFollowupEmail(params: FollowupParams): Promise<void> {
  try {
    const { subject, html } = await buildHtml(params);
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject,
      html,
    });
  } catch (err) {
    // Ne bloque jamais le diagnostic si l'email échoue (config manquante, domaine non
    // vérifié...) — l'utilisateur voit son résultat dans l'app dans tous les cas.
    console.error("[sendDiagnosticFollowupEmail] failed:", err);
  }
}
