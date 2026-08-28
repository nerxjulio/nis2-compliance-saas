import { getResend, EMAIL_FROM } from "./resend";

type FollowupParams = {
  to: string;
  orgName: string;
  nis2Classification: "essentielle" | "importante" | "hors_champ";
  doraConcerned: boolean;
  dashboardUrl: string;
};

const NIS2_LABEL: Record<string, string> = {
  essentielle: "Entité essentielle",
  importante: "Entité importante",
  hors_champ: "Hors champ NIS2",
};

function buildHtml(p: FollowupParams): string {
  const nis2Line =
    p.nis2Classification === "hors_champ"
      ? "D'après tes réponses, NIS2 ne s'applique pas à ton organisation."
      : `D'après tes réponses, ${p.orgName} est classée « ${NIS2_LABEL[p.nis2Classification]} » au sens de la directive NIS2.`;

  const doraLine = p.doraConcerned
    ? "Tu es aussi concerné par DORA en tant qu'entité financière régulée."
    : "";

  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
      <h1 style="font-size: 20px;">Ton résultat NIS2Ready</h1>
      <p>${nis2Line}</p>
      ${doraLine ? `<p>${doraLine}</p>` : ""}
      <p>La prochaine étape : une checklist priorisée et des documents de conformité générés automatiquement à partir de ce résultat.</p>
      <p style="margin-top: 24px;">
        <a href="${p.dashboardUrl}" style="background: #111827; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
          Voir mon tableau de bord
        </a>
      </p>
      <p style="margin-top: 32px; font-size: 12px; color: #6b7280;">
        NIS2Ready — ce résultat est une orientation, pas un avis juridique certifié.
      </p>
    </div>
  `;
}

export async function sendDiagnosticFollowupEmail(params: FollowupParams): Promise<void> {
  try {
    await getResend().emails.send({
      from: EMAIL_FROM,
      to: params.to,
      subject: "Ton résultat de diagnostic NIS2",
      html: buildHtml(params),
    });
  } catch (err) {
    // Ne bloque jamais le diagnostic si l'email échoue (config manquante, domaine non
    // vérifié...) — l'utilisateur voit son résultat dans l'app dans tous les cas.
    console.error("[sendDiagnosticFollowupEmail] failed:", err);
  }
}
