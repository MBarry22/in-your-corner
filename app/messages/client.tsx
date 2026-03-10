"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageTable } from "@/components/messages/message-table";
import { MessageForm } from "@/components/messages/message-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { MessageTemplate } from "@prisma/client";

interface MessagesPageClientProps {
  templates: MessageTemplate[];
}

export function MessagesPageClient({ templates }: MessagesPageClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    router.refresh();
  }

  return (
    <>
      <MessageTable templates={templates} onRefresh={refresh} />
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add template</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageForm
              onSuccess={() => {
                refresh();
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)}>Add template</Button>
      )}
    </>
  );
}
