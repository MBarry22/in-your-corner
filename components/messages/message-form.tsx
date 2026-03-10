"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGE_CATEGORIES } from "@/types";
import type { MessageTemplate } from "@prisma/client";

interface MessageFormProps {
  template?: MessageTemplate | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function MessageForm({ template, onSuccess, onCancel }: MessageFormProps) {
  const [body, setBody] = useState(template?.body ?? "");
  const [category, setCategory] = useState(template?.category ?? "encouragement");
  const [isActive, setIsActive] = useState(template?.isActive ?? true);
  const [isPersonal, setIsPersonal] = useState(template?.isPersonal ?? false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = !!template?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = isEdit ? `/api/messages/${template.id}` : "/api/messages";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          category,
          isActive,
          isPersonal,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }
      onSuccess();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Message body</label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="A warm, short supportive message..."
          required
          maxLength={500}
          rows={3}
        />
        <p className="mt-1 text-xs text-zinc-500">{body.length} / 500</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {MESSAGE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-zinc-300 text-accent focus:ring-accent"
          />
          Active
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isPersonal}
            onChange={(e) => setIsPersonal(e.target.checked)}
            className="rounded border-zinc-300 text-accent focus:ring-accent"
          />
          Personal
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : isEdit ? "Update" : "Create"}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
