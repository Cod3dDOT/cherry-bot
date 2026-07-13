import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../types";
import { simplePlural } from "../shared";
import { upsertEmojiLimit } from "../models/guild";
import { countUserActiveEmoji, createEmoji } from "../models/emoji";
import { uploadDiscordAttachment } from "../s3";
import { recordAuditEvent } from "../models/audit";

export const command: DiscordCommand = {
  command: new SlashCommandBuilder()
    .setName("add")
    .setDescription(`Adds an emoji to the server.`)
    .addAttachmentOption((opt) =>
      opt
        .setName("image")
        .setDescription("The image to show for this emoji.")
        .setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("name")
        .setDescription("The name for the emoji.")
        .setRequired(true),
    ),
  execute: async (interaction, tx) => {
    await interaction.deferReply({ flags: ["Ephemeral"] });

    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    const emojiName = interaction.options.getString("name");
    const attachment = interaction.options.getAttachment("image");

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

    if (emojiName === null) {
      await interaction.editReply({
        content: "You must name your emoji!",
      });
      return;
    }

    // I'm using `attachment.contentType` as a kiddie filter.
    // I'll let Discord be the ultimate judge for if something is a valid emoji or not
    if (attachment === null || !attachment.contentType?.startsWith("image/")) {
      await interaction.editReply({
        content: "You must provide an image!",
      });
      return;
    }

    // Does the user have enough slots to create this emoji?
    const emojiPerUserLimit = await upsertEmojiLimit(tx, guildId);
    const userActiveEmoji = await countUserActiveEmoji(tx, guildId, userId);

    if (userActiveEmoji >= emojiPerUserLimit) {
      await interaction.editReply({
        content: `You have ${userActiveEmoji} ${simplePlural("emoji", userActiveEmoji)} on this server. The limit is ${emojiPerUserLimit}.`,
      });
      return;
    }

    // Try to create the emoji
    let emoji;
    try {
      // assert `guild` because if the guild doesn't exist, that's also a problem!
      emoji = await interaction.guild!.emojis.create({
        name: emojiName,
        attachment: attachment.proxyURL,
      });
    } catch (e) {
      // TODO: what if I give a collided name, an invalid name, etc?
      await interaction.editReply({
        content:
          `There was an error creating the emoji. @DEBUG ${e}`,
      });
      return;
    }

    try {
      // Push the emoji to Cloudflare R2
      const cloudflareId = `emoji/${emoji.id}.${attachment.contentType.split("/")[1]}`;
      await uploadDiscordAttachment(attachment, cloudflareId);

      // Persist the emoji to the database
      await createEmoji(tx, guildId, userId, emoji.id, cloudflareId);

      // Record an audit event so we know what happened
      await recordAuditEvent(tx, guildId, userId, `emoji::create(${emojiName})`, interaction.channelId);
    } catch (e) {
      // The emoji exists in Discord, but we couldn't persist it to DB or to Cloudflare.
      // Unwind and rethrow the error to abort the transaction.
      await emoji.delete();
      throw e;
    }

    await interaction.editReply({ content: `:${emoji.name}: is now an emoji. Use it wisely.` });
  },
};
