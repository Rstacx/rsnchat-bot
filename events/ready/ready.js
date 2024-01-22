const { Events } = require('discord.js');
const axios = require('axios');
const log = require('../../utils/logger');

const event = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        client.user.setPresence({
          status: "online"
        });
        log.info(`${client.user.tag} is online.`);
    },
};

exports.default = event;