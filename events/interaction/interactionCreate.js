"use strict";
const { Events } = require('discord.js');

const event = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        const command = interaction.client.slashCommands.get(interaction.commandName);
        if (command === undefined) return;

        await command.execute(interaction);
    }
};

exports.default = event;
