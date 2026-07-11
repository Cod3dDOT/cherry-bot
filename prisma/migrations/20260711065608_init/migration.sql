-- CreateTable
CREATE TABLE "Emoji" (
    "emojiId" TEXT NOT NULL PRIMARY KEY,
    "cloudflareId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "guildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EmojiStatusEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "emojiId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EmojiUsageEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "emojiId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserStatusEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "channelId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Emoji_userId_idx" ON "Emoji"("userId");

-- CreateIndex
CREATE INDEX "Emoji_guildId_idx" ON "Emoji"("guildId");

-- CreateIndex
CREATE INDEX "EmojiStatusEvent_emojiId_timestamp_idx" ON "EmojiStatusEvent"("emojiId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "EmojiStatusEvent_userId_idx" ON "EmojiStatusEvent"("userId");

-- CreateIndex
CREATE INDEX "EmojiUsageEvent_emojiId_idx" ON "EmojiUsageEvent"("emojiId");

-- CreateIndex
CREATE INDEX "UserStatusEvent_userId_guildId_timestamp_idx" ON "UserStatusEvent"("userId", "guildId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId");

-- CreateIndex
CREATE INDEX "AuditEvent_guildId_idx" ON "AuditEvent"("guildId");
