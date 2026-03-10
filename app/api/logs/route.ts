import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type") ?? "outbound";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

  if (type === "inbound") {
    const logs = await prisma.inboundMessage.findMany({
      take: limit,
      orderBy: { receivedAt: "desc" },
      include: {
        recipient: { select: { id: true, name: true, phone: true } },
      },
    });
    return NextResponse.json(logs);
  }

  const logs = await prisma.messageLog.findMany({
    take: limit,
    orderBy: { sentAt: "desc" },
    include: {
      recipient: { select: { id: true, name: true, phone: true } },
      template: { select: { id: true, category: true } },
    },
  });
  return NextResponse.json(logs);
}
