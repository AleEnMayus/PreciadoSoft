import { useState, useEffect } from 'react'
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  User, 
  AlertTriangle,
  Clock,
  Package
} from 'lucide-react'
import './Header.css'

function Header({ currentPage, onToggleSidebar, isElectron }) {
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: 'warning',
        title: 'Producto por vencer',
        message: 'Acetaminofén 500mg vence en 5 días',
        time: '2 min ago',
        icon: AlertTriangle
      },
      {
        id: 2,
        type: 'info',
        title: 'Stock bajo',
        message: 'Ibuprofeno 400mg: Solo 3 unidades',
        time: '10 min ago',
        icon: Package
      },
      {
        id: 3,
        type: 'success',
        title: 'Temperatura OK',
        message: 'Temperatura: 22°C - Rango óptimo',
        time: '1 hour ago',
        icon: Clock
      }
    ])
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Buscando:', searchQuery)
    }
  }

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return '#F59E0B'
      case 'error': return '#DC2626'
      case 'success': return '#10B981'
      case 'info': return '#3B82F6'
      default: return '#6B7280'
    }
  }

  const formatTime = (date) =>
    date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })

  const formatDate = (date) =>
    date.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar} title="Toggle Sidebar">
          <Menu size={20} />
        </button>
        <div className="page-info">
          <h1 className="page-title">{currentPage}</h1>
          <p className="page-subtitle">Droguerías Preciado</p>
        </div>
      </div>

      <div className="header-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos, facturas, clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>
      </div>

      <div className="header-right">
        <div className="time-info">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>

        <div className="notifications-container">
          <button 
            className={`notifications-btn ${notifications.length > 0 ? 'has-notifications' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notificaciones"
          >
            <Bell size={24} />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notificaciones</h3>
                <button 
                  className="close-notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="no-notifications">
                    <Bell size={32} />
                    <p>No hay notificaciones</p>
                  </div>
                ) : (
                  notifications.map(notification => {
                    const IconComponent = notification.icon
                    return (
                      <div key={notification.id} className="notification-item">
                        <div 
                          className="notification-icon"
                          style={{ color: getNotificationColor(notification.type) }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                        <button 
                          className="notification-close"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="user-menu">
          <button className="user-btn" title="Perfil de usuario">
            <User size={20} />
            <span>Admin</span>
          </button>
        </div>

        {isElectron && (
          <div className="electron-indicator" title="Corriendo en Electron">
            <div className="electron-dot"></div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header