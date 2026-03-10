import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentLogTable } from "@/components/dashboard/recent-log-table";
import { DailyContentCard } from "@/components/dashboard/daily-content-card";
import { startOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [recipients, templates, outboundLogs, inboundLogs, todayStart] = await Promise.all([
    prisma.recipient.findMany({ select: { id: true, isActive: true, isPaused: true } }),
    prisma.messageTemplate.findMany({ where: { isActive: true }, select: { id: true } }),
    prisma.messageLog.findMany({
      take: 20,
      orderBy: { sentAt: "desc" },
      include: {
        recipient: { select: { id: true, name: true, phone: true } },
      },
    }),
    prisma.inboundMessage.findMany({
      take: 20,
      orderBy: { receivedAt: "desc" },
      include: {
        recipient: { select: { id: true, name: true, phone: true } },
      },
    }),
    startOfDay(new Date()),
  ]);

  const activeCount = recipients.filter((r) => r.isActive && !r.isPaused).length;
  const pausedCount = recipients.filter((r) => r.isPaused).length;
  const sentToday = await prisma.messageLog.count({
    where: { status: "sent", sentAt: { gte: todayStart } },
  });
  const failedToday = await prisma.messageLog.count({
    where: { status: "failed", sentAt: { gte: todayStart } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active recipients" value={activeCount} />
        <StatCard title="Paused recipients" value={pausedCount} />
        <StatCard title="Messages sent today" value={sentToday} />
        <StatCard title="Failed sends today" value={failedToday} />
      </div>
      <DailyContentCard />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentLogTable title="Recent outbound" logs={outboundLogs} type="outbound" />
        <RecentLogTable title="Recent inbound" logs={inboundLogs} type="inbound" />
      </div>
    </div>
  );
}
