const { contextBridge, ipcRenderer } = require('electron');
const { authenticator } = require('otplib');
const path = require('path');
const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');

function parseHTML(html) {
    const $ = cheerio.load(html);
    return {
        // Define a method to get attributes by selector
        attr: (selector, attribute) => $(selector).attr(attribute)
    };
}

// Expose necessary APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    authenticator: {
        generate: (secret) => authenticator.generate(secret),
        options: authenticator.options
    },
    fs: {
        readFile: (path, encoding) => fs.readFile(path, encoding),
        writeFile: (path, data, encoding) => fs.writeFile(path, data, encoding),
        readdir: (dirPath) => fs.readdir(dirPath)
    },
    axios: {
        get: (url) => axios.get(url)
    },
    parseHTML: (html) => parseHTML(html),
    ipcRenderer: {
        send: (channel, ...args) => ipcRenderer.send(channel, ...args)
    },
    path: {
        join: (...paths) => path.join(...paths),
        resolve: (...args) => path.resolve(...args),
    }
});




