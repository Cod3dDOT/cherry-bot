import "dotenv/config";
import { REST, Routes } from "discord.js";
import { command } from "../src/commands";

const APP_ID = "1525906719945916527";
const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("Started refreshing the application (/) commands!");

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(APP_ID), {
      body: [command],
    });

    console.log("Successfully reloaded the application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
