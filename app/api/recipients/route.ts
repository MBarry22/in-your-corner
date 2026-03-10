import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { recipientSchema } from "@/lib/validations";

export async function GET() {
  const list = await prisma.recipient.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = recipientSchema.parse(raw);
    const recipient = await prisma.recipient.create({
      data: {
        name: data.name,
        phone: data.phone,
        timezone: data.timezone,
        sendHour: data.sendHour,
        sendMinute: data.sendMinute,
        isActive: data.isActive,
        isPaused: data.isPaused,
        notes: data.notes ?? undefined,
      },
    });
    return NextResponse.json(recipient);
  } catch (err) {
    if (err && typeof err === "object" && "issues" in err) {
      const issues = (err as { issues: { path: (string | number)[]; message: string }[] }).issues;
      const first = issues[0];
      const message = first ? `${first.path.join(".")}: ${first.message}` : "Validation failed";
      return NextResponse.json({ error: message, details: err }, { status: 400 });
    }
    throw err;
  }
}
