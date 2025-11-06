const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, 'build', 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false  // Allow loading local video files
    },
    title: 'EduMate',
    backgroundColor: '#0f0f0f'
  });

  // Disable GPU to fix the crash
  app.commandLine.appendSwitch('disable-gpu');
  app.commandLine.appendSwitch('disable-software-rasterizer');

  mainWindow.loadFile('index.html');
  
  // Open DevTools in development (comment out in production)
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle directory selection
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

// Handle file selection
ipcMain.handle('select-file', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: options.filters || []
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

// Handle directory scanning
ipcMain.handle('scan-directory', async (event, dirPath) => {
  try {
    const courses = [];
    const courseNames = await fs.readdir(dirPath);

    for (const courseName of courseNames) {
      const coursePath = path.join(dirPath, courseName);
      const courseStat = await fs.stat(coursePath);
      
      if (!courseStat.isDirectory()) continue;

      const modules = [];
      const moduleNames = await fs.readdir(coursePath);

      for (const moduleName of moduleNames) {
        const modulePath = path.join(coursePath, moduleName);
        const moduleStat = await fs.stat(modulePath);
        
        if (!moduleStat.isDirectory()) continue;

        const items = [];
        const fileNames = await fs.readdir(modulePath);

        for (const fileName of fileNames) {
          const ext = path.extname(fileName).toLowerCase().substring(1);
          const type = ['mp4', 'mkv', 'avi', 'webm', 'mov'].includes(ext) ? 'video' :
                     ext === 'pdf' ? 'pdf' :
                     ['srt', 'vtt'].includes(ext) ? 'subtitle' : 'other';
          
          if (type !== 'other') {
            items.push({
              name: fileName,
              path: path.join(modulePath, fileName),
              type: type
            });
          }
        }

        if (items.length > 0) {
          items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
          modules.push({
            name: moduleName,
            path: modulePath,
            items: items
          });
        }
      }

      if (modules.length > 0) {
        modules.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        courses.push({
          name: courseName,
          path: coursePath,
          modules: modules
        });
      }
    }

    return courses;
  } catch (error) {
    throw new Error(`Failed to scan directory: ${error.message}`);
  }
});

// Handle file reading for video/pdf (return as base64)
ipcMain.handle('get-file-url', async (event, filePath) => {
  try {
    // Return the file path with file:// protocol
    return `file://${filePath}`;
  } catch (error) {
    throw new Error(`Failed to get file URL: ${error.message}`);
  }
});

// Handle subtitle reading (as text)
ipcMain.handle('read-subtitle', async (event, filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    throw new Error(`Failed to read subtitle: ${error.message}`);
  }
});
