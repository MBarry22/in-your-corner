"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecipientForm } from "./recipient-form";
import { formatPhoneDisplay } from "@/lib/utils";
import type { Recipient } from "@prisma/client";

interface RecipientTableProps {
  recipients: Recipient[];
  onRefresh: () => void;
}

export function RecipientTable({ recipients: initial, onRefresh }: RecipientTableProps) {
  const [recipients, setRecipients] = useState(initial);
  const [editing, setEditing] = useState<Recipient | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    setRecipients(initial);
  }, [initial]);

  async function togglePause(r: Recipient) {
    try {
      const res = await fetch(`/api/recipients/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaused: !r.isPaused }),
      });
      if (res.ok) {
        setRecipients((prev) =>
          prev.map((x) => (x.id === r.id ? { ...x, isPaused: !x.isPaused } : x))
        );
        onRefresh();
      }
    } catch {
      // ignore
    }
  }

  async function sendNow(r: Recipient, test: boolean) {
    setSending(r.id);
    try {
      const res = await fetch("/api/send-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: r.id, test }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert(test ? "Test message sent." : "Message sent.");
        onRefresh();
      } else {
        const msg = data.message ?? data.details ?? data.error ?? "Send failed.";
        alert(msg);
      }
    } finally {
      setSending(null);
    }
  }

  async function deleteRecipient(r: Recipient) {
    if (!confirm(`Delete ${r.name}?`)) return;
    try {
      const res = await fetch(`/api/recipients/${r.id}`, { method: "DELETE" });
      if (res.ok) {
        setRecipients((prev) => prev.filter((x) => x.id !== r.id));
        setEditing(null);
        onRefresh();
      }
    } catch {
      // ignore
    }
  }

  function handleFormSuccess() {
    onRefresh();
    setEditing(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <RecipientForm
            recipient={editing}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 pr-4 font-medium">Name</th>
                    <th className="pb-2 pr-4 font-medium">Phone</th>
                    <th className="pb-2 pr-4 font-medium">Send time</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 font-medium text-zinc-900">{r.name}</td>
                      <td className="py-2 pr-4 text-zinc-600">{formatPhoneDisplay(r.phone)}</td>
                      <td className="py-2 pr-4 text-zinc-600">
                        {String(r.sendHour).padStart(2, "0")}:
                        {String(r.sendMinute).padStart(2, "0")} ({r.timezone})
                      </td>
                      <td className="py-2 pr-4">
                        <span className="mr-1">
                          {r.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="default">Inactive</Badge>
                          )}
                        </span>
                        {r.isPaused && <Badge variant="warning">Paused</Badge>}
                      </td>
                      <td className="py-2 flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditing(r)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePause(r)}
                        >
                          {r.isPaused ? "Resume" : "Pause"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendNow(r, true)}
                          disabled={sending === r.id}
                        >
                          Test
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendNow(r, false)}
                          disabled={sending === r.id}
                        >
                          Send now
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => deleteRecipient(r)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {recipients.length === 0 && (
              <p className="text-sm text-zinc-500">No recipients. Add one below.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
