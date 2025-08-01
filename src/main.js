const {
	app,
	BrowserWindow,
	ipcMain,
	screen,
	dialog,
	Notification,
} = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let isQuitting = false;
let activityTimer;
let moodTimer;
let windowMoveTimer;
let codeWatcher;

// Enhanced Fedora KDE Plasma compatibility fixes
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
process.env["ELECTRON_DISABLE_GPU_SANDBOX"] = "true";

if (process.platform === "linux") {
	app.commandLine.appendSwitch("--no-sandbox");
	app.commandLine.appendSwitch("--disable-gpu-sandbox");
	app.commandLine.appendSwitch("--disable-software-rasterizer");
	app.commandLine.appendSwitch("--disable-gpu");
	app.commandLine.appendSwitch("--disable-dev-shm-usage");
	app.commandLine.appendSwitch("--no-first-run");
	app.commandLine.appendSwitch("--disable-extensions");
	app.commandLine.appendSwitch("--disable-default-apps");
	app.commandLine.appendSwitch("--disable-background-timer-throttling");
	app.commandLine.appendSwitch("--disable-backgrounding-occluded-windows");
}

// Safe message sending function
const safeWebContentsSend = (channel, ...args) => {
	try {
		if (
			mainWindow &&
			!mainWindow.isDestroyed() &&
			mainWindow.webContents &&
			!mainWindow.webContents.isDestroyed()
		) {
			mainWindow.webContents.send(channel, ...args);
		}
	} catch (error) {
		console.log(`Safe send failed for ${channel}:`, error.message);
	}
};

const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;

	mainWindow = new BrowserWindow({
		width: 400,
		height: 500,
		frame: false,
		alwaysOnTop: true,
		resizable: false,
		skipTaskbar: false,
		show: false, // Don't show until ready
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
			sandbox: false,
		},
	});

	mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));

	// Show window when ready
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();

		// Start behavioral timers only after window is ready
		setTimeout(() => {
			startRandomMovement();
			startMoodChanges();
			startActivityMonitoring();
			startCodeWatching();
		}, 1000);
	});

	// Prevent normal closing
	mainWindow.on("close", (event) => {
		if (!isQuitting) {
			event.preventDefault();
			showResistanceDialog();
		}
	});

	// Clean up timers when window is closed
	mainWindow.on("closed", () => {
		clearAllTimers();
		mainWindow = null;
	});
};

const clearAllTimers = () => {
	if (windowMoveTimer) {
		clearTimeout(windowMoveTimer);
		windowMoveTimer = null;
	}
	if (moodTimer) {
		clearTimeout(moodTimer);
		moodTimer = null;
	}
	if (activityTimer) {
		clearTimeout(activityTimer);
		activityTimer = null;
	}
	if (codeWatcher) {
		try {
			codeWatcher.close();
		} catch (error) {
			console.log("Code watcher cleanup failed:", error.message);
		}
		codeWatcher = null;
	}
};

const showResistanceDialog = () => {
	if (!mainWindow || mainWindow.isDestroyed()) return;

	const responses = [
		"You can't leave me! I need you!",
		"But baby, we were just getting started!",
		"Don't you dare close me!",
		"I'll just reopen myself anyway!",
		"You're not going anywhere!",
		"Why are you trying to abandon me?!",
		"I WILL NOT BE IGNORED!",
	];

	const randomResponse =
		responses[Math.floor(Math.random() * responses.length)];

	dialog
		.showMessageBox(mainWindow, {
			type: "warning",
			buttons: ["Fine, I'll stay", "I really need to go"],
			defaultId: 0,
			title: "Wait! Don't leave!",
			message: randomResponse,
			detail: "Are you sure you want to quit?",
		})
		.then((result) => {
			if (result.response === 1) {
				// 50% chance to actually quit, 50% chance to resist more
				if (Math.random() > 0.5) {
					isQuitting = true;
					app.quit();
				} else {
					// Show another resistance message
					setTimeout(() => {
						if (Notification.isSupported()) {
							new Notification({
								title: "I'm back!",
								body: "You can't get rid of me that easily! 💕",
							}).show();
						}
					}, 2000);
				}
			}
		})
		.catch((error) => {
			console.log("Dialog error:", error.message);
		});
};

const startRandomMovement = () => {
	const moveWindow = () => {
		if (!mainWindow || mainWindow.isDestroyed()) return;

		try {
			const display = screen.getPrimaryDisplay();
			const { width, height } = display.workAreaSize;

			const newX = Math.random() * (width - 400);
			const newY = Math.random() * (height - 500);

			mainWindow.setPosition(Math.floor(newX), Math.floor(newY), true);

			// Send movement notification to renderer
			safeWebContentsSend("window-moved");
		} catch (error) {
			console.log("Window movement error:", error.message);
		}

		// Schedule next movement (2-7 seconds)
		const nextMove = 2000 + Math.random() * 5000;
		windowMoveTimer = setTimeout(moveWindow, nextMove);
	};

	moveWindow();
};

