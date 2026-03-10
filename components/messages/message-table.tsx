"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageForm } from "./message-form";
import type { MessageTemplate } from "@prisma/client";

interface MessageTableProps {
  templates: MessageTemplate[];
  onRefresh: () => void;
}

export function MessageTable({ templates: initial, onRefresh }: MessageTableProps) {
  const [templates, setTemplates] = useState(initial);
  const [editing, setEditing] = useState<MessageTemplate | null>(null);

  useEffect(() => {
    setTemplates(initial);
  }, [initial]);

  async function deleteTemplate(t: MessageTemplate) {
    if (!confirm("Delete this template?")) return;
    try {
      const res = await fetch(`/api/messages/${t.id}`, { method: "DELETE" });
      if (res.ok) {
        setTemplates((prev) => prev.filter((x) => x.id !== t.id));
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
        <CardTitle>Message templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <MessageForm
            template={editing}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 pr-4 font-medium">Body</th>
                    <th className="pb-2 pr-4 font-medium">Category</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {templates.map((t) => (
                    <tr key={t.id} className="border-b border-zinc-100">
                      <td className="py-2 pr-4 text-zinc-900 max-w-xs">
                        {t.body.slice(0, 80)}
                        {t.body.length > 80 && "…"}
                      </td>
                      <td className="py-2 pr-4">
                        <Badge variant="default">{t.category}</Badge>
                        {t.isPersonal && (
                          <Badge variant="default" className="ml-1">
                            Personal
                          </Badge>
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {t.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="default">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => deleteTemplate(t)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {templates.length === 0 && (
              <p className="text-sm text-zinc-500">No templates. Add one below.</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
