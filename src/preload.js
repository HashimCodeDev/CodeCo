const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onWindowMoved: (callback) => ipcRenderer.on("window-moved", callback),
	onMoodChange: (callback) => ipcRenderer.on("mood-change", callback),
	onUserInactive: (callback) => ipcRenderer.on("user-inactive", callback),
	onCodeFileDetected: (callback) =>
		ipcRenderer.on("code-file-detected", callback),
	reportActivity: () => ipcRenderer.send("user-activity"),
	messWithScreen: () => ipcRenderer.invoke("mess-with-screen"),
	quitApp: () => ipcRenderer.invoke("quit-app"),
});
