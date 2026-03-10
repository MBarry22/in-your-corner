"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Recipient } from "@prisma/client";

const TIMEZONES = [
  "America/Edmonton",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
];

interface RecipientFormProps {
  recipient?: Recipient | null;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function RecipientForm({ recipient, onSuccess, onCancel }: RecipientFormProps) {
  const [name, setName] = useState(recipient?.name ?? "");
  const [phone, setPhone] = useState(recipient?.phone ?? "");
  const [timezone, setTimezone] = useState(recipient?.timezone ?? "America/Edmonton");
  const [sendHour, setSendHour] = useState(recipient?.sendHour ?? 8);
  const [sendMinute, setSendMinute] = useState(recipient?.sendMinute ?? 0);
  const [isActive, setIsActive] = useState(recipient?.isActive ?? true);
  const [isPaused, setIsPaused] = useState(recipient?.isPaused ?? false);
  const [notes, setNotes] = useState(recipient?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEdit = !!recipient?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const url = isEdit ? `/api/recipients/${recipient.id}` : "/api/recipients";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          timezone,
          sendHour: Number(sendHour),
          sendMinute: Number(sendMinute),
          isActive,
          isPaused,
          notes: notes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error ?? "Something went wrong";
        setError(typeof msg === "string" ? msg : msg.message ?? "Something went wrong");
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
        <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mom"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Phone (E.164)
        </label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+15551234567"
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Timezone</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Send hour (0–23)</label>
          <Input
            type="number"
            min={0}
            max={23}
            value={sendHour}
            onChange={(e) => setSendHour(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Send minute (0–59)</label>
          <Input
            type="number"
            min={0}
            max={59}
            value={sendMinute}
            onChange={(e) => setSendMinute(Number(e.target.value))}
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-zinc-500">Default: 8:00 AM Calgary (America/Edmonton). Cron runs every 15 min; only recipients in your list get the daily message.</p>
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
            checked={isPaused}
            onChange={(e) => setIsPaused(e.target.checked)}
            className="rounded border-zinc-300 text-accent focus:ring-accent"
          />
          Paused
        </label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional"
          rows={2}
        />
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
