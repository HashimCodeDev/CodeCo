const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onWindowMoved: (callback) => ipcRenderer.on("window-moved", callback),
	onMoodChange: (callback) => ipcRenderer.on("mood-change", callback),
	onUserInactive: (callback) => ipcRenderer.on("user-inactive", callback),
	onCodeFileDetected: (callback) =>
		ipcRenderer.on("code-file-detected", callback),
	onWindowsClosedDramatically: (callback) => ipcRenderer.on("windows-closed-dramatically", callback),
	reportActivity: () => ipcRenderer.send("user-activity"),
	messWithScreen: () => ipcRenderer.invoke("mess-with-screen"),
	closeAllWindows: () => ipcRenderer.invoke("close-all-windows"),
	quitApp: () => ipcRenderer.invoke("quit-app"),
	startDrag: (x, y) => ipcRenderer.send("start-drag", x, y),
	updateDrag: (x, y) => ipcRenderer.send("update-drag", x, y),
	endDrag: () => ipcRenderer.send("end-drag"),
	updateAffection: (affection) => ipcRenderer.send("update-affection", affection),
});
