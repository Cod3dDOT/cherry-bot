-- DropIndex
DROP INDEX "EmojiUsageEvent_emojiId_idx";

-- DropIndex
DROP INDEX "UserStatusEvent_userId_guildId_timestamp_idx";

-- CreateIndex
CREATE INDEX "EmojiUsageEvent_emojiId_eventId_idx" ON "EmojiUsageEvent"("emojiId", "eventId" DESC);

-- CreateIndex
CREATE INDEX "UserStatusEvent_userId_guildId_eventId_idx" ON "UserStatusEvent"("userId", "guildId", "eventId" DESC);
