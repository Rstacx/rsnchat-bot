"use strict";
const dotenv = require("dotenv")
const { Client, Collection, GatewayIntentBits, Options, sendTyping, ActivityType, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const path = require("path");
const axios = require('axios');
const slashc = require('./deploy-commands');
const fs = require("fs");
const log = require('./utils/logger');

dotenv.config();

const client = new Client({
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            interval: 3600,
            filter: () => message => message.author.id !== client.user.id,
        },
    },
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
      ]
});

client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    if (msg.mentions.everyone || msg.mentions.here) {
        return;
    }

    if (!msg.mentions.has(client.user)) return;
    if (!msg.content.startsWith(`<@${client.user.id}>`)) return;
    msg.content = msg.content.replace(/<@\d+>/g, "");

    if (msg.content.length === 0) {
        await msg.react("👋");
        return;
    }
});

client.slashCommands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.slashCommands.set(command.data.name, command);
    } else {
        log.info(`The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

const handlersDir = path.join(__dirname, './handlers');
fs.readdirSync(handlersDir).forEach(async handler => {
    (await Promise.resolve(`${`${handlersDir}/${handler}`}`).then(s => __importStar(require(s)))).default(client);
});

client.login(process.env.TOKEN);