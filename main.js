const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');

let mainWindow;

let currentConfigs = {
  main_room: '',
  token: '',
  ip_address: ''
};

function createConfigFile() {
  fs.writeFileSync('config.json', JSON.stringify(currentConfigs));
}

function openConfigFile() {
  try {
    console.log('opening config file...');
    let content = fs.readFileSync('config.json', 'utf8');
    console.log('content:', JSON.parse(content));
    currentConfigs = JSON.parse(content);
    mainWindow.webContents
      .executeJavaScript(
        `localStorage.setItem('main_room', '${currentConfigs.main_room}')`
      )
      .then(result => {
        console.log('main_room set to', currentConfigs.main_room);
      });
    mainWindow.webContents
      .executeJavaScript(
        `localStorage.setItem('ip_address', '${currentConfigs.ip_address}')`
      )
      .then(result => {
        console.log('ip_address set to', currentConfigs.ip_address);
      });
    mainWindow.webContents
      .executeJavaScript(
        `localStorage.setItem('token', '${currentConfigs.token}')`
      )
      .then(result => {
        console.log('token set to', currentConfigs.token);
      });
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('config file not found, creating new config file....');
      createConfigFile();
    } else {
      console.log('error occured! Exiting App now...', err);
      // app.quit();
    }
  }
}

function updateConfigFile() {
  fs.writeFileSync('config.json', JSON.stringify(currentConfigs));
}

async function checkConfigChanges() {
  let changed = false;
  await mainWindow.webContents
    .executeJavaScript('localStorage.getItem("main_room")')
    .then(item => {
      console.log('Checking main_room....', item);
      if (currentConfigs && currentConfigs.main_room !== item) {
        currentConfigs.main_room = item;
        changed = true;
      }
    })
    .catch(e => console.log('error!', e));

  await mainWindow.webContents
    .executeJavaScript('localStorage.getItem("ip_address")')
    .then(item => {
      console.log('Checking ip_address....', item);
      if (currentConfigs && currentConfigs.ip_address !== item) {
        currentConfigs.ip_address = item;
        changed = true;
      }
    })
    .catch(e => console.log('error!', e));

  await mainWindow.webContents
    .executeJavaScript('localStorage.getItem("token")')
    .then(item => {
      console.log('Checking token....', item);
      if (currentConfigs && currentConfigs.token !== item) {
        currentConfigs.token = item;
        changed = true;
      }
    })
    .catch(e => console.log('error!', e));

  if (changed) {
    console.log('config changed:', currentConfigs);
    updateConfigFile();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    // width: 600,
    // height: 1024,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  });

  openConfigFile();

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
  new Promise(r => setTimeout(r, 3000)).then(x =>
    mainWindow.webContents.closeDevTools()
  );

  setInterval(checkConfigChanges, 5000);

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
