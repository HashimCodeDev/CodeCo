const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getMood: () => ipcRenderer.invoke('get-mood'),
  interact: () => ipcRenderer.invoke('interact'),
  trackActivity: () => ipcRenderer.invoke('track-activity'),
  setClickable: (clickable) => ipcRenderer.invoke('set-clickable', clickable),
  onMoodChange: (callback) => ipcRenderer.on('mood-change', (event, mood) => callback(mood)),
  onNewMessage: (callback) => ipcRenderer.on('new-message', (event, message) => callback(message))
});