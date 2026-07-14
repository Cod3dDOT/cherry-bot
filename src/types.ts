import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { EmojiStatus, Prisma } from "./generated/prisma/client";

export interface DiscordCommand {
  command: SlashCommandSubcommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction,
    tx: Prisma.TransactionClient,
  ) => Promise<void>;
  autocomplete?: (
    interaction: AutocompleteInteraction,
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
