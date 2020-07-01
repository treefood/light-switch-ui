const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    // width: 600,
    // height: 1024,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  mainWindow.setFullScreen(true);

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `dist/apps/light-switch-ui/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  await new Promise(r => setTimeout(r, 3000));
  mainWindow.webContents.closeDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});
