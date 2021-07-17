const path = require('path');
const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron') ;
const download = require('download');
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

const PLUGINS_PATH = path.join(
  process.cwd(),
  'client',
  'plugins'
);

function checkPackages() {
  return axios.get(`${SERVER_URL}/plugins`)
    .then((response) => response.data);
}

function cleanPluginsDir() {
  // TODO: In production we should diff and check sum instead of removing entire folder
  return new Promise((resolve) => {
    fs.rmdirSync(PLUGINS_PATH, { recursive: true });
    resolve();
  })
}

function downloadPackages(plugins) {
  console.log(plugins);
  const promises = plugins.map((plugin) => {
    // @ts-ignore
    return download(plugin.path, PLUGINS_PATH);
  });

  return Promise.all(promises);
}

app.whenReady()
  .then(() => {
    const win = new BrowserWindow({
      width: 800,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    win.webContents.openDevTools();

    cleanPluginsDir()
      .then(checkPackages)
      .then(downloadPackages)
      .then(() => {
        win.loadURL('file://' + __dirname + '/index.html');
      });
  });