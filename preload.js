const { contextBridge, ipcRenderer } = require('electron');

// Note: Removed direct dependency on @vitalets/google-translate-api because
// it caused runtime errors in some environments. If you want to provide a
// native translation implementation via the main process, add an IPC handler
// for 'translate' in the main process and re-expose it here.

contextBridge.exposeInMainWorld('electronAPI', {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFile: (options) => ipcRenderer.invoke('select-file', options),
  scanDirectory: (path) => ipcRenderer.invoke('scan-directory', path),
  getFileUrl: (path) => ipcRenderer.invoke('get-file-url', path),
  readSubtitle: (path) => ipcRenderer.invoke('read-subtitle', path)
});

