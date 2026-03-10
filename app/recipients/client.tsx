"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipientTable } from "@/components/recipients/recipient-table";
import { RecipientForm } from "@/components/recipients/recipient-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Recipient } from "@prisma/client";

interface RecipientsPageClientProps {
  recipients: Recipient[];
}

export function RecipientsPageClient({ recipients }: RecipientsPageClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    router.refresh();
  }

  return (
    <>
      <RecipientTable recipients={recipients} onRefresh={refresh} />
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Add recipient</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipientForm
              onSuccess={() => {
                refresh();
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)}>Add recipient</Button>
      )}
    </>
  );
}
