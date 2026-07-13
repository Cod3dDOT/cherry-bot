import "dotenv/config";

import { Client, Events, GatewayIntentBits } from "discord.js";
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
    GatewayIntentBits.GuildExpressions
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.discord_token);
