const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getAffection: () => ipcRenderer.invoke('get-affection'),
  feedPet: () => ipcRenderer.invoke('feed-pet'),
  setClickable: (clickable) => ipcRenderer.invoke('set-clickable', clickable),
  onAffectionUpdate: (callback) => ipcRenderer.on('affection-update', callback),
  onStartHarassment: (callback) => ipcRenderer.on('start-harassment', callback),
  onStopHarassment: (callback) => ipcRenderer.on('stop-harassment', callback)
});