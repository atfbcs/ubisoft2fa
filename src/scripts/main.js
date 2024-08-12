const path = require('path')
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const fs = require('fs');
const { exec } = require('child_process');

let win;
let appPaths = {};

function createWindow() {
    win = new BrowserWindow({
        width: 960,
        height: 540,
        minWidth: 448,
        minHeight: 540,
        maxWidth: 960,
        maxHeight: 540,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true
            //devTools: false
        }
    });

    win.loadFile(path.join(__dirname, '../index.html'));
    win.setIcon(path.join(__dirname, '../img/ubisoft.png'));
    win.setMenuBarVisibility(false);
    win.on("closed", () => { win = null; });
    loadAppPaths();
}

function loadAppPaths() {
    const filePath = path.join(__dirname, '../json/paths.json');
    if (fs.existsSync(filePath)) {
        appPaths = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
}

function saveAppPaths() {
    const filePath = path.join(__dirname, '../json/paths.json');
    fs.writeFileSync(filePath, JSON.stringify(appPaths, null, 4), 'utf8');
}

function openApplication(appName) {
    const appPath = appPaths[appName];
    if (appPath) {
        // Enclose the appPath in quotes to handle spaces
        exec(`"${appPath}"`, (error) => {
            if (error) {
                console.error(`Error opening ${appName}: ${error.message}`);
                promptForAppPath(appName); 
            }
        });
    } else {
        promptForAppPath(appName);
    }
}

function promptForAppPath(appName) {
    dialog.showOpenDialog(win, {
        properties: ['openFile'],
        title: `Select ${appName} Executable`,
        filters: [{ name: 'Executable', extensions: ['exe'] }]
    }).then(result => {
        if (!result.canceled && result.filePaths.length > 0) {
            appPaths[appName] = result.filePaths[0];
            saveAppPaths();
            // Enclose the selected path in quotes to handle spaces
            exec(`"${result.filePaths[0]}"`, (error) => {
                if (error) {
                    console.error(`Error opening ${appName}: ${error.message}`);
                    dialog.showErrorBox('Application Error', `Failed to open ${appName}. Please verify the selected path.`);
                }
            });
        }
    }).catch(err => console.error('Error selecting file:', err));
}

ipcMain.on("manualMinimize", () => win.minimize());
ipcMain.on("manualClose", () => app.quit());
ipcMain.on('open-url', (event, url) => shell.openExternal(url));
ipcMain.on('open-application', (event, appName) => openApplication(appName));

app.on("ready", createWindow);
app.whenReady().then(() => {
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handle file system operations
ipcMain.handle('read-file', (event, filePath, encoding) => {
    return fs.promises.readFile(filePath, encoding);
});

ipcMain.handle('write-file', (event, filePath, data, encoding) => {
    return fs.promises.writeFile(filePath, data, encoding);
});

