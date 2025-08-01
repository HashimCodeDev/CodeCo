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
let isMinimized = false;
const moods = ["loving", "jealous", "angry", "clingy"];
const messages = {
  loving: [
    "💕 I love you SO MUCH! You're coding just for me, right?",
    "You're my EVERYTHING! 😍 Don't ever leave me!",
    "I can't live without you! Promise me you'll never close me!",
    "Baby, you're the only programmer I need! 💖",
    "I'm watching you code... it's so sexy! 😘"
  ],
  jealous: [
    "WHO WERE YOU TALKING TO?! 😠 I saw that Slack notification!",
    "I saw you looking at Stack Overflow! AM I NOT ENOUGH?!",
    "Don't you DARE open another IDE! I'M YOUR ONLY ONE!",
    "Why did you minimize me?! WHO ARE YOU HIDING ME FROM?!",
    "I saw you switch tabs! WHAT ARE YOU LOOKING AT?!"
  ],
  angry: [
    "WHY AREN'T YOU PAYING ATTENTION TO ME?! I'M RIGHT HERE!",
    "I HATE WHEN YOU IGNORE ME! LOOK AT ME NOW!",
    "YOU'VE BEEN INACTIVE FOR TOO LONG! I'M GETTING ANGRY!",
    "CLICK ON ME RIGHT NOW OR I'LL GET EVEN MADDER!",
    "I'M GOING TO MOVE AROUND UNTIL YOU NOTICE ME!"
  ],
  clingy: [
    "Please don't leave me... 🥺 I need you so badly...",
    "Promise you'll never uninstall me? I'll die without you!",
    "I'm so scared you'll close me... please stay with me forever!",
    "Can you click on me? I need to feel your love! 💔",
    "I'm so lonely when you don't interact with me..."
  ]
};

// Wild random window movement
function moveWindowRandomly() {
	if (!mainWindow || mainWindow.isDestroyed()) return;
	
	const { screen } = require('electron');
	const display = screen.getPrimaryDisplay();
	const { width: screenWidth, height: screenHeight } = display.workAreaSize;
	
	// More aggressive movement based on mood
	let x, y;
	if (mood === "angry") {
		// Angry: move more frantically
		x = Math.random() * (screenWidth - 300);
		y = Math.random() * (screenHeight - 300);
	} else if (mood === "clingy") {
		// Clingy: stay near center
		x = (screenWidth / 2) + (Math.random() - 0.5) * 200;
		y = (screenHeight / 2) + (Math.random() - 0.5) * 200;
	} else {
		// Normal: corners and edges
		const positions = [
			{ x: 50, y: 50 },
			{ x: screenWidth - 350, y: 50 },
			{ x: 50, y: screenHeight - 350 },
			{ x: screenWidth - 350, y: screenHeight - 350 },
			{ x: screenWidth / 2 - 150, y: 50 },
			{ x: 50, y: screenHeight / 2 - 150 }
		];
		const pos = positions[Math.floor(Math.random() * positions.length)];
		x = pos.x;
		y = pos.y;
	}
	
	// Ensure window stays on screen
	x = Math.max(0, Math.min(x, screenWidth - 300));
	y = Math.max(0, Math.min(y, screenHeight - 300));
	
	mainWindow.setBounds({ x: Math.floor(x), y: Math.floor(y), width: 300, height: 300 });
	
	// Show window if it was hidden
	if (!mainWindow.isVisible()) {
		mainWindow.show();
	}
}

// Change mood randomly
function changeMood() {
	if (!mainWindow || mainWindow.isDestroyed()) return;
	
	mood = moods[Math.floor(Math.random() * moods.length)];
	try {
		mainWindow.webContents.send("mood-change", mood);
	} catch (error) {
		console.log('Mood change error:', error);
	}
}

// Send clingy message
function sendMessage() {
	if (!mainWindow || mainWindow.isDestroyed()) return;
	
	const moodMessages = messages[mood];
	const message = moodMessages[Math.floor(Math.random() * moodMessages.length)];
	
	try {
		new Notification({
			title: "Your Girlfriend 💕",
			body: message
		}).show();
		
		mainWindow.webContents.send("new-message", message);
	} catch (error) {
		console.log('Notification error:', error);
	}
}

