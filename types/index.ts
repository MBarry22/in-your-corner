import type { Recipient, MessageTemplate, MessageLog, InboundMessage } from "@prisma/client";

export type { Recipient, MessageTemplate, MessageLog, InboundMessage };

export const MESSAGE_CATEGORIES = [
  "encouragement",
  "affirmation",
  "reminder",
  "gratitude",
  "personal note",
  "recovery support",
  "check-in",
] as const;

export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number];

export const MESSAGE_LOG_STATUS = ["sent", "failed", "queued"] as const;
export type MessageLogStatus = (typeof MESSAGE_LOG_STATUS)[number];

export const OPT_KEYWORDS = ["STOP", "START", "PAUSE", "RESUME", "HELP"] as const;
export type OptKeyword = (typeof OPT_KEYWORDS)[number];
