"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { generateDocumentAction, getDocumentDownloadUrlAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentType } from "@/lib/pdf/generate";

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function GenerateButton({ hasExisting }: { hasExisting: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Génération…" : hasExisting ? "Régénérer" : "Générer"}
    </Button>
  );
}

export function DocumentCard({
  type,
  title,
  description,
  existing,
}: {
  type: DocumentType;
  title: string;
  description: string;
  existing: { version: number; generatedAt: string; storagePath: string } | null;
}) {
  const [state, formAction] = useActionState(generateDocumentAction, { error: null });
  const [isDownloading, startDownload] = useTransition();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  function handleDownload() {
    if (!existing) return;
    setDownloadError(null);
    startDownload(async () => {
      const url = await getDocumentDownloadUrlAction(existing.storagePath);
      if (!url) {
        setDownloadError("Impossible de générer le lien de téléchargement.");
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          {existing ? <Badge variant="secondary">v{existing.version}</Badge> : null}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {existing ? (
          <p className="text-xs text-muted-foreground">
            Généré le {DATE_FORMATTER.format(new Date(existing.generatedAt))}
          </p>
        ) : null}

        {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
        {downloadError ? <p className="text-sm text-destructive">{downloadError}</p> : null}

        <div className="flex gap-2">
          <form action={formAction}>
            <input type="hidden" name="type" value={type} />
            <GenerateButton hasExisting={!!existing} />
          </form>
          {existing ? (
            <Button type="button" size="sm" variant="outline" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? "Préparation…" : "Télécharger"}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
