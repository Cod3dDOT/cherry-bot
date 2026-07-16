import { SlashCommandSubcommandBuilder } from "discord.js";
import { DiscordCommand } from "../types";
import { referenceEmoji, sendPagedReply, simplePlural } from "../shared";
import { getServerActiveEmoji, getUserActiveEmoji } from "../models/emoji";

export const command: DiscordCommand = {
  command: new SlashCommandSubcommandBuilder()
    .setName("stats")
    .setDescription(
      "Gives status about all the emoji managed by CherryBot on this server.",
    ),
  execute: async (interaction, prisma) => {
    await interaction.deferReply({ flags: ["Ephemeral"] });

    const guildId = interaction.guildId;

    if (guildId === null) {
      // For example, are we in DMs?
      await interaction.editReply({
        content: "This command can only be used in a server!",
      });
      return;
    }

    const emojis = await getServerActiveEmoji(prisma, guildId);

    if (emojis.length === 0) {
      await interaction.editReply({
        content:
          "This server doesn't have any emoji yet. Create some with `/cherry emoji create`!",
      });
    } else {
      await sendPagedReply(
        interaction,
        true,
        "This server has the following emoji:\n",
        await Promise.all(
          emojis.map(async (emoji) => {
            // Arguably, this could be dropped since Discord seems to resolve just fine without this info
            const discordEmoji = await interaction.guild?.emojis.fetch(
              emoji.emojiId,
            );
            const emojiRef = referenceEmoji({
              emojiId: emoji.emojiId,
              animated: discordEmoji?.animated,
              name: discordEmoji?.name,
            });

            // `<t:${lastUsageUnixTime}:d>` gives the last used time in the user's locale as a short date string.
            // We could use `:f` instead for a form like "6/21/26 at 9:26am"
            return `- ${emojiRef} - created by <@${emoji.userId}> - used ${emoji.usageCount} ${simplePlural("time", emoji.usageCount)}\n`;
          }),
        ),
      );
    }
  },
};
