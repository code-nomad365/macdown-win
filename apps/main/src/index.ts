import { app, BrowserWindow, shell, Menu, ipcMain } from 'electron';
import { release } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerFileHandlers } from './ipc/file-handler.js';
import { registerExportHandlers } from './ipc/export-handler.js';
import { registerLibraryHandlers } from './ipc/library-handler.js';
import { registerPrintHandlers } from './ipc/print-handler.js';
import { initDatabase, closeDatabase } from './database/db.js';
import { getRecentFiles, addRecentFile, clearRecentFiles } from './utils/recentFiles.js';

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
let currentViewMode: 'both' | 'editor-only' | 'preview-only' = 'both';
const url = 'http://localhost:5173';
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
      preload: join(__dirname, 'preload/index.js'),
    },
  });

  // 處理視窗關閉事件
  win.on('close', (e) => {
    // 向渲染進程發送關閉請求
    if (win) {
      e.preventDefault();
      win.webContents.send('window:close-request');
    }
  });

  // 只有在明確設置 DEV 環境變數時才使用開發服務器
  if (process.env.DEV === 'true') {
    await win.loadURL(url);
    win.webContents.openDevTools();
  } else {
    await win.loadFile(indexHtml);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  // 初始化資料庫
  initDatabase();

  // 註冊 IPC handlers
  registerFileHandlers();
  registerExportHandlers();
  registerLibraryHandlers();
  registerPrintHandlers();

  // 註冊視圖模式更新監聽器
  ipcMain.on('view:updateMode', (_event, viewMode: 'both' | 'editor-only' | 'preview-only') => {
    currentViewMode = viewMode;
    createMenu(); // 重新建立選單以更新標籤
  });

  // 註冊最近檔案更新監聽器
  ipcMain.on('recent:addFile', async (_event, filePath: string) => {
    await addRecentFile(filePath);
    createMenu(); // 重新建立選單以更新最近檔案
  });

  // 註冊視窗關閉確認監聽器
  ipcMain.on('window:close-confirmed', () => {
    if (win) {
      win.removeAllListeners('close');
      win.close();
    }
  });

  // 建立選單
  createMenu();

  // 建立視窗
  createWindow();
});

