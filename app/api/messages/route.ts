import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageTemplateSchema } from "@/lib/validations";

export async function GET() {
  const list = await prisma.messageTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json();
    const data = messageTemplateSchema.parse(raw);
    const template = await prisma.messageTemplate.create({
      data: {
        body: data.body,
        category: data.category,
        isActive: data.isActive,
        isPersonal: data.isPersonal,
      },
    });
    return NextResponse.json(template);
  } catch (err) {
    if (err && typeof err === "object" && "issues" in err) {
      return NextResponse.json({ error: "Validation failed", details: err }, { status: 400 });
    }
    throw err;
  }
}
