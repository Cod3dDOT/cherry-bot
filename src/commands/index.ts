import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../types";

import { command as emojiAdd } from "./emojiAdd";
import { command as emojiDelete } from "./emojiDelete";
import { command as emojiList } from "./emojiList";

export const command = new SlashCommandBuilder()
  .setName("cherry")
  .setDescription("CherryBot commands")
  .addSubcommandGroup((group) =>
    group
      .setName("emoji")
      .setDescription("Manage your emoji on this server.")
      .addSubcommand(emojiAdd.command)
      .addSubcommand(emojiDelete.command)
      .addSubcommand(emojiList.command),
  );

export const commands: Record<string, DiscordCommand | undefined> = {
  [`emoji:${emojiAdd.command.name}`]: emojiAdd,
  [`emoji:${emojiDelete.command.name}`]: emojiDelete,
  [`emoji:${emojiList.command.name}`]: emojiList,
};