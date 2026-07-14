import "dotenv/config";

import { Client, Events, GatewayIntentBits, Interaction } from "discord.js";
import { commands } from "./commands";
import { prisma } from "./shared";
const client = new Client({
  intents: [
    // Lets us recieve information about channels, roles, messages
    GatewayIntentBits.Guilds,

    // We need this intent to read actual user messages as they are sent to us.
    // This covers the case where an emoji is used in a message, but never as a reaction.
    // Without this, emojis might get deleted that are still in use.
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,

    // This intent allows us to listen for users joining and leaving the server.
    // This lets us clean up emojis when a user joins or leaves the server.
    GatewayIntentBits.GuildMembers,

    // This intent lets us create and manage emoji for the server
    GatewayIntentBits.GuildExpressions,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
  if (interaction.isAutocomplete()) {
    const command = commands[interaction.commandName];
    const autocomplete = command?.autocomplete;

    if (autocomplete === undefined) {
      await interaction.respond([]);
      return;
    }

    await prisma.$transaction(async (tx) => {
      await autocomplete(interaction, tx);
    });
    return;
  }

  if (interaction.isChatInputCommand()) {
    const command = commands[interaction.commandName];
    const execute = command?.execute;

    if (execute === undefined) {
      await interaction.reply({
        flags: ["Ephemeral"],
        content: "A command with that name does not exist!",
      });
    } else {
      await prisma.$transaction(async (tx) => {
        await execute(interaction, tx);
      });
    }

    return;
  }
});

client.login(process.env.discord_token);
