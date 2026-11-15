import { useEffect, useState } from 'react'
import { crearEmpresa, eliminarEmpresa, listarEmpresas } from './services/empresaService'
import { crearPais, listarPaises } from './services/paisService'
import VendedoresPanel from './components/VendedoresPanel'
import AreasMercadoPanel from './components/AreasMercadoPanel'
import AsesoresPanel from './components/AsesoresPanel'
import './App.css'

function App() {
  const [vistaActiva, setVistaActiva] = useState('empresas')
  const [empresas, setEmpresas] = useState([])
  const [paises, setPaises] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estados para el formulario de País
  const [nombrePais, setNombrePais] = useState('')
  const [capitalPais, setCapitalPais] = useState('')
  const [pibPais, setPibPais] = useState('')
  const [habitantesPais, setHabitantesPais] = useState('')

  // Estados para el formulario de Empresa
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const [facturacionAnual, setFacturacionAnual] = useState('')
  const [fechaIngresoHolding, setFechaIngresoHolding] = useState('')
  const [cantidadVendedores, setCantidadVendedores] = useState('')
  const [paisSedeId, setPaisSedeId] = useState('')

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [dataEmpresas, dataPaises] = await Promise.all([
        listarEmpresas(),
        listarPaises()
      ])
      setEmpresas(dataEmpresas)
      setPaises(dataPaises)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const handleCrearPais = async (e) => {
    e.preventDefault()
    try {
      await crearPais({
        nombre: nombrePais,
        capital: capitalPais,
        pib: parseFloat(pibPais) || 0,
        habitantes: parseInt(habitantesPais, 10) || 0
      })
      setNombrePais('')
      setCapitalPais('')
      setPibPais('')
      setHabitantesPais('')
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCrearEmpresa = async (e) => {
    e.preventDefault()
    const paisSeleccionado = paises.find((p) => p.id === Number(paisSedeId))
    if (!paisSeleccionado) {
      alert('Debés seleccionar un País Sede.')
      return
    }
    try {
      await crearEmpresa({
        nombre: nombreEmpresa,
        facturacionAnual: parseFloat(facturacionAnual) || 0,
        fechaIngresoHolding: fechaIngresoHolding || null,
        cantidadVendedores: parseInt(cantidadVendedores, 10) || 0,
        paisSede: paisSeleccionado
      })
      setNombreEmpresa('')
      setFacturacionAnual('')
      setFechaIngresoHolding('')
      setCantidadVendedores('')
      setPaisSedeId('')
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta empresa?')) return
    try {
      await eliminarEmpresa(id)
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1150px', margin: '0 auto' }}>
      <h1>Gestión del Holding</h1>

      {/* Navegación por pestañas */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          onClick={() => setVistaActiva('empresas')}
          style={{
            fontWeight: vistaActiva === 'empresas' ? 'bold' : 'normal',
            borderColor: vistaActiva === 'empresas' ? '#646cff' : undefined
          }}
        >
          Empresas y Países
        </button>
        <button
          onClick={() => setVistaActiva('vendedores')}
          style={{
            fontWeight: vistaActiva === 'vendedores' ? 'bold' : 'normal',
            borderColor: vistaActiva === 'vendedores' ? '#646cff' : undefined
          }}
        >
          Vendedores y Red Piramidal
        </button>
        <button
          onClick={() => setVistaActiva('areas')}
          style={{
            fontWeight: vistaActiva === 'areas' ? 'bold' : 'normal',
            borderColor: vistaActiva === 'areas' ? '#646cff' : undefined
          }}
        >
          Áreas de Mercado
        </button>
        <button
          onClick={() => setVistaActiva('asesores')}
          style={{
            fontWeight: vistaActiva === 'asesores' ? 'bold' : 'normal',
            borderColor: vistaActiva === 'asesores' ? '#646cff' : undefined
          }}
        >
          Asesores y Asignaciones
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {vistaActiva === 'empresas' && (
        <>
          {/* Formularios de carga */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            {/* Formulario País */}
            <form onSubmit={handleCrearPais} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
              <h3>1. Registrar País Sede</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nombre del país (ej. Argentina)"
                  value={nombrePais}
                  onChange={(e) => setNombrePais(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Capital (ej. Buenos Aires)"
                  value={capitalPais}
                  onChange={(e) => setCapitalPais(e.target.value)}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="PIB (ej. 640000)"
                  value={pibPais}
                  onChange={(e) => setPibPais(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Habitantes (ej. 46000000)"
                  value={habitantesPais}
                  onChange={(e) => setHabitantesPais(e.target.value)}
                />
                <button type="submit">Guardar País</button>
              </div>
            </form>

            {/* Formulario Empresa */}
            <form onSubmit={handleCrearEmpresa} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
              <h3>2. Registrar Nueva Empresa</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Nombre de la empresa"
                  value={nombreEmpresa}
                  onChange={(e) => setNombreEmpresa(e.target.value)}
                  required
                />
                <select
                  value={paisSedeId}
                  onChange={(e) => setPaisSedeId(e.target.value)}
                  required
                >
                  <option value="">-- Seleccionar País Sede --</option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} ({p.capital || 'Sin capital'})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  step="any"
                  placeholder="Facturación anual"
                  value={facturacionAnual}
                  onChange={(e) => setFacturacionAnual(e.target.value)}
                />
                <input
                  type="date"
                  value={fechaIngresoHolding}
                  onChange={(e) => setFechaIngresoHolding(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Cantidad de vendedores"
                  value={cantidadVendedores}
                  onChange={(e) => setCantidadVendedores(e.target.value)}
                />
                <button type="submit" disabled={paises.length === 0}>
                  Guardar Empresa
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Empresas */}
          {cargando ? (
            <p>Cargando datos desde el servidor...</p>
          ) : (
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>País Sede</th>
                  <th>Facturación Anual</th>
                  <th>Fecha Ingreso</th>
                  <th>Vendedores</th>
                  <th>Áreas de Mercado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      No hay empresas registradas en la base de datos.
                    </td>
                  </tr>
                ) : (
                  empresas.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.nombre}</td>
                      <td>{emp.paisSede ? emp.paisSede.nombre : 'Sin país'}</td>
                      <td>${emp.facturacionAnual.toLocaleString()}</td>
                      <td>{emp.fechaIngresoHolding}</td>
                      <td>{emp.cantidadVendedores}</td>
                      <td>
                        {emp.areasMercado && emp.areasMercado.length > 0
                          ? emp.areasMercado.map((area) => area.nombreArea).join(', ')
                          : 'Ninguna'}
                      </td>
                      <td>
                        <button onClick={() => handleEliminar(emp.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </>
      )}

      {vistaActiva === 'vendedores' && (
        <VendedoresPanel empresas={empresas} />
      )}

      {vistaActiva === 'areas' && (
        <AreasMercadoPanel
          empresas={empresas}
          onActualizarEmpresas={cargarDatos}
        />
      )}

      {vistaActiva === 'asesores' && (
        <AsesoresPanel empresas={empresas} />
      )}
    </div>
  )
}

export default App