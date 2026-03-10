import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const [outbound, inbound] = await Promise.all([
    prisma.messageLog.findMany({
      take: 100,
      orderBy: { sentAt: "desc" },
      include: {
        recipient: { select: { id: true, name: true, phone: true } },
        template: { select: { id: true, category: true } },
      },
    }),
    prisma.inboundMessage.findMany({
      take: 100,
      orderBy: { receivedAt: "desc" },
      include: {
        recipient: { select: { id: true, name: true, phone: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">Logs</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Outbound (last 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 pr-2 font-medium">When</th>
                    <th className="pb-2 pr-2 font-medium">Recipient</th>
                    <th className="pb-2 pr-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {outbound.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-100">
                      <td className="py-1.5 pr-2 text-zinc-600 whitespace-nowrap">
                        {format(new Date(log.sentAt), "MMM d, HH:mm")}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-900">
                        {log.recipient?.name ?? log.recipient?.phone ?? "—"}
                      </td>
                      <td className="py-1.5 pr-2">
                        <Badge
                          variant={
                            log.status === "sent"
                              ? "success"
                              : log.status === "failed"
                                ? "danger"
                                : "default"
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-1.5 text-zinc-600 max-w-[200px] truncate">
                        {log.bodySent?.slice(0, 50) ?? "—"}
                        {(log.bodySent?.length ?? 0) > 50 && "…"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {outbound.length === 0 && (
              <p className="text-sm text-zinc-500">No outbound logs yet.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inbound (last 100)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-zinc-500">
                    <th className="pb-2 pr-2 font-medium">When</th>
                    <th className="pb-2 pr-2 font-medium">From</th>
                    <th className="pb-2 pr-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Body</th>
                  </tr>
                </thead>
                <tbody>
                  {inbound.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-100">
                      <td className="py-1.5 pr-2 text-zinc-600 whitespace-nowrap">
                        {format(new Date(log.receivedAt), "MMM d, HH:mm")}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-900">
                        {log.fromPhone}
                      </td>
                      <td className="py-1.5 pr-2 text-zinc-600">
                        {log.optAction ?? "—"}
                      </td>
                      <td className="py-1.5 text-zinc-600 max-w-[200px] truncate">
                        {log.body?.slice(0, 50) ?? "—"}
                        {(log.body?.length ?? 0) > 50 && "…"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {inbound.length === 0 && (
              <p className="text-sm text-zinc-500">No inbound logs yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
