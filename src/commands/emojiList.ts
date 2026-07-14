import { SlashCommandSubcommandBuilder } from "discord.js";
import { DiscordCommand } from "../types";
import { simplePlural } from "../shared";
import { getUserActiveEmoji } from "../models/emoji";

export const command: DiscordCommand = {
  command: new SlashCommandSubcommandBuilder()
    .setName("list")
    .setDescription("Lists all the emoji you own on the server."),
  execute: async (interaction, prisma) => {
    await interaction.deferReply({ flags: ["Ephemeral"] });

    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    if (guildId === null) {
      // For example, are we in DMs?
      await interaction.editReply({
        content: "This command can only be used in a server!",
      });
      return;
    }

    if (userId === null) {
      // I actually have no idea what would trigger a null user id...
      await interaction.editReply({
        content: "This command can only be used by a user!",
      });
      return;
    }

    const emojis = await getUserActiveEmoji(prisma, guildId, userId);

    if (emojis.length === 0) {
      await interaction.editReply({
        content:
          "You don't have any emoji yet. Try creating one with `/cherry emoji add`!",
      });
    } else {
      let msg = "You have the following emoji in this server:\n";
      for (let emoji of emojis) {
        // Get time returns milliseconds
        const lastUsageUnixTime = Math.floor(emoji.lastUsage.getTime() / 1000);

        // Arguably, this could be dropped since Discord seems to resolve just fine when I use
        const discordEmoji = await interaction.guild?.emojis.fetch(
          emoji.emojiId,
        );
        const animated = discordEmoji?.animated ? "a" : "";
        const name = discordEmoji?.name ?? "ACustomEmoji";

        // `<t:${lastUsageUnixTime}:d>` gives the last used time in the user's locale as a short date string.
        // We could use `:f` instead for a form like "6/21/26 at 9:26am"
        msg += `- <${animated}:${name}:${emoji.emojiId}> - Last used <t:${lastUsageUnixTime}:d> (${emoji.usageCount} ${simplePlural("time", emoji.usageCount)} total)\n`;
      }
      await interaction.editReply({ content: msg });
    }
  },
};
