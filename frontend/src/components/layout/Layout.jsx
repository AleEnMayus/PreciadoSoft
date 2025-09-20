import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './Layout.css'

function Layout({ children, isElectron, electronAPI }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false) // Para mobile
  const location = useLocation()

  // Actualizar página actual basada en la ruta
  useEffect(() => {
    const pathMap = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/inventario': 'Inventario',
      '/facturacion': 'Facturación',
      '/documentos': 'Documentos',
      '/encuestas': 'Encuestas',
      '/temperatura': 'Control de Temperatura'
    }
    
    const pageName = pathMap[location.pathname] || 'Dashboard'
    setCurrentPage(pageName)
  }, [location.pathname])

  // Escuchar eventos del menú de Electron
  useEffect(() => {
    if (isElectron && window.electronAPI) {
      // Escuchar navegación desde el menú de Electron
      const handleMenuNavigation = (event, route) => {
        console.log('Navegación desde menú Electron:', route)
        // React Router se encargará automáticamente
      }

      // Escuchar acciones del menú
      const handleMenuAction = (event, action) => {
        console.log('Acción desde menú:', action)
        
        switch(action) {
          case 'open-settings':
            // Abrir modal de configuración
            console.log('Abrir configuración')
            break
          case 'show-shortcuts':
            // Mostrar atajos de teclado
            console.log('Mostrar atajos')
            break
          case 'show-about':
            // Mostrar información de la app
            console.log('Mostrar acerca de')
            break
          default:
            console.log('Acción no manejada:', action)
        }
      }

      // Aquí conectaríamos con los eventos reales de Electron
      // window.electronAPI.onMenuNavigation(handleMenuNavigation)
      // window.electronAPI.onMenuAction(handleMenuAction)
      
      return () => {
        // Cleanup de event listeners
      }
    }
  }, [isElectron])

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Toggle sidebar mobile
  const toggleSidebarMobile = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Cerrar sidebar en mobile cuando se navega
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Manejar resize de ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="layout">
      <Sidebar 
        collapsed={sidebarCollapsed}
        open={sidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isElectron={isElectron}
        electronAPI={electronAPI}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Header 
          currentPage={currentPage}
          onToggleSidebar={window.innerWidth <= 768 ? toggleSidebarMobile : toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          isElectron={isElectron}
          electronAPI={electronAPI}
        />
        
        <main className="content">
          {children}
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default Layout