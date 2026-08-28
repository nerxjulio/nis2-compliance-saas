"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { generateDocumentAction, getDocumentDownloadUrlAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DocumentType } from "@/lib/pdf/generate";

function GenerateButton({ hasExisting }: { hasExisting: boolean }) {
  const { pending } = useFormStatus();
  const t = useTranslations("documents");
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? t("generating") : hasExisting ? t("regenerate") : t("generate")}
    </Button>
  );
}

export function DocumentCard({
  type,
  existing,
}: {
  type: DocumentType;
  existing: { version: number; generatedAt: string; storagePath: string } | null;
}) {
  const locale = useLocale();
  const t = useTranslations("documents");
  const tTypes = useTranslations(`documents.types.${type}`);
  const [state, formAction] = useActionState(generateDocumentAction, { error: null });
  const [isDownloading, startDownload] = useTransition();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function handleDownload() {
    if (!existing) return;
    setDownloadError(null);
    startDownload(async () => {
      const url = await getDocumentDownloadUrlAction(existing.storagePath);
      if (!url) {
        setDownloadError(t("downloadError"));
        return;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{tTypes("title")}</CardTitle>
          {existing ? <Badge variant="secondary">v{existing.version}</Badge> : null}
        </div>
        <CardDescription>{tTypes("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {existing ? (
          <p className="text-xs text-muted-foreground">
            {t("generatedOn", { date: dateFormatter.format(new Date(existing.generatedAt)) })}
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
              {isDownloading ? t("preparing") : t("download")}
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
