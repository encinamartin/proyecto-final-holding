import { useEffect, useState } from 'react'
import {
  asignarAsesorAEmpresaYArea,
  crearAsesor,
  eliminarAsesor,
  eliminarAsignacion,
  listarAsesores,
  listarAsignaciones
} from '../services/asesorService'

function AsesoresPanel({ empresas }) {
  const [asesores, setAsesores] = useState([])
  const [asignaciones, setAsignaciones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estados para el formulario de Alta de Asesor
  const [nombre, setNombre] = useState('')
  const [cuil, setCuil] = useState('')
  const [especialidad, setEspecialidad] = useState('')

  // Estados para el formulario de Asignación (Asesor + Empresa + Área)
  const [asesorId, setAsesorId] = useState('')
  const [empresaId, setEmpresaId] = useState('')
  const [areaId, setAreaId] = useState('')

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [dataAsesores, dataAsignaciones] = await Promise.all([
        listarAsesores(),
        listarAsignaciones()
      ])
      setAsesores(dataAsesores)
      setAsignaciones(dataAsignaciones)
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

  const handleCrearAsesor = async (e) => {
    e.preventDefault()
    try {
      await crearAsesor({
        nombre,
        cuil,
        especialidad
      })
      setNombre('')
      setCuil('')
      setEspecialidad('')
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAsignar = async (e) => {
    e.preventDefault()
    if (!asesorId || !empresaId || !areaId) {
      alert('Seleccioná asesor, empresa y área de mercado.')
      return
    }
    try {
      await asignarAsesorAEmpresaYArea(asesorId, empresaId, areaId)
      setAsesorId('')
      setEmpresaId('')
      setAreaId('')
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminarAsesor = async (id) => {
    if (!window.confirm('¿Eliminar este asesor y todas sus asignaciones?')) return
    try {
      await eliminarAsesor(id)
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleEliminarAsignacion = async (asignacionId) => {
    if (!window.confirm('¿Dar de baja esta asignación?')) return
    try {
      await eliminarAsignacion(asignacionId)
      cargarDatos()
    } catch (err) {
      alert(err.message)
    }
  }

  // Áreas disponibles dinámicamente según la empresa elegida
  const empresaSeleccionada = empresas.find((emp) => String(emp.id) === String(empresaId))
  const areasDisponibles = empresaSeleccionada?.areasMercado || []

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Formularios de carga y asignación */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
        {/* 1. Alta de Asesor */}
        <form onSubmit={handleCrearAsesor} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>1. Registrar Nuevo Asesor</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Nombre y Apellido"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="CUIL (ej. 20-30456789-3)"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Especialidad (ej. Nutrición Clínica / Estrategia Comercial)"
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
            />
            <button type="submit">Guardar Asesor</button>
          </div>
        </form>

        {/* 2. Asignación a Empresa y Área de Mercado */}
        <form onSubmit={handleAsignar} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>2. Asignar Asesor a Empresa y Área</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 0 }}>
            Registra la asignación con auditoría automática de fecha de inicio.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select
              value={asesorId}
              onChange={(e) => setAsesorId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Asesor --</option>
              {asesores.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre} (CUIL: {a.cuil})
                </option>
              ))}
            </select>

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
              disabled={!empresaId || areasDisponibles.length === 0}
              required
            >
              <option value="">
                {!empresaId
                  ? '-- Primero seleccioná una Empresa --'
                  : areasDisponibles.length === 0
                    ? '-- Esta empresa no tiene áreas asignadas --'
                    : '-- Seleccionar Área de Mercado --'}
              </option>
              {areasDisponibles.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombreArea}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={asesores.length === 0 || empresas.length === 0 || areasDisponibles.length === 0}
            >
              Registrar Asignación
            </button>
          </div>
        </form>
      </div>

      {/* Tabla 1: Asignaciones Activas (Auditoría Temporal) */}
      <h3 style={{ textAlign: 'left' }}>Asignaciones Activas (Auditoría Temporal)</h3>
      {cargando ? (
        <p>Cargando asignaciones...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Asesor</th>
              <th>CUIL</th>
              <th>Empresa</th>
              <th>Área de Mercado</th>
              <th>Fecha Inicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaciones.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
                  No hay asignaciones registradas.
                </td>
              </tr>
            ) : (
              asignaciones.map((asig) => (
                <tr key={asig.id}>
                  <td>{asig.id}</td>
                  <td>{asig.asesor?.nombre}</td>
                  <td>{asig.asesor?.cuil}</td>
                  <td>{asig.empresa?.nombre}</td>
                  <td>{asig.areaMercado?.nombreArea}</td>
                  <td>{asig.fechaInicio}</td>
                  <td>
                    <button onClick={() => handleEliminarAsignacion(asig.id)}>Baja</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Tabla 2: Nómina General de Asesores */}
      <h3 style={{ textAlign: 'left' }}>Nómina de Asesores</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CUIL</th>
            <th>Especialidad</th>
            <th>Asignaciones Activas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asesores.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                No hay asesores registrados.
              </td>
            </tr>
          ) : (
            asesores.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.cuil}</td>
                <td>{a.especialidad || '-'}</td>
                <td>{a.asignaciones ? a.asignaciones.length : 0}</td>
                <td>
                  <button onClick={() => handleEliminarAsesor(a.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AsesoresPanel