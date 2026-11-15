import { useEffect, useState } from 'react'
import {
  crearVendedor,
  listarVendedores,
  listarVendedoresPorEmpresa,
  registrarCaptacion
} from '../services/vendedorService'

function VendedoresPanel({ empresas }) {
  const [vendedores, setVendedores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Filtro de visualización
  const [empresaFiltroId, setEmpresaFiltroId] = useState('')

  // Estados para el formulario de Alta de Vendedor
  const [codigoVendedor, setCodigoVendedor] = useState('')
  const [nombre, setNombre] = useState('')
  const [direccion, setDireccion] = useState('')
  const [fechaCaptacion, setFechaCaptacion] = useState('')
  const [empresaId, setEmpresaId] = useState('')

  // Estados para el formulario de Captación Piramidal
  const [idCaptador, setIdCaptador] = useState('')
  const [idSubordinado, setIdSubordinado] = useState('')

  const cargarVendedores = async (filtroId = empresaFiltroId) => {
    try {
      setCargando(true)
      const data = filtroId
        ? await listarVendedoresPorEmpresa(filtroId)
        : await listarVendedores()
      setVendedores(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarVendedores(empresaFiltroId)
  }, [empresaFiltroId])

  const handleCrearVendedor = async (e) => {
    e.preventDefault()
    // Enviamos el objeto empresa completo para evitar errores de deserialización en tipos primitivos de Empresa
    const empresaSeleccionada = empresas.find((emp) => emp.id === Number(empresaId))
    if (!empresaSeleccionada) {
      alert('Debés seleccionar una Empresa.')
      return
    }
    try {
      await crearVendedor({
        codigoVendedor,
        nombre,
        direccion,
        fechaCaptacion: fechaCaptacion || null,
        empresa: empresaSeleccionada
      })
      setCodigoVendedor('')
      setNombre('')
      setDireccion('')
      setFechaCaptacion('')
      setEmpresaId('')
      cargarVendedores()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleCaptacion = async (e) => {
    e.preventDefault()
    if (!idCaptador || !idSubordinado) {
      alert('Seleccioná tanto el vendedor captador como el subordinado.')
      return
    }
    if (idCaptador === idSubordinado) {
      alert('Un vendedor no puede captarse a sí mismo.')
      return
    }
    try {
      await registrarCaptacion(idCaptador, idSubordinado)
      setIdCaptador('')
      setIdSubordinado('')
      cargarVendedores()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Formularios de carga y relación piramidal */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
        {/* 1. Alta de Vendedor */}
        <form onSubmit={handleCrearVendedor} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>1. Registrar Nuevo Vendedor</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Código único (ej. V-001)"
              value={codigoVendedor}
              onChange={(e) => setCodigoVendedor(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <input
              type="date"
              value={fechaCaptacion}
              onChange={(e) => setFechaCaptacion(e.target.value)}
            />
            <select
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Empresa --</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombre}
                </option>
              ))}
            </select>
            <button type="submit" disabled={empresas.length === 0}>
              Guardar Vendedor
            </button>
          </div>
        </form>

        {/* 2. Captación Piramidal */}
        <form onSubmit={handleCaptacion} style={{ border: '1px solid #555', padding: '1rem', borderRadius: '8px' }}>
          <h3>2. Registrar Captación Piramidal</h3>
          <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: 0 }}>
            El subordinado pasará a depender del captador, adoptará su empresa y registrará la fecha actual.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <select
              value={idCaptador}
              onChange={(e) => {
                const nuevoCaptador = e.target.value
                setIdCaptador(nuevoCaptador)
                if (nuevoCaptador === idSubordinado) {
                  setIdSubordinado('')
                }
              }}
              required
            >
              <option value="">-- Seleccionar Vendedor Captador (Superior) --</option>
              {vendedores.map((v) => (
                <option key={v.id} value={v.id}>
                  [{v.codigoVendedor}] {v.nombre} — {v.empresa?.nombre}
                </option>
              ))}
            </select>
            <select
              value={idSubordinado}
              onChange={(e) => setIdSubordinado(e.target.value)}
              required
            >
              <option value="">-- Seleccionar Vendedor Subordinado --</option>
              {vendedores
                .filter((v) => String(v.id) !== String(idCaptador))
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    [{v.codigoVendedor}] {v.nombre} — {v.empresa?.nombre}
                  </option>
                ))}
            </select>
            <button type="submit" disabled={vendedores.length < 2}>
              Vincular Jerarquía
            </button>
          </div>
        </form>
      </div>

      {/* Filtro por Empresa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <label htmlFor="filtroEmpresa"><strong>Filtrar por Empresa:</strong></label>
        <select
          id="filtroEmpresa"
          value={empresaFiltroId}
          onChange={(e) => setEmpresaFiltroId(e.target.value)}
        >
          <option value="">Todas las empresas del holding</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla de Vendedores */}
      {cargando ? (
        <p>Cargando vendedores desde el servidor...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Empresa</th>
              <th>Fecha Captación</th>
              <th>Captado Por</th>
              <th>Subordinados Captados</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No hay vendedores registrados para este criterio.
                </td>
              </tr>
            ) : (
              vendedores.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{v.codigoVendedor}</td>
                  <td>{v.nombre}</td>
                  <td>{v.direccion || '-'}</td>
                  <td>{v.empresa ? v.empresa.nombre : 'Sin empresa'}</td>
                  <td>{v.fechaCaptacion || '-'}</td>
                  <td>
                    {v.captador
                      ? `[${v.captador.codigoVendedor}] ${v.captador.nombre}`
                      : 'Nivel Raíz (Sin captador)'}
                  </td>
                  <td>
                    {v.captados && v.captados.length > 0
                      ? v.captados.map((sub) => `[${sub.codigoVendedor}] ${sub.nombre}`).join(', ')
                      : 'Ninguno'}
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

export default VendedoresPanel