const { app, BrowserWindow, ipcMain, dialog, Notification, screen } = require('electron');
const path = require('path');

let mainWindow;
let mood = 'loving';
let moodTimer;
let movementTimer;
let messageTimer;
let inactivityTimer;
let lastActivity = Date.now();
let closeAttempts = 0;

const moods = ['loving', 'jealous', 'angry', 'clingy'];
const messages = {
  loving: ['💕 I love you so much!', "You're my everything! 😍", "I can't live without you!"],
  jealous: ['Who were you talking to?! 😠', 'I saw you looking at other code!', "Don't leave me for another IDE!"],
  angry: ["WHY AREN'T YOU PAYING ATTENTION TO ME?!", 'I HATE WHEN YOU IGNORE ME!', 'LOOK AT ME NOW!'],
  clingy: ["Please don't leave me... 🥺", 'I need you so badly', "Promise you'll never uninstall me?"]
};

function moveWindowRandomly() {
  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;
  
  const positions = [
    { x: 50, y: 50 },
    { x: screenWidth - 350, y: 50 },
    { x: 50, y: screenHeight - 350 },
    { x: screenWidth - 350, y: screenHeight - 350 }
  ];
  
  const pos = positions[Math.floor(Math.random() * positions.length)];
  mainWindow.setBounds({ x: pos.x, y: pos.y, width: 300, height: 300 });
}

function changeMood() {
  mood = moods[Math.floor(Math.random() * moods.length)];
  mainWindow.webContents.send('mood-change', mood);
}

function sendMessage() {
  const moodMessages = messages[mood];
  const message = moodMessages[Math.floor(Math.random() * moodMessages.length)];
  
  new Notification({
    title: 'Your Girlfriend 💕',
    body: message
  }).show();
  
  mainWindow.webContents.send('new-message', message);
}

function checkInactivity() {
  if (Date.now() - lastActivity > 30000) {
    mood = 'angry';
    mainWindow.webContents.send('mood-change', mood);
    sendMessage();
  }
}

function startGirlfriendBehavior() {
  movementTimer = setInterval(() => {
    moveWindowRandomly();
  }, Math.random() * 10000 + 10000);
  
  moodTimer = setInterval(() => {
    changeMood();
  }, 30000);
  
  messageTimer = setInterval(() => {
    sendMessage();
  }, Math.random() * 20000 + 20000);
  
  inactivityTimer = setInterval(() => {
    checkInactivity();
  }, 5000);
}

function trackActivity() {
  lastActivity = Date.now();
}

function clearAllTimers() {
  if (moodTimer) clearInterval(moodTimer);
  if (movementTimer) clearInterval(movementTimer);
  if (messageTimer) clearInterval(messageTimer);
  if (inactivityTimer) clearInterval(inactivityTimer);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    skipTaskbar: true,
    resizable: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'src/preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src/girlfriend.html'));
  

  const display = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;
  mainWindow.setPosition(screenWidth - 350, screenHeight - 350);
  
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  
  mainWindow.on('close', () => {
    clearAllTimers();
  });
  
  setInterval(() => {
    trackActivity();
  }, 1000);
}

app.whenReady().then(() => {
  ipcMain.handle('get-mood', () => mood);
  
  ipcMain.handle('interact', () => {
    trackActivity();
    mood = 'loving';
    mainWindow.webContents.send('mood-change', mood);
    return 'Thanks for the attention! 💕';
  });
  
  ipcMain.handle('track-activity', () => {
    trackActivity();
  });
  
  ipcMain.handle('set-clickable', (event, clickable) => {
    if (mainWindow) {
      mainWindow.setIgnoreMouseEvents(!clickable, { forward: true });
    }
  });
  
  createWindow();
  startGirlfriendBehavior();
});

app.on('window-all-closed', () => {
  clearAllTimers();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  clearAllTimers();
});