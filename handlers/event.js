"use strict";
const fs = require("fs");
const path = require("path");
const log = require('../utils/logger');

module.exports = function (client) {
    const eventsDir = path.join(__dirname, '../events');
    const folders = fs.readdirSync(eventsDir, { recursive: true, withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    folders.forEach(folder => {
        const files = fs.readdirSync(path.join(eventsDir, folder));
        files.forEach(file => {
            if (!file.endsWith('.js'))
                return;
            
            const event = require(path.join(eventsDir, folder, file)).default;
            if (event.once) {
                client.once(event.name, (...args) => {
                    event.execute(...args);
                });
            } else {
                client.on(event.name, (...args) => {
                    event.execute(...args);
                });
            }
            
            log.info(`Successfully loaded event ${file}`);
        });
    });
};