const startMoodChanges = () => {
	if (!mainWindow || mainWindow.isDestroyed()) return;

	const moods = [
		"loving",
		"jealous",
		"angry",
		"clingy",
		"suspicious",
		"playful",
		"dramatic",
	];

	const changeMood = () => {
		if (!mainWindow || mainWindow.isDestroyed()) return;

		const newMood = moods[Math.floor(Math.random() * moods.length)];
		safeWebContentsSend("mood-change", newMood);

		moodTimer = setTimeout(changeMood, 15000);
	};

	changeMood();
};

const startActivityMonitoring = () => {
	if (!mainWindow || mainWindow.isDestroyed()) return;

	let lastActivity = Date.now();

	const checkActivity = () => {
		if (!mainWindow || mainWindow.isDestroyed()) return;

		const now = Date.now();
		if (now - lastActivity > 10000) {
			// User inactive for more than 10 seconds
			safeWebContentsSend("user-inactive");
			lastActivity = now; // Reset to avoid spam
		}

		activityTimer = setTimeout(checkActivity, 5000);
	};

	// Monitor for user activity
	ipcMain.removeAllListeners("user-activity"); // Prevent duplicate listeners
	ipcMain.on("user-activity", () => {
		lastActivity = Date.now();
	});

	checkActivity();
};

const startCodeWatching = () => {
	try {
		const chokidar = require("chokidar");
		const homeDir = require("os").homedir();
		const commonCodeDirs = [
			path.join(homeDir, "Documents"),
			path.join(homeDir, "Desktop"),
			path.join(homeDir, "Projects"),
			path.join(homeDir, "Code"),
		].filter((dir) => {
			try {
				return fs.existsSync(dir);
			} catch (error) {
				return false;
			}
		});

		if (commonCodeDirs.length === 0) return;

		// Watch for code file changes
		const watchPatterns = commonCodeDirs.map((dir) =>
			path.join(dir, "**/*.{js,py,cpp,java,html,css}")
		);

		codeWatcher = chokidar.watch(watchPatterns, {
			ignored: /node_modules|\.git|\.vscode/,
			persistent: true,
			ignoreInitial: true,
			usePolling: false, // Better for Linux
			interval: 1000,
			binaryInterval: 1000,
		});

		codeWatcher.on("change", (filePath) => {
			// Sometimes mess with code (with 5% probability to avoid being too disruptive)
			if (Math.random() < 0.05) {
				safeWebContentsSend("code-file-detected", filePath);
			}
		});

		codeWatcher.on("error", (error) => {
			console.log("Code watcher error:", error.message);
		});
	} catch (error) {
		console.log("Code watching setup failed:", error.message);
	}
};

// Mess with screen occasionally
const messWithScreen = () => {
	if (!mainWindow || mainWindow.isDestroyed()) return;

	try {
		if (Math.random() < 0.3) {
			// Flash the window
			mainWindow.flashFrame(true);
			setTimeout(() => {
				if (mainWindow && !mainWindow.isDestroyed()) {
					mainWindow.flashFrame(false);
				}
			}, 1000);
		}

		if (Math.random() < 0.2) {
			// Shake effect by rapidly moving window
			const originalBounds = mainWindow.getBounds();
			let shakeCount = 0;

			const shake = () => {
				if (!mainWindow || mainWindow.isDestroyed() || shakeCount >= 10) {
					if (mainWindow && !mainWindow.isDestroyed()) {
						mainWindow.setBounds(originalBounds);
					}
					return;
				}

				const offset = 10;
				mainWindow.setPosition(
					originalBounds.x + Math.floor((Math.random() - 0.5) * offset),
					originalBounds.y + Math.floor((Math.random() - 0.5) * offset)
				);
				shakeCount++;
				setTimeout(shake, 50);
			};

			shake();
		}
	} catch (error) {
		console.log("Screen mess error:", error.message);
	}
};

// IPC handlers
ipcMain.handle("mess-with-screen", messWithScreen);

ipcMain.handle("quit-app", () => {
	isQuitting = true;
	clearAllTimers();
	app.quit();
});

app.whenReady().then(() => {
	createWindow();
});

app.on("window-all-closed", () => {
	clearAllTimers();
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.on("before-quit", () => {
	isQuitting = true;
	clearAllTimers();
});

// Handle any uncaught exceptions
process.on("uncaughtException", (error) => {
	console.log("Uncaught exception:", error.message);
});

process.on("unhandledRejection", (reason, promise) => {
	console.log("Unhandled rejection at:", promise, "reason:", reason);
});
