import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageTemplateSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const raw = await req.json();
    const data = messageTemplateSchema.partial().parse(raw);
    const template = await prisma.messageTemplate.update({
      where: { id },
      data: {
        ...(data.body !== undefined && { body: data.body }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isPersonal !== undefined && { isPersonal: data.isPersonal }),
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await prisma.messageTemplate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