app.on('window-all-closed', () => {
  win = null;
  closeDatabase();
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

async function createMenu() {
  const recentFiles = await getRecentFiles()
  const recentFilesSubmenu: Electron.MenuItemConstructorOptions[] = [
    ...recentFiles.map(file => ({
      label: file.name,
      click: () => {
        if (win) {
          win.webContents.send('menu:openRecentFile', file.path)
        }
      }
    })),
  ]

  // 只有在有檔案時才顯示分隔線和清除選項
  if (recentFiles.length > 0) {
    recentFilesSubmenu.push({ type: 'separator' as const })
  }

  recentFilesSubmenu.push({
    label: 'Clear Recently Opened',
    click: async () => {
      await clearRecentFiles()
      createMenu() // 重建選單
    }
  })

  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (win) {
              win.webContents.send('menu:new');
            }
          },
        },
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
          label: 'Open Recent',
          submenu: recentFilesSubmenu
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            if (win) {
              win.webContents.send('menu:close');
            }
          },
        },
        { type: 'separator' },
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
          label: 'Page Setup',
          click: () => {
            if (win) {
              win.webContents.send('menu:pageSetup');
            }
          },
        },
        {
          label: 'Print',
          accelerator: 'CmdOrCtrl+P',
          click: () => {
            if (win) {
              win.webContents.send('menu:print');
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
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          click: () => {
            if (win) {
              win.webContents.send('menu:undo');
            }
          },
        },
        {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Y',
          click: () => {
            if (win) {
              win.webContents.send('menu:redo');
            }
          },
        },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Find',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            if (win) {
              win.webContents.send('menu:find');
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Copy Rendered HTML',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            if (win) {
              win.webContents.send('menu:copyHTML');
            }
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Appearance',
          submenu: [
            {
              label: 'Themes',
              submenu: [
                {
                  label: 'Light Themes',
                  submenu: [
                    { label: '明亮 (Light)', click: () => win?.webContents.send('menu:setTheme', 'light') },
                    { label: '杯子蛋糕 (Cupcake)', click: () => win?.webContents.send('menu:setTheme', 'cupcake') },
                    { label: '大黃蜂 (Bumblebee)', click: () => win?.webContents.send('menu:setTheme', 'bumblebee') },
                    { label: '翡翠綠 (Emerald)', click: () => win?.webContents.send('menu:setTheme', 'emerald') },
                    { label: '企業風 (Corporate)', click: () => win?.webContents.send('menu:setTheme', 'corporate') },
                    { label: '復古 (Retro)', click: () => win?.webContents.send('menu:setTheme', 'retro') },
                    { label: '賽博龐克 (Cyberpunk)', click: () => win?.webContents.send('menu:setTheme', 'cyberpunk') },
                    { label: '情人節 (Valentine)', click: () => win?.webContents.send('menu:setTheme', 'valentine') },
                    { label: '花園 (Garden)', click: () => win?.webContents.send('menu:setTheme', 'garden') },
                    { label: 'Lo-Fi', click: () => win?.webContents.send('menu:setTheme', 'lofi') },
                    { label: '粉彩 (Pastel)', click: () => win?.webContents.send('menu:setTheme', 'pastel') },
                    { label: '幻想 (Fantasy)', click: () => win?.webContents.send('menu:setTheme', 'fantasy') },
                    { label: '線框 (Wireframe)', click: () => win?.webContents.send('menu:setTheme', 'wireframe') },
                    { label: 'CMYK', click: () => win?.webContents.send('menu:setTheme', 'cmyk') },
                    { label: '秋天 (Autumn)', click: () => win?.webContents.send('menu:setTheme', 'autumn') },
                    { label: '酸性 (Acid)', click: () => win?.webContents.send('menu:setTheme', 'acid') },
                    { label: '檸檬水 (Lemonade)', click: () => win?.webContents.send('menu:setTheme', 'lemonade') },
                    { label: '冬天 (Winter)', click: () => win?.webContents.send('menu:setTheme', 'winter') },
                  ],
                },
                {
                  label: 'Dark Themes',
                  submenu: [
                    { label: '深色 (Dark)', click: () => win?.webContents.send('menu:setTheme', 'dark') },
                    { label: '合成波 (Synthwave)', click: () => win?.webContents.send('menu:setTheme', 'synthwave') },
                    { label: '萬聖節 (Halloween)', click: () => win?.webContents.send('menu:setTheme', 'halloween') },
                    { label: '森林 (Forest)', click: () => win?.webContents.send('menu:setTheme', 'forest') },
                    { label: '水藍 (Aqua)', click: () => win?.webContents.send('menu:setTheme', 'aqua') },
                    { label: '黑色 (Black)', click: () => win?.webContents.send('menu:setTheme', 'black') },
                    { label: '奢華 (Luxury)', click: () => win?.webContents.send('menu:setTheme', 'luxury') },
                    { label: '德古拉 (Dracula)', click: () => win?.webContents.send('menu:setTheme', 'dracula') },
                    { label: '商務 (Business)', click: () => win?.webContents.send('menu:setTheme', 'business') },
                    { label: '夜晚 (Night)', click: () => win?.webContents.send('menu:setTheme', 'night') },
                    { label: '咖啡 (Coffee)', click: () => win?.webContents.send('menu:setTheme', 'coffee') },
                    { label: '昏暗 (Dim)', click: () => win?.webContents.send('menu:setTheme', 'dim') },
                    { label: '北歐 (Nord)', click: () => win?.webContents.send('menu:setTheme', 'nord') },
                    { label: '日落 (Sunset)', click: () => win?.webContents.send('menu:setTheme', 'sunset') },
                  ],
                },
              ],
            },
            { type: 'separator' },
            {
              label: 'Toggle Toolbar',
              accelerator: 'CmdOrCtrl+Shift+T',
              click: () => {
                if (win) {
                  win.webContents.send('menu:toggleToolbar');
                }
              },
            },
          ],
        },
        {
          label: 'Layout',
          submenu: [
            {
              label: currentViewMode === 'preview-only' ? 'Show Editor' : 'Hide Editor',
              accelerator: 'CmdOrCtrl+Shift+E',
              click: () => {
                if (win) {
                  win.webContents.send('menu:toggleEditor');
                }
              },
            },
            {
              label: currentViewMode === 'editor-only' ? 'Show Preview' : 'Hide Preview',
              accelerator: 'CmdOrCtrl+Shift+P',
              click: () => {
                if (win) {
                  win.webContents.send('menu:togglePreview');
                }
              },
            },
            { type: 'separator' },
            {
              label: 'Split View',
              submenu: [
                {
                  label: 'Left 1:1 Right',
                  accelerator: 'CmdOrCtrl+1',
                  click: () => {
                    if (win) {
                      win.webContents.send('menu:splitRatio', '1:1');
                    }
                  },
                },
                {
                  label: 'Left 3:1 Right',
                  accelerator: 'CmdOrCtrl+2',
                  click: () => {
                    if (win) {
                      win.webContents.send('menu:splitRatio', '3:1');
                    }
                  },
                },
                {
                  label: 'Left 1:3 Right',
                  accelerator: 'CmdOrCtrl+3',
                  click: () => {
                    if (win) {
                      win.webContents.send('menu:splitRatio', '1:3');
                    }
                  },
                },
              ],
            },
          ],
        },
        { type: 'separator' },
        {
          label: 'Zoom',
          submenu: [
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
          ],
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
          ],
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
