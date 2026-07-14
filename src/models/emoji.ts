import { EmojiStatus, Prisma } from "../generated/prisma/client";
import { Emoji } from "../types";

export async function countUserActiveEmoji(
  tx: Prisma.TransactionClient,
  guildId: string,
  userId: string,
): Promise<number> {
  const emojis = await tx.emoji.findMany({
    where: { guildId, userId },
    select: {
      statusEvents: {
        orderBy: { eventId: "desc" },
        take: 1,
        select: { status: true },
      },
    },
  });

  return emojis.filter(({ statusEvents }) => statusEvents[0]?.status === "Ok")
    .length;
}

export async function pushEmojiStatus(
  tx: Prisma.TransactionClient,
  emojiId: string,
  userId: string,
  newStatus: EmojiStatus
) {
  // You could also do this through the emoji model
  await tx.emojiStatusEvent.create({
    data: {
      emojiId,
      userId,
      status: newStatus,
    },
  });
}

export async function createEmoji(
  tx: Prisma.TransactionClient,
  guildId: string,
  userId: string,
  emojiId: string,
  cloudflareId: string,
  channelId: string,
) {
  await tx.emoji.create({
    data: {
      emojiId,
      cloudflareId,
      guildId,
      userId,
      statusEvents: {
        create: {
          userId,
          status: "Ok",
        },
      },
      usageEvents: {
        create: {
          userId,
          guildId,
          channelId,
        },
      },
    },
  });
}
