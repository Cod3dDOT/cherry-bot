import {
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { EmojiStatus, Prisma } from "./generated/prisma/client";

export interface DiscordCommand {
  command: SlashCommandOptionsOnlyBuilder;
  execute: (
    interaction: ChatInputCommandInteraction,
    tx: Prisma.TransactionClient,
  ) => Promise<void>;
}

export interface Emoji {
  emojiId: string;
  cloudflareId: string;
  status: EmojiStatus;
  usageCount: 0;
  lastUsage: Date;
}
