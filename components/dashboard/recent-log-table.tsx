import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface LogEntry {
  id: string;
  bodySent?: string;
  body?: string;
  status?: string;
  optAction?: string | null;
  sentAt?: string | Date;
  receivedAt?: string | Date;
  recipient?: { name: string; phone: string } | null;
  fromPhone?: string;
}

interface RecentLogTableProps {
  title: string;
  logs: LogEntry[];
  type: "outbound" | "inbound";
}

export function RecentLogTable({ title, logs, type }: RecentLogTableProps) {
  const dateKey = type === "outbound" ? "sentAt" : "receivedAt";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-zinc-500">No entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left text-zinc-500">
                  <th className="pb-2 pr-4 font-medium">When</th>
                  <th className="pb-2 pr-4 font-medium">
                    {type === "outbound" ? "Recipient" : "From"}
                  </th>
                  <th className="pb-2 pr-4 font-medium">
                    {type === "outbound" ? "Status" : "Action"}
                  </th>
                  <th className="pb-2 font-medium">Preview</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="border-b border-zinc-100">
                    <td className="py-2 pr-4 text-zinc-600">
                      {log[dateKey]
                        ? format(log[dateKey] instanceof Date ? log[dateKey] : new Date(log[dateKey] as string), "MMM d, HH:mm")
                        : "—"}
                    </td>
                    <td className="py-2 pr-4 text-zinc-900">
                      {type === "outbound"
                        ? (log.recipient?.name ?? log.recipient?.phone ?? "—")
                        : (log.fromPhone ?? "—")}
                    </td>
                    <td className="py-2 pr-4">
                      {type === "outbound" ? (
                        <Badge
                          variant={
                            log.status === "sent"
                              ? "success"
                              : log.status === "failed"
                                ? "danger"
                                : "default"
                          }
                        >
                          {log.status ?? "—"}
                        </Badge>
                      ) : (
                        <span className="text-zinc-600">
                          {log.optAction ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="py-2 text-zinc-600">
                      {(type === "outbound" ? log.bodySent : log.body)?.slice(0, 40) ?? "—"}
                      {((type === "outbound" ? log.bodySent : log.body)?.length ?? 0) > 40 && "…"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
