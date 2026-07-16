import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { EmojiStatus, PrismaClient } from "./generated/prisma/client";

export interface DiscordCommand {
  command: SlashCommandSubcommandBuilder;
  execute: (
    interaction: ChatInputCommandInteraction,
    prisma: PrismaClient,
  ) => Promise<void>;
  autocomplete?: (
    interaction: AutocompleteInteraction,
    prisma: PrismaClient,
  ) => Promise<void>;
}

export interface Emoji {
  emojiId: string;
  userId: string;
  status: EmojiStatus;
  usageCount: 0;
  lastUsage: Date;
}
