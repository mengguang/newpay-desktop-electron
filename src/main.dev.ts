/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';

import { ethers } from 'ethers';
import fs from 'fs';
import { promisify } from 'util';

import windowStateKeeper from 'electron-window-state';
import Store from 'electron-store';

export default class AppUpdater {
  constructor () {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map(name => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Load the previous state with fallback to defaults
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });

  mainWindow = new BrowserWindow({
    show: false,
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minHeight: 800,
    minWidth: 1200,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  mainWindowState.manage(mainWindow);

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(createWindow)
  .catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.handle('keystore:save', async (_event, password) => {
  console.log(password);

  const wallet = ethers.Wallet.createRandom();
  const keystore = await wallet.encrypt(password);

  const store = new Store();
  let keystoreFile: string = '';

  if (store.has('walletPath')) {
    const walletPath = <string>store.get('walletPath');
    keystoreFile = path.join(walletPath, `${wallet.address}.json`);
  } else {
    const result = await dialog.showSaveDialog({
      title: 'save keystore file as...',
      defaultPath: `${wallet.address}.json`
    });
    console.log(result);
    if (result.canceled === false && result.filePath !== undefined) {
      keystoreFile = result.filePath;
    }
  }

  if (keystoreFile !== '') {
    fs.writeFileSync(keystoreFile, keystore);
    dialog.showMessageBox(mainWindow!,{
      message: "The keystore has beed created",
      detail: `Address is ${wallet.address}`,
    });
    return 'SUCCESS';
  } else {
    return 'FAIL';
  }
});

ipcMain.handle('keystore:choose', async (_event, _args) => {
  const result = await dialog.showOpenDialog({
    title: 'choose keystore file',
    defaultPath: app.getPath('desktop')
  });
  console.log(result);
  if (result.canceled === false && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return '';
});

ipcMain.handle('keystore:choose-wallet-path', async (_event, _args) => {
  const result = await dialog.showOpenDialog({
    title: 'choose keystore file',
    defaultPath: app.getPath('desktop'),
    properties: ['openFile', 'openDirectory']
  });
  console.log(result);
  if (result.canceled === false && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return '';
});

ipcMain.handle('keystore:list', async (_event, _args) => {
  const readdir = promisify(fs.readdir);
  const basePath = app.getPath('documents');
  const walletPath = path.join(basePath, 'wallet');
  const files = await readdir(walletPath);
  let result: Array<string> = [];
  files.forEach(file => {
    if (file.endsWith('.json')) {
      result.push(path.join(walletPath, file));
    }
  });
  console.log(result);
  return result;
});
