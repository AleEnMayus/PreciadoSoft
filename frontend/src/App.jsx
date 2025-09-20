import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
/* las páginas se comentan hasta que estén listas
import Inventario from './pages/Inventario/Inventario'
import Facturacion from './pages/Facturacion/Facturacion'
import Documentos from './pages/Documentos/Documentos'
import Encuestas from './pages/Encuestas/Encuestas'
import Temperatura from './pages/Temperatura/Temperatura'
*/

import './styles/App.css'

function App() {
  const [isElectron, setIsElectron] = useState(false)
  const [electronAPI, setElectronAPI] = useState(null)

  useEffect(() => {
    // Verificar si estamos en Electron
    if (window.electronAPI) {
      setIsElectron(true)
      setElectronAPI(window.electronAPI)
      
      // Log de información
      console.log('PreciadoSoft iniciado en Electron')
      console.log('Platform:', window.electronConstants?.platform)
      
      // Obtener versión de la app
      window.electronAPI.getAppVersion().then(version => {
        console.log('Versión:', version)
      })
      
      // Escuchar eventos del menú
      const handleMenuNavigation = (event, route) => {
        console.log('Navegando a:', route)
        // React Router navegará automáticamente
      }
      
      // Aquí podrías escuchar más eventos de Electron si los necesitas
    } else {
      console.log('PreciadoSoft corriendo en navegador')
    }
  }, [])

  return (
    <Router>
      <div className="app">
        <Layout isElectron={isElectron} electronAPI={electronAPI}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} /> 
            {/* descomentar cuando las páginas estén listas
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/facturacion" element={<Facturacion />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/encuestas" element={<Encuestas />} />
                <Route path="/temperatura" element={<Temperatura />} />   
            */}
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App