import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recipientSchema } from "@/lib/validations";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const recipient = await prisma.recipient.findUnique({
    where: { id },
    include: {
      messageLogs: { take: 5, orderBy: { sentAt: "desc" } },
      inboundMessages: { take: 5, orderBy: { receivedAt: "desc" } },
    },
  });
  if (!recipient) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(recipient);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const raw = await req.json();
    const data = recipientSchema.partial().parse(raw);
    const recipient = await prisma.recipient.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.timezone !== undefined && { timezone: data.timezone }),
        ...(data.sendHour !== undefined && { sendHour: data.sendHour }),
        ...(data.sendMinute !== undefined && { sendMinute: data.sendMinute }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPaused !== undefined && { isPaused: data.isPaused }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });
    return NextResponse.json(recipient);
  } catch (err) {
    if (err && typeof err === "object" && "issues" in err) {
      return NextResponse.json({ error: "Validation failed", details: err }, { status: 400 });
    }
    throw err;
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await prisma.recipient.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
