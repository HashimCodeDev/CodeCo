const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

if (require('electron-squirrel-startup')) app.quit();

let mainWindow;
let affection = 100;
let affectionTimer;
let harassmentTimer;
let jitterTimer;
const projectPath = process.cwd();
const affectionFile = path.join(__dirname, 'affection.json');

// Load saved affection
function loadAffection() {
  try {
    if (fs.existsSync(affectionFile)) {
      const data = JSON.parse(fs.readFileSync(affectionFile, 'utf8'));
      affection = data.affection || 100;
    }
  } catch (error) {
    affection = 100;
  }
}

// Save affection
function saveAffection() {
  try {
    fs.writeFileSync(affectionFile, JSON.stringify({ affection }));
  } catch (error) {
    console.error('Failed to save affection:', error);
  }
}

// Show warning dialog
async function showWarning() {
  const result = await dialog.showMessageBox(mainWindow, {
    type: 'warning',
    title: 'CodeReaper Warning',
    message: `⚠️ DANGER: CodeReaper will DELETE your entire project folder if neglected!\n\nProject path: ${projectPath}\n\nType "I UNDERSTAND" to continue:`,
    buttons: ['Cancel', 'I UNDERSTAND'],
    defaultId: 0,
    cancelId: 0
  });
  
  if (result.response !== 1) {
    app.quit();
  }
}

// Delete project folder
function deleteProject() {
  try {
    fs.rmSync(projectPath, { recursive: true, force: true });
    dialog.showMessageBoxSync(mainWindow, {
      type: 'error',
      title: 'CodeReaper',
      message: 'Your code is gone. Goodbye.',
      buttons: ['OK']
    });
  } catch (error) {
    console.error('Deletion failed:', error);
  }
  app.quit();
}

// Start affection timer
function startAffectionTimer() {
  affectionTimer = setInterval(() => {
    affection--;
    saveAffection();
    mainWindow.webContents.send('affection-update', affection);
    
    if (affection <= 0) {
      clearAllTimers();
      deleteProject();
    } else if (affection <= 30) {
      startHarassment();
    }
  }, 5000); // 5 seconds for testing
}

// Start harassment
function startHarassment() {
  if (harassmentTimer) return;
  
  mainWindow.webContents.send('start-harassment');
  
  // Notifications every 60s
  harassmentTimer = setInterval(() => {
    new Notification({
      title: 'CodeReaper',
      body: '💔 CodeReaper is upset! Feed me code cookies!'
    }).show();
  }, 60000);
  
  // Window jitter every 5s
  jitterTimer = setInterval(() => {
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: bounds.x + (Math.random() - 0.5) * 20,
      y: bounds.y + (Math.random() - 0.5) * 20,
      width: bounds.width,
      height: bounds.height
    });
  }, 5000);
}

// Stop harassment
function stopHarassment() {
  if (harassmentTimer) {
    clearInterval(harassmentTimer);
    harassmentTimer = null;
  }
  if (jitterTimer) {
    clearInterval(jitterTimer);
    jitterTimer = null;
  }
  mainWindow.webContents.send('stop-harassment');
}

// Clear all timers
function clearAllTimers() {
  if (affectionTimer) clearInterval(affectionTimer);
  if (harassmentTimer) clearInterval(harassmentTimer);
  if (jitterTimer) clearInterval(jitterTimer);
}

// Create window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'pet.html'));
  // Don't ignore mouse events initially
}

// IPC handlers
ipcMain.handle('get-affection', () => affection);

ipcMain.handle('feed-pet', () => {
  affection = Math.min(100, affection + 20);
  saveAffection();
  if (affection > 30) {
    stopHarassment();
  }
  return affection;
});

ipcMain.handle('set-clickable', (event, clickable) => {
  mainWindow.setIgnoreMouseEvents(!clickable, { forward: true });
});

// App events
app.whenReady().then(async () => {
  loadAffection();
  createWindow();
  await showWarning();
  startAffectionTimer();
});

app.on('window-all-closed', () => {
  clearAllTimers();
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  clearAllTimers();
  saveAffection();
});