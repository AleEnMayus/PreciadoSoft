import { useState, useEffect } from 'react'
import { 
  Package, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  DollarSign,
  Thermometer,
  Clock,
  Activity,
  FolderOpen
} from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
  const [isElectron, setIsElectron] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    nearExpiry: 0,
    dailySales: 0,
    temperature: 0,
    customers: 0
  })

  useEffect(() => {
    // Verificar si estamos en Electron
    if (window.electronAPI) {
      setIsElectron(true)
      console.log('Dashboard cargado en Electron')
    }

    // Simular datos (después los traeremos de la API)
    setStats({
      totalProducts: 1247,
      lowStock: 12,
      nearExpiry: 8,
      dailySales: 145000,
      temperature: 22,
      customers: 43
    })
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const dashboardCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      trend: '+5.2%'
    },
    {
      title: 'Stock Bajo',
      value: stats.lowStock,
      icon: AlertTriangle,
      color: '#F59E0B',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      trend: '-2.1%',
      alert: stats.lowStock > 10
    },
    {
      title: 'Por Vencer',
      value: stats.nearExpiry,
      icon: Clock,
      color: '#EF4444',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      trend: '+1.3%',
      alert: stats.nearExpiry > 5
    },
    {
      title: 'Ventas Hoy',
      value: formatCurrency(stats.dailySales),
      icon: DollarSign,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      trend: '+12.5%'
    },
    {
      title: 'Temperatura',
      value: `${stats.temperature}°C`,
      icon: Thermometer,
      color: stats.temperature >= 18 && stats.temperature <= 25 ? '#10B981' : '#F59E0B',
      bgColor: stats.temperature >= 18 && stats.temperature <= 25 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      status: stats.temperature >= 18 && stats.temperature <= 25 ? 'Óptima' : 'Revisar'
    },
    {
      title: 'Clientes Hoy',
      value: stats.customers,
      icon: Users,
      color: '#8B5CF6',
      bgColor: 'rgba(139, 92, 246, 0.1)',
      trend: '+8.7%'
    }
  ]

  const quickActions = [
    { name: 'Nueva Factura', path: '/facturacion', icon: FileText, color: '#DC2626' },
    { name: 'Ver Inventario', path: '/inventario', icon: Package, color: '#10B981' },
    { name: 'Control Temperatura', path: '/temperatura', icon: Thermometer, color: '#EF4444' },
    { name: 'Documentos', path: '/documentos', icon: FolderOpen, color: '#F59E0B' }
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Resumen general de Droguería Preciado</p>
        </div>
        
        {isElectron && (
          <div className="electron-status">
            <Activity size={16} />
            <span>Sistema activo</span>
          </div>
        )}
      </div>

      {/* Cards de estadísticas */}
      <div className="stats-grid">
        {dashboardCards.map((card, index) => {
          const IconComponent = card.icon
          return (
            <div 
              key={index} 
              className={`stat-card ${card.alert ? 'alert' : ''}`}
              style={{ borderLeftColor: card.color }}
            >
              <div className="stat-content">
                <div className="stat-header">
                  <h3>{card.title}</h3>
                  <div 
                    className="stat-icon"
                    style={{ 
                      color: card.color,
                      backgroundColor: card.bgColor 
                    }}
                  >
                    <IconComponent size={20} />
                  </div>
                </div>
                
                <div className="stat-value">
                  <span className="value">{card.value}</span>
                  {card.status && (
                    <span className="status" style={{ color: card.color }}>
                      {card.status}
                    </span>
                  )}
                </div>
                
                {card.trend && (
                  <div className="stat-trend">
                    <TrendingUp size={12} />
                    <span>{card.trend}</span>
                    <span className="trend-period">vs. ayer</span>
                  </div>
                )}
              </div>
              
              {card.alert && (
                <div className="alert-indicator">
                  <AlertTriangle size={14} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Alertas importantes */}
      <div className="alerts-section">
        <h2>Alertas Importantes</h2>
        <div className="alerts-list">
          <div className="alert-item warning">
            <AlertTriangle size={18} />
            <div className="alert-content">
              <h4>Medicamentos por vencer</h4>
              <p>8 productos vencen en los próximos 7 días</p>
            </div>
            <button className="alert-action">Ver detalles</button>
          </div>
          
          <div className="alert-item info">
            <Package size={18} />
            <div className="alert-content">
              <h4>Stock bajo</h4>
              <p>12 productos necesitan restock</p>
            </div>
            <button className="alert-action">Ver inventario</button>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button 
                key={index}
                className="action-card"
                onClick={() => console.log('Navegar a:', action.path)}
              >
                <div 
                  className="action-icon"
                  style={{ color: action.color }}
                >
                  <IconComponent size={24} />
                </div>
                <span>{action.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard