const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const log = require('electron-log');

// Configurar logging
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

class App {
  constructor() {
    this.mainWindow = null;
    this.initializeApp();
  }

  initializeApp() {
    // Evento cuando la app está lista
    app.whenReady().then(() => {
      this.createMainWindow();
      this.setupAppEvents();
      this.setupMenu();
      
      // En macOS, re-crear ventana cuando se hace click en el dock
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createMainWindow();
        }
      });
    });

    // Cerrar app cuando todas las ventanas se cierran (excepto en macOS)
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    // Configuración de seguridad
    app.on('web-contents-created', (event, contents) => {
      contents.on('new-window', (navigationEvent, navigationURL) => {
        navigationEvent.preventDefault();
      });
    });
  }

  createMainWindow() {
    // Configuración de la ventana principal
    this.mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 700,
      show: false, // No mostrar hasta que esté lista
      icon: this.getIconPath(),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        webSecurity: !isDev
      },
      titleBarStyle: 'default',
      backgroundColor: '#2B2B2B', // Color de fondo mientras carga
    });

    // Cargar la aplicación
    const startUrl = isDev 
      ? 'http://localhost:3000' 
      : `file://${path.join(__dirname, '../frontend/build/index.html')}`;
    
    this.mainWindow.loadURL(startUrl);

    // Mostrar ventana cuando esté lista
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow.show();
      
      // Abrir DevTools en desarrollo
      if (isDev) {
        this.mainWindow.webContents.openDevTools();
      }
    });

    // Limpiar referencia cuando se cierra
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    // Log de eventos
    this.mainWindow.webContents.on('did-finish-load', () => {
      log.info('Aplicación cargada correctamente');
    });
  }

  setupAppEvents() {
    // IPC Handlers para comunicación con el renderer
    ipcMain.handle('app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('show-save-dialog', async (event, options) => {
      const result = await dialog.showSaveDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-open-dialog', async (event, options) => {
      const result = await dialog.showOpenDialog(this.mainWindow, options);
      return result;
    });

    ipcMain.handle('show-message-box', async (event, options) => {
      const result = await dialog.showMessageBox(this.mainWindow, options);
      return result;
    });

    // Handler para acceso a archivos del sistema
    ipcMain.handle('access-file-system', async (event, operation, data) => {
      const fs = require('fs').promises;
      const path = require('path');
      
      try {
        switch (operation) {
          case 'read-file':
            return await fs.readFile(data.path, 'utf8');
          
          case 'write-file':
            await fs.writeFile(data.path, data.content, 'utf8');
            return { success: true };
          
          case 'create-directory':
            await fs.mkdir(data.path, { recursive: true });
            return { success: true };
          
          case 'list-files':
            const files = await fs.readdir(data.path);
            return files;
          
          default:
            throw new Error(`Operación no soportada: ${operation}`);
        }
      } catch (error) {
        log.error('Error en operación de archivo:', error);
        throw error;
      }
    });

    // Handlers adicionales para funcionalidades específicas
    const Store = require('electron-store');
    const store = new Store();

    // Manejo del store
    ipcMain.handle('store-get', (event, key) => store.get(key));
    ipcMain.handle('store-set', (event, key, value) => store.set(key, value));
    ipcMain.handle('store-delete', (event, key) => store.delete(key));
    ipcMain.handle('store-clear', () => store.clear());

    // Control de ventana
    ipcMain.handle('window-minimize', () => this.mainWindow?.minimize());
    ipcMain.handle('window-maximize', () => {
      if (this.mainWindow?.isMaximized()) {
        this.mainWindow.unmaximize();
      } else {
        this.mainWindow?.maximize();
      }
    });
    ipcMain.handle('window-close', () => this.mainWindow?.close());
    ipcMain.handle('window-is-maximized', () => this.mainWindow?.isMaximized());

    // Notificaciones del sistema
    ipcMain.handle('show-notification', (event, { title, body, urgency = 'normal' }) => {
      const { Notification } = require('electron');
      
      if (Notification.isSupported()) {
        const notification = new Notification({
          title,
          body,
          urgency,
          icon: this.getIconPath()
        });
        notification.show();
        return true;
      }
      return false;
    });

    // Desarrollo
    ipcMain.handle('open-dev-tools', () => this.mainWindow?.webContents.openDevTools());
    ipcMain.handle('reload-app', () => this.mainWindow?.webContents.reload());
  }

  setupMenu() {
    const template = require('./menu').getMenuTemplate();
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  getIconPath() {
    if (process.platform === 'win32') {
      return path.join(__dirname, '../assets/icons/icon.ico');
    } else if (process.platform === 'darwin') {
      return path.join(__dirname, '../assets/icons/icon.icns');
    } else {
      return path.join(__dirname, '../assets/icons/icon.png');
    }
  }
}

// Crear instancia de la aplicación
new App();

// Manejo de errores no capturadas
process.on('uncaughtException', (error) => {
  log.error('Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
  log.error('Promesa rechazada:', error);
});