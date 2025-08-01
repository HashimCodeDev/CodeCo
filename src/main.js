const {
	app,
	BrowserWindow,
	ipcMain,
	dialog,
	Notification,
} = require("electron");
const path = require("path");
const fs = require("fs");

if (require("electron-squirrel-startup")) app.quit();

let mainWindow;
let mood = "loving"; // loving, jealous, angry, clingy
let affection = 100;
let moodTimer;
let movementTimer;
let messageTimer;
let inactivityTimer;
let lastActivity = Date.now();
let closeAttempts = 0;
const moods = ["loving", "jealous", "angry", "clingy"];
const messages = {
  loving: ["💕 I love you so much!", "You're my everything! 😍", "I can't live without you!"],
  jealous: ["Who were you talking to?! 😠", "I saw you looking at other code!", "Don't leave me for another IDE!"],
  angry: ["WHY AREN'T YOU PAYING ATTENTION TO ME?!", "I HATE WHEN YOU IGNORE ME!", "LOOK AT ME NOW!"],
  clingy: ["Please don't leave me... 🥺", "I need you so badly", "Promise you'll never uninstall me?"]
};

// Random window movement (less aggressive)
function moveWindowRandomly() {
	const { screen } = require('electron');
	const display = screen.getPrimaryDisplay();
	const { width: screenWidth, height: screenHeight } = display.workAreaSize;
	
	// Stay in corners/edges, don't block center of screen
	const positions = [
		{ x: 50, y: 50 }, // top-left
		{ x: screenWidth - 350, y: 50 }, // top-right
		{ x: 50, y: screenHeight - 350 }, // bottom-left
		{ x: screenWidth - 350, y: screenHeight - 350 } // bottom-right
	];
	
	const pos = positions[Math.floor(Math.random() * positions.length)];
	mainWindow.setBounds({ x: pos.x, y: pos.y, width: 300, height: 300 });
}

// Change mood randomly
function changeMood() {
	mood = moods[Math.floor(Math.random() * moods.length)];
	mainWindow.webContents.send("mood-change", mood);
}

// Send clingy message
function sendMessage() {
	const moodMessages = messages[mood];
	const message = moodMessages[Math.floor(Math.random() * moodMessages.length)];
	
	new Notification({
		title: "Your Girlfriend 💕",
		body: message
	}).show();
	
	mainWindow.webContents.send("new-message", message);
}

// Check for inactivity
function checkInactivity() {
	if (Date.now() - lastActivity > 30000) { // 30 seconds
		mood = "angry";
		mainWindow.webContents.send("mood-change", mood);
		// Only send message, don't move window aggressively
		sendMessage();
	}
}

// Show initial dialog
async function showInitialDialog() {
	const result = await dialog.showMessageBox(mainWindow, {
		type: "info",
		title: "Your New Girlfriend! 💕",
		message: "Hi baby! I'm your new girlfriend and I'll NEVER leave you alone! 😍\n\nI'll always be watching... I mean, loving you! 💕",
		buttons: ["Try to escape", "Accept your fate"],
		defaultId: 1,
		cancelId: 0,
	});

	if (result.response === 0) {
		await dialog.showMessageBox(mainWindow, {
			type: "warning",
			title: "No escape! 😈",
			message: "You can't escape from true love! I'll always find you! 💕",
			buttons: ["OK"]
		});
	}
}



// Start all girlfriend behaviors
function startGirlfriendBehavior() {
	// Random window movement every 10-20 seconds (less frequent)
	movementTimer = setInterval(() => {
		moveWindowRandomly();
	}, Math.random() * 10000 + 10000);
	
	// Mood changes every 30 seconds
	moodTimer = setInterval(() => {
		changeMood();
	}, 30000);
	
	// Send messages every 20-40 seconds
	messageTimer = setInterval(() => {
		sendMessage();
	}, Math.random() * 20000 + 20000);
	
	// Check for inactivity every 5 seconds
	inactivityTimer = setInterval(() => {
		checkInactivity();
	}, 5000);
}

// Track user activity
function trackActivity() {
	lastActivity = Date.now();
}

// Clear all timers
function clearAllTimers() {
	if (moodTimer) clearInterval(moodTimer);
	if (movementTimer) clearInterval(movementTimer);
	if (messageTimer) clearInterval(messageTimer);
	if (inactivityTimer) clearInterval(inactivityTimer);
}

// Create window
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 300,
		height: 300,
		frame: false,
		transparent: true,
		alwaysOnTop: false, // Don't always stay on top
		skipTaskbar: true,
		resizable: false,
		focusable: false, // Don't steal focus
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.loadFile(path.join(__dirname, "girlfriend.html"));
	
	// Position in bottom-right corner initially
	const { screen } = require('electron');
	const display = screen.getPrimaryDisplay();
	const { width: screenWidth, height: screenHeight } = display.workAreaSize;
	mainWindow.setPosition(screenWidth - 350, screenHeight - 350);
	

	
	// Handle close attempts
	mainWindow.on('close', () => {
		clearAllTimers();
	});
	
	// Track activity globally, not just in window
	setInterval(() => {
		trackActivity();
	}, 1000);
}

// IPC handlers
ipcMain.handle("get-mood", () => mood);

ipcMain.handle("interact", () => {
	trackActivity();
	mood = "loving";
	mainWindow.webContents.send("mood-change", mood);
	return "Thanks for the attention! 💕";
});

ipcMain.handle("track-activity", () => {
	trackActivity();
});



ipcMain.handle("give-item", (event, item) => {
	const affectionBonus = { rose: 15, gift: 25, chocolate: 10 };
	affection = Math.min(100, affection + affectionBonus[item]);
	mood = "loving";
	mainWindow.webContents.send("mood-change", mood);
	return affection;
});



// App events
app.whenReady().then(async () => {
	createWindow();
	await showInitialDialog();
	startGirlfriendBehavior();
});

app.on("window-all-closed", () => {
	clearAllTimers();
	// scheduleRestart(); // Disabled
	if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
	clearAllTimers();
});
