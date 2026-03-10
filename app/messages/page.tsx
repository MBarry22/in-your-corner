import { prisma } from "@/lib/prisma";
import { MessagesPageClient } from "./client";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const templates = await prisma.messageTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">Message templates</h1>
      <MessagesPageClient templates={templates} />
    </div>
  );
}
