import { app, BrowserWindow, shell, Menu } from 'electron';
import { release } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerFileHandlers } from './ipc/file-handler.js';
import { registerExportHandlers } from './ipc/export-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.DIST = join(__dirname, '../../renderer/dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(__dirname, '../../renderer/public');

if (release().startsWith('6.1')) app.disableHardwareAcceleration();

if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const url = 'http://localhost:5174';
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'MacDown',
    icon: join(process.env.PUBLIC!, 'favicon.ico'),
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
    },
  });

  if (app.isPackaged) {
    await win.loadFile(indexHtml);
  } else {
    await win.loadURL(url);
    win.webContents.openDevTools();
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  // 註冊 IPC handlers
  registerFileHandlers();
  registerExportHandlers();

  // 建立選單
  createMenu();

  // 建立視窗
  createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

function createMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            if (win) {
              win.webContents.send('menu:openFile');
            }
          },
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            if (win) {
              win.webContents.send('menu:saveFile');
            }
          },
        },
        {
          label: 'Save As...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click: () => {
            if (win) {
              win.webContents.send('menu:saveFileAs');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Export as HTML...',
          accelerator: 'CmdOrCtrl+Shift+H',
          click: () => {
            if (win) {
              win.webContents.send('menu:exportHTML');
            }
          },
        },
        {
          label: 'Export as PDF...',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => {
            if (win) {
              win.webContents.send('menu:exportPDF');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
