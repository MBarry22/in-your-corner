import { z } from "zod";
import { MESSAGE_CATEGORIES } from "@/types";

const e164Regex = /^\+[1-9]\d{1,14}$/;

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15 ? `+${digits}` : phone;
}

export const recipientSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  phone: z
    .string()
    .min(1, "Phone is required")
    .transform((s) => toE164(s.trim()))
    .pipe(z.string().regex(e164Regex, "Phone must be E.164 (e.g. +15551234567)")),
  timezone: z.string().min(1, "Timezone is required"),
  sendHour: z.number().int().min(0).max(23),
  sendMinute: z.number().int().min(0).max(59),
  isActive: z.boolean().default(true),
  isPaused: z.boolean().default(false),
  notes: z.string().max(2000).optional().nullable(),
});

export const messageTemplateSchema = z.object({
  body: z.string().min(1, "Message body is required").max(500),
  category: z.enum([...MESSAGE_CATEGORIES] as [string, ...string[]]),
  isActive: z.boolean().default(true),
  isPersonal: z.boolean().default(false),
});

export const cronAuthSchema = z.object({
  secret: z.string().min(1),
});

export type RecipientInput = z.infer<typeof recipientSchema>;
export type MessageTemplateInput = z.infer<typeof messageTemplateSchema>;
