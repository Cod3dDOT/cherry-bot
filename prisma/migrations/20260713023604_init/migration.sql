-- CreateTable
CREATE TABLE "Emoji" (
    "emojiId" TEXT NOT NULL PRIMARY KEY,
    "cloudflareId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EmojiStatusEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "emojiId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "EmojiStatusEvent_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "Emoji" ("emojiId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmojiUsageEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "emojiId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    CONSTRAINT "EmojiUsageEvent_emojiId_fkey" FOREIGN KEY ("emojiId") REFERENCES "Emoji" ("emojiId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStatusEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "eventId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "channelId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Guild" (
    "guildId" TEXT NOT NULL PRIMARY KEY,
    "emojiPerUserLimit" INTEGER NOT NULL,
    "emojiExpireTime" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "Emoji_userId_idx" ON "Emoji"("userId");

-- CreateIndex
CREATE INDEX "Emoji_guildId_idx" ON "Emoji"("guildId");

-- CreateIndex
CREATE INDEX "EmojiStatusEvent_emojiId_eventId_idx" ON "EmojiStatusEvent"("emojiId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "EmojiStatusEvent_userId_idx" ON "EmojiStatusEvent"("userId");

-- CreateIndex
CREATE INDEX "EmojiUsageEvent_emojiId_eventId_idx" ON "EmojiUsageEvent"("emojiId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "UserStatusEvent_userId_guildId_eventId_idx" ON "UserStatusEvent"("userId", "guildId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "AuditEvent_userId_idx" ON "AuditEvent"("userId");

-- CreateIndex
CREATE INDEX "AuditEvent_guildId_idx" ON "AuditEvent"("guildId");
