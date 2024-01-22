const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const log = require('./utils/logger');
const dotenv = require("dotenv")
dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	try {
		log.info(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		log.info(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		log.error(error);
	}
})();