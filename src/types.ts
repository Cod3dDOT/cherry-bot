import { ChatInputCommandInteraction, SlashCommandOptionsOnlyBuilder } from "discord.js";
import { Prisma } from "./generated/prisma/client";

export interface DiscordCommand {
    command: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction, tx: Prisma.TransactionClient) => Promise<void>
}
