import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Thermometer,
  Pill,
  ChevronRight,
  Settings,
  X
} from 'lucide-react'
import './Sidebar.css'

function Sidebar({ collapsed, open, currentPage, setCurrentPage, isElectron, electronAPI, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      color: '#3B82F6'
    },
    {
      name: 'Inventario',
      path: '/inventario',
      icon: Package,
      color: '#10B981',
      description: 'Control de stock y productos'
    },
    {
      name: 'Facturación',
      path: '/facturacion',
      icon: FileText,
      color: '#DC2626',
      description: 'Facturas electrónicas'
    },
    {
      name: 'Documentos',
      path: '/documentos',
      icon: FolderOpen,
      color: '#F59E0B',
      description: 'Documentos legales'
    },
    {
      name: 'Encuestas',
      path: '/encuestas',
      icon: MessageSquare,
      color: '#8B5CF6',
      description: 'Satisfacción de clientes'
    },
    {
      name: 'Temperatura',
      path: '/temperatura',
      icon: Thermometer,
      color: '#EF4444',
      description: 'Control ambiental'
    }
  ]

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/')
  }

  const handleNavigation = (item) => {
    setCurrentPage(item.name)
    navigate(item.path)
    if (onClose) onClose() // Cerrar sidebar en mobile
  }

  const handleSettingsClick = () => {
    console.log('Configuración clicked')
    if (isElectron && electronAPI) {
      // Usar API de Electron si está disponible
      console.log('Abrir configuración desde Electron')
    } else {
      // Navegación normal
      navigate('/configuracion')
    }
    if (onClose) onClose()
  }

  return (
    <>
    {open && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${open ? 'open' : ''}`}>
        {/* Botón de cerrar para mobile */}
        {open && (
          <button className="sidebar-close-mobile" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        {/* Logo y título */}
        <div className="sidebar-header">
          <div className="logo">
            <Pill size={32} color="#DC2626" />
            {(!collapsed || open) && (
              <div className="logo-text">
                <h2>PreciadoSoft</h2>
                <p>Sistema de Gestión</p>
              </div>
            )}
          </div>
        </div>

        {/* Menú principal */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.path)

              return (
                <li key={item.name} className={`nav-item ${active ? 'active' : ''}`}>
                  <button
                    className="nav-link"
                    onClick={() => handleNavigation(item)}
                    title={collapsed ? item.name : ''}
                  >
                    <div className="nav-icon" style={{ color: item.color }}>
                      <IconComponent size={20} />
                    </div>
                    
                    {(!collapsed || open) && (
                      <>
                        <div className="nav-content">
                          <span className="nav-title">{item.name}</span>
                          {item.description && (
                            <span className="nav-description">{item.description}</span>
                          )}
                        </div>
                        <ChevronRight size={16} className="nav-arrow" />
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Información del sistema */}
        {(!collapsed || open) && (
          <div className="sidebar-footer">
            <div className="system-info">
              <p className="app-name">Droguerías Preciado</p>
              <p className="app-version">v1.0.0</p>
              {isElectron && (
                <p className="platform">
                  {window.electronConstants?.isWindows ? 'Windows' : 'Escritorio'}
                </p>
              )}
            </div>
            
            <button className="settings-link" onClick={handleSettingsClick}>
              <Settings size={16} />
              <span>Configuración</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar