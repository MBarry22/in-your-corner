import { prisma } from "@/lib/prisma";
import { RecipientTable } from "@/components/recipients/recipient-table";
import { RecipientForm } from "@/components/recipients/recipient-form";
import { RecipientsPageClient } from "./client";

export const dynamic = "force-dynamic";

export default async function RecipientsPage() {
  const recipients = await prisma.recipient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">Recipients</h1>
      <RecipientsPageClient recipients={recipients} />
    </div>
  );
}
