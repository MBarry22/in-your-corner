-- Run this once in Supabase SQL Editor to create all tables.
-- Supabase Dashboard → SQL Editor → New query → paste → Run.

CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "Recipient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "sendHour" INTEGER NOT NULL,
    "sendMinute" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Recipient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPersonal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MessageLog" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "templateId" TEXT,
    "bodySent" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "twilioSid" TEXT,
    "errorMessage" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InboundMessage" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT,
    "fromPhone" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "normalizedBody" TEXT,
    "optAction" TEXT,
    "twilioSid" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InboundMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailySendLock" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "sentDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailySendLock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DailyContent" (
    "id" TEXT NOT NULL,
    "contentDate" DATE NOT NULL,
    "messageBody" TEXT NOT NULL,
    "resources" TEXT,
    "promptUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DailyContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Recipient_phone_key" ON "Recipient"("phone");
CREATE INDEX "MessageLog_recipientId_sentAt_idx" ON "MessageLog"("recipientId", "sentAt");
CREATE INDEX "MessageLog_recipientId_idx" ON "MessageLog"("recipientId");
CREATE INDEX "MessageLog_sentAt_idx" ON "MessageLog"("sentAt");
CREATE INDEX "InboundMessage_recipientId_idx" ON "InboundMessage"("recipientId");
CREATE INDEX "InboundMessage_receivedAt_idx" ON "InboundMessage"("receivedAt");
CREATE INDEX "DailySendLock_recipientId_idx" ON "DailySendLock"("recipientId");
CREATE INDEX "DailySendLock_sentDate_idx" ON "DailySendLock"("sentDate");
CREATE UNIQUE INDEX "DailySendLock_recipientId_sentDate_key" ON "DailySendLock"("recipientId", "sentDate");
CREATE UNIQUE INDEX "DailyContent_contentDate_key" ON "DailyContent"("contentDate");

ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MessageTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "InboundMessage" ADD CONSTRAINT "InboundMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "DailySendLock" ADD CONSTRAINT "DailySendLock_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "Recipient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