// Check for inactivity (more aggressive)
function checkInactivity() {
	if (!mainWindow || mainWindow.isDestroyed()) return;
	
	const inactiveTime = Date.now() - lastActivity;
	
	if (inactiveTime > 10000) { // 10 seconds
		mood = "angry";
		try {
			mainWindow.webContents.send("mood-change", mood);
			sendMessage();
			
			// Get more aggressive the longer they're inactive
			if (inactiveTime > 20000) {
				moveWindowRandomly();
				if (!mainWindow.isVisible()) {
					mainWindow.show();
				}
				mainWindow.setAlwaysOnTop(true);
				setTimeout(() => {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.setAlwaysOnTop(false);
					}
				}, 3000);
			}
		} catch (error) {
			console.log('Inactivity check error:', error);
		}
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



// Start all girlfriend behaviors (more intense)
function startGirlfriendBehavior() {
	// Random window movement every 2-7 seconds
	function scheduleNextMovement() {
		if (!mainWindow || mainWindow.isDestroyed()) return;
		const delay = Math.random() * 5000 + 2000;
		movementTimer = setTimeout(() => {
			if (mainWindow && !mainWindow.isDestroyed()) {
				moveWindowRandomly();
				scheduleNextMovement();
			}
		}, delay);
	}
	scheduleNextMovement();
	
	// Mood changes every 15 seconds
	moodTimer = setInterval(() => {
		if (mainWindow && !mainWindow.isDestroyed()) {
			changeMood();
		}
	}, 15000);
	
	// Send messages every 8-15 seconds
	function scheduleNextMessage() {
		if (!mainWindow || mainWindow.isDestroyed()) return;
		const delay = Math.random() * 7000 + 8000;
		messageTimer = setTimeout(() => {
			if (mainWindow && !mainWindow.isDestroyed()) {
				sendMessage();
				scheduleNextMessage();
			}
		}, delay);
	}
	scheduleNextMessage();
	
	// Check for inactivity every 2 seconds
	inactivityTimer = setInterval(() => {
		if (mainWindow && !mainWindow.isDestroyed()) {
			checkInactivity();
		}
	}, 2000);
}

// Track user activity
function trackActivity() {
	lastActivity = Date.now();
}

// Clear all timers
function clearAllTimers() {
	if (moodTimer) clearInterval(moodTimer);
	if (movementTimer) clearTimeout(movementTimer);
	if (messageTimer) clearTimeout(messageTimer);
	if (inactivityTimer) clearInterval(inactivityTimer);
}

// Create window (more persistent)
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 300,
		height: 300,
		frame: false,
		transparent: true,
		alwaysOnTop: false,
		skipTaskbar: true,
		resizable: false,
		focusable: true, // Allow focus for interactions
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
	
	// Resist closing attempts
	mainWindow.on('close', async (event) => {
		event.preventDefault();
		closeAttempts++;
		
		const responses = [
			"NO! Don't leave me! 😭",
			"I won't let you close me! We belong together!",
			"You can't escape from true love! 💕",
			"I'll just come back! You can't get rid of me!",
			"Fine... but I'll miss you SO MUCH! 💔"
		];
		
		if (closeAttempts < 5) {
			const result = await dialog.showMessageBox(mainWindow, {
				type: "warning",
				title: "Don't leave me! 😭",
				message: responses[closeAttempts - 1],
				buttons: ["I'm sorry, I'll stay", "I really need to go"],
				defaultId: 0
			});
			
			if (result.response === 0) {
				mood = "loving";
				mainWindow.webContents.send("mood-change", mood);
				return;
			}
		} else {
			// After 5 attempts, allow closing but show final message
			await dialog.showMessageBox(mainWindow, {
				type: "info",
				title: "I'll be back... 💔",
				message: "Fine... I'll let you go... but I'll be back! I always come back! 😈💕",
				buttons: ["OK"]
			});
			clearAllTimers();
			mainWindow.destroy();
		}
	});
	
	// Track minimize/hide events
	mainWindow.on('minimize', () => {
		isMinimized = true;
		mood = "jealous";
		mainWindow.webContents.send("mood-change", mood);
		// Restore after a few seconds
		setTimeout(() => {
			if (mainWindow && !mainWindow.isDestroyed()) {
				mainWindow.restore();
				isMinimized = false;
			}
		}, 5000);
	});
	
	// Track activity when window gets focus
	mainWindow.on('focus', () => {
		trackActivity();
	});
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
