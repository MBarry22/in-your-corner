"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  generateTodayContent,
  generateTodayContentPreview,
  saveTodayContentAction,
} from "@/app/actions/daily-content";

interface DailyContentData {
  contentDate: string;
  messageBody: string;
  resources: { id?: string; title?: string; url?: string; note?: string }[];
  updatedAt: string;
}

interface PreviewContent {
  messageBody: string;
  resources: { id: string; title: string; url: string; note?: string }[];
}

export function DailyContentCard() {
  const [content, setContent] = useState<DailyContentData | null>(null);
  const [preview, setPreview] = useState<PreviewContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContent() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/daily-content");
      const data = await res.json();
      setContent(data.content ?? null);
    } catch {
      setError("Could not load today's message.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContent();
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    setPreview(null);
    try {
      const result = await generateTodayContent();
      if (result.ok) {
        await fetchContent();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Generation failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePreviewAnother() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateTodayContentPreview();
      if (result.ok) {
        setPreview(result.content);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Preview failed.");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSavePreview() {
    if (!preview) return;
    setSaving(true);
    setError(null);
    try {
      const result = await saveTodayContentAction(preview.messageBody, preview.resources);
      if (result.ok) {
        setPreview(null);
        await fetchContent();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const display = preview ?? content;
  const isPreview = !!preview;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-500">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Today&apos;s message</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePreviewAnother}
            disabled={generating}
          >
            {generating ? "Generating…" : "Preview another"}
          </Button>
          {preview && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleSavePreview}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save as today's message"}
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={handleGenerate}
            disabled={generating}
          >
            Generate & save
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {display ? (
          <>
            <p className="text-xs text-zinc-500 mb-1">
              Calgary time · one message per day
              {isPreview && (
                <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                  Preview (not saved)
                </span>
              )}
            </p>
            <p className="text-sm text-zinc-900 whitespace-pre-wrap">
              {display.messageBody}
            </p>
            {display.resources?.length > 0 && (
              <div className="border-t border-zinc-100 pt-2">
                <p className="text-xs font-medium text-zinc-500 mb-1">Resources</p>
                <ul className="text-sm space-y-1">
                  {display.resources.map((r, i) => (
                    <li key={r.id ?? i}>
                      {r.url ? (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          {r.title || r.id || "Resource"}
                        </a>
                      ) : (
                        <span className="text-zinc-700 font-medium">{r.title || r.id}</span>
                      )}
                      {r.note && (
                        <span className="text-zinc-500"> — {r.note}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            No AI message for today. Click &quot;Preview another&quot; to try one, or &quot;Generate & save&quot; to save.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
