const { app, shell } = require('electron');

const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';

function getMenuTemplate() {
  const template = [
    // Menú de aplicación (macOS)
    ...(isMac ? [{
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'Acerca de PreciadoSoft' },
        { type: 'separator' },
        { role: 'services', label: 'Servicios' },
        { type: 'separator' },
        { role: 'hide', label: 'Ocultar PreciadoSoft' },
        { role: 'hideothers', label: 'Ocultar Otros' },
        { role: 'unhide', label: 'Mostrar Todo' },
        { type: 'separator' },
        { role: 'quit', label: 'Salir de PreciadoSoft' }
      ]
    }] : []),

    // Menú Archivo
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nueva Factura',
          accelerator: 'CmdOrCtrl+N',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'new-invoice');
            }
          }
        },
        {
          label: 'Abrir Factura',
          accelerator: 'CmdOrCtrl+O',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'open-invoice');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exportar Inventario',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'export-inventory');
            }
          }
        },
        {
          label: 'Importar Productos',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'import-products');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Backup Base de Datos',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'backup-database');
            }
          }
        },
        { type: 'separator' },
        ...(isMac ? [] : [
          { role: 'quit', label: 'Salir' }
        ])
      ]
    },

    // Menú Editar
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectall', label: 'Seleccionar Todo' }
      ]
    },

    // Menú Droguería (específico del negocio)
    {
      label: 'Droguería',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+D',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/dashboard');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Inventario',
          accelerator: 'CmdOrCtrl+I',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/inventario');
            }
          }
        },
        {
          label: 'Facturación',
          accelerator: 'CmdOrCtrl+F',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/facturacion');
            }
          }
        },
        {
          label: 'Documentos',
          accelerator: 'CmdOrCtrl+Shift+D',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/documentos');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Control de Temperatura',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/temperatura');
            }
          }
        },
        {
          label: 'Encuestas de Clientes',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('navigate-to', '/encuestas');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Configuración',
          accelerator: 'CmdOrCtrl+,',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'open-settings');
            }
          }
        }
      ]
    },

    // Menú Reportes
    {
      label: 'Reportes',
      submenu: [
        {
          label: 'Ventas del Día',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'daily-sales-report');
            }
          }
        },
        {
          label: 'Ventas del Mes',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'monthly-sales-report');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Productos por Vencer',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'expiry-report');
            }
          }
        },
        {
          label: 'Stock Bajo',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'low-stock-report');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Historial de Temperatura',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'temperature-report');
            }
          }
        }
      ]
    },

    // Menú Vista
    {
      label: 'Vista',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },

    // Menú Ventana
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front', label: 'Traer Todo al Frente' }
        ] : [])
      ]
    },

    // Menú Ayuda
    {
      role: 'help',
      label: 'Ayuda',
      submenu: [
        {
          label: 'Manual de Usuario',
          click: async () => {
            // Aquí podrías abrir un PDF o página web con el manual
            await shell.openExternal('https://tu-sitio.com/manual');
          }
        },
        {
          label: 'Atajos de Teclado',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('menu-action', 'show-shortcuts');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Soporte Técnico',
          click: async () => {
            await shell.openExternal('mailto:soporte@preciado.com');
          }
        },
        ...(isMac ? [] : [
          { type: 'separator' },
          {
            label: 'Acerca de PreciadoSoft',
            click: async (menuItem, browserWindow) => {
              if (browserWindow) {
                browserWindow.webContents.send('menu-action', 'show-about');
              }
            }
          }
        ])
      ]
    }
  ];

  // Agregar opciones de desarrollo si estamos en modo dev
  if (isDev) {
    template.push({
      label: 'Desarrollo',
      submenu: [
        {
          label: 'Abrir DevTools',
          accelerator: 'F12',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.openDevTools();
            }
          }
        },
        {
          label: 'Recargar Aplicación',
          accelerator: 'CmdOrCtrl+R',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.reload();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Simular Alerta de Stock',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('dev-action', 'simulate-stock-alert');
            }
          }
        },
        {
          label: 'Simular Producto Vencido',
          click: async (menuItem, browserWindow) => {
            if (browserWindow) {
              browserWindow.webContents.send('dev-action', 'simulate-expiry-alert');
            }
          }
        }
      ]
    });
  }

  return template;
}

module.exports = {
  getMenuTemplate
};