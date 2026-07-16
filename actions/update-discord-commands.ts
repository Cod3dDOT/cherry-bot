import "dotenv/config";
import { REST, Routes } from "discord.js";
import { command } from "../src/commands";
import { CHERRY_BOT_USERID } from "../src/shared";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Started refreshing the application (/) commands!");

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(CHERRY_BOT_USERID), {
      body: [command],
    });

    console.log("Successfully reloaded the application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
