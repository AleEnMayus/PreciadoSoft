const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la aplicación
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // Diálogos del sistema
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showOpenDialog: (options) => ipcRenderer.invoke('show-open-dialog', options),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // Sistema de archivos (para documentos legales)
  fileSystem: {
    readFile: (filePath) => ipcRenderer.invoke('access-file-system', 'read-file', { path: filePath }),
    writeFile: (filePath, content) => ipcRenderer.invoke('access-file-system', 'write-file', { path: filePath, content }),
    createDirectory: (dirPath) => ipcRenderer.invoke('access-file-system', 'create-directory', { path: dirPath }),
    listFiles: (dirPath) => ipcRenderer.invoke('access-file-system', 'list-files', { path: dirPath }),
  },
  
  // Funciones específicas para la droguería
  pharmacy: {
    // Exportar reportes
    exportToPDF: (data, fileName) => 
      ipcRenderer.invoke('export-pdf', { data, fileName }),
    
    // Imprimir facturas
    printInvoice: (invoiceData) => 
      ipcRenderer.invoke('print-invoice', invoiceData),
    
    // Backup de base de datos
    backupDatabase: (backupPath) => 
      ipcRenderer.invoke('backup-database', backupPath),
    
    // Importar productos desde Excel
    importFromExcel: (filePath) => 
      ipcRenderer.invoke('import-excel', filePath),
  },
  
  // Notificaciones del sistema
  notification: {
    show: (title, body, options = {}) => 
      ipcRenderer.invoke('show-notification', { title, body, ...options }),
    
    // Alertas específicas de farmacia
    stockAlert: (productName, quantity) => 
      ipcRenderer.invoke('show-notification', {
        title: 'Stock Bajo',
        body: `${productName}: Solo quedan ${quantity} unidades`,
        urgency: 'critical'
      }),
    
    expiryAlert: (productName, daysToExpiry) => 
      ipcRenderer.invoke('show-notification', {
        title: 'Producto por Vencer',
        body: `${productName} vence en ${daysToExpiry} días`,
        urgency: 'normal'
      }),
  },
  
  // Configuración de la aplicación
  store: {
    get: (key) => ipcRenderer.invoke('store-get', key),
    set: (key, value) => ipcRenderer.invoke('store-set', key, value),
    delete: (key) => ipcRenderer.invoke('store-delete', key),
    clear: () => ipcRenderer.invoke('store-clear'),
  },
  
  // Funciones de ventana
  window: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  },
  
  // Funciones de desarrollo
  dev: {
    openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
    reload: () => ipcRenderer.invoke('reload-app'),
  }
});

// Exponer constantes útiles
contextBridge.exposeInMainWorld('electronConstants', {
  platform: process.platform,
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  isLinux: process.platform === 'linux',
  
  // Rutas importantes para la droguería
  paths: {
    documents: 'documents',
    exports: 'temp/exports',
    uploads: 'temp/uploads',
    backups: 'database/backups',
  }
});

// Eventos de aplicación
window.addEventListener('DOMContentLoaded', () => {
  // Información para debuggear
  console.log(' PreciadoSoft - Electron Preload cargado');
  console.log(' Plataforma:', process.platform);
  console.log(' Versión de Node:', process.versions.node);
  console.log(' Versión de Electron:', process.versions.electron);
  console.log(' Versión de Chrome:', process.versions.chrome);
});