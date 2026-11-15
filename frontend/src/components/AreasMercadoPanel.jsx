import { useEffect, useState } from 'react'
import {
  asignarAreaAEmpresa,
  crearAreaMercado,
  eliminarAreaMercado,
  listarAreasMercado,
  removerAreaDeEmpresa
} from '../services/areaMercadoService'

function AreasMercadoPanel({ empresas, onActualizarEmpresas }) {
  const [areas, setAreas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estados para el formulario de Alta de Área de Mercado
  const [nombreArea, setNombreArea] = useState('')
  const [descripcion, setDescripcion] = useState('')

  // Estados para el formulario de Vinculación Empresa <-> Área
  const [empresaId, setEmpresaId] = useState('')
  const [areaId, setAreaId] = useState('')

  const cargarAreas = async () => {
    try {
      setCargando(true)
      const data = await listarAreasMercado()
      setAreas(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarAreas()
  }, [])

  const handleCrearArea = async (e) => {
    e.preventDefault()
    try {
      await crearAreaMercado({
        nombreArea,
        descripcion
      })
      setNombreArea('')
      setDescripcion('')
      cargarAreas()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleVincular = async (e) => {
    e.preventDefault()
    if (!empresaId || !areaId) {
      alert('Seleccioná una empresa y un área de mercado.')
      return
    }
    try {
      await asignarAreaAEmpresa(empresaId, areaId)
      setEmpresaId('')
      setAreaId('')
      await onActualizarEmpresas()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDesvincular = async (empId, arId) => {
    try {
      await removerAreaDeEmpresa(empId, arId)
      await onActualizarEmpresas()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminarArea = async (id) => {
    if (!window.confirm('¿Eliminar esta área de mercado?')) return
    try {
      await eliminarAreaMercado(id)
      cargarAreas()
    } catch (err) {
      alert(err.message)
    }
  }

  // Filtramos las áreas disponibles para la empresa elegida (evita duplicados visuales)
  const empresaSeleccionada = empresas.find((emp) => String(emp.id) === String(empresaId))
  const idsAreasYaAsignadas = new Set(
    (empresaSeleccionada?.areasMercado || []).map((a) => a.id)
  )

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Formularios de carga y vinculación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
        {/* 1. Alta de Área de Mercado */}
        <form onSubmit={handleCrearArea} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>1. Registrar Área de Mercado</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nombre del área (ej. Salud y Nutrición)"
              value={nombreArea}
              onChange={(e) => setNombreArea(e.target.value)}
              required
            />
            <textarea
              placeholder="Descripción del rubro o segmento de mercado (opcional)"
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <button type="submit">Guardar Área de Mercado</button>
          </div>
        </form>

        {/* 2. Vincular Empresa con Área de Mercado */}
        <form onSubmit={handleVincular} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>2. Vincular Empresa con Área de Mercado</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 0 }}>
            Asocia una empresa del holding con los sectores donde opera (relación N:M).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select
              value={empresaId}
              onChange={(e) => {
                setEmpresaId(e.target.value)
                setAreaId('')
              }}
              required
            >
              <option value="">-- Seleccionar Empresa --</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Área de Mercado --</option>
              {areas
                .filter((a) => !idsAreasYaAsignadas.has(a.id))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombreArea}
                  </option>
                ))}
            </select>
            <button type="submit" disabled={empresas.length === 0 || areas.length === 0}>
              Asociar Área a Empresa
            </button>
          </div>
        </form>
      </div>

      {/* Tabla 1: Cobertura por Empresa (con opción de desvincular) */}
      <h3 style={{ textAlign: 'left' }}>Cobertura de Áreas por Empresa</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>País Sede</th>
            <th>Áreas de Mercado Asignadas</th>
          </tr>
        </thead>
        <tbody>
          {empresas.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>
                No hay empresas registradas.
              </td>
            </tr>
          ) : (
            empresas.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.nombre}</td>
                <td>{emp.paisSede?.nombre || 'Sin país'}</td>
                <td>
                  {emp.areasMercado && emp.areasMercado.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {emp.areasMercado.map((area) => (
                        <span
                          key={area.id}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.2rem 0.6rem',
                            border: '1px solid #646cff',
                            borderRadius: '12px',
                            fontSize: '0.85rem'
                          }}
                        >
                          {area.nombreArea}
                          <button
                            type="button"
                            onClick={() => handleDesvincular(emp.id, area.id)}
                            style={{ padding: '0 0.35rem', fontSize: '0.75rem' }}
                            title="Desvincular área"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    'Sin áreas asignadas'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Tabla 2: Catálogo general de Áreas de Mercado */}
      <h3 style={{ textAlign: 'left' }}>Catálogo de Áreas de Mercado</h3>
      {cargando ? (
        <p>Cargando áreas de mercado...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Área</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No hay áreas de mercado registradas.
                </td>
              </tr>
            ) : (
              areas.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nombreArea}</td>
                  <td>{a.descripcion || '-'}</td>
                  <td>
                    <button onClick={() => handleEliminarArea(a.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AreasMercadoPanel