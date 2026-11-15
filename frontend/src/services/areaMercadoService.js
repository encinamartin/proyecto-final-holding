const API_URL = 'http://localhost:8080/api/areas-mercado';
const EMPRESAS_URL = 'http://localhost:8080/api/empresas';

export const listarAreasMercado = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las áreas de mercado');
    return await response.json();
};

export const crearAreaMercado = async (areaMercado) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(areaMercado),
    });
    if (!response.ok) throw new Error('Error al registrar el área de mercado');
    return await response.json();
};

export const eliminarAreaMercado = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el área de mercado (verificá que no esté asignada a una empresa)');
};

export const asignarAreaAEmpresa = async (empresaId, areaId) => {
    const response = await fetch(`${EMPRESAS_URL}/${empresaId}/areas/${areaId}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Error al vincular el área de mercado con la empresa');
    return await response.json();
};

export const removerAreaDeEmpresa = async (empresaId, areaId) => {
    const response = await fetch(`${EMPRESAS_URL}/${empresaId}/areas/${areaId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al desvincular el área de mercado de la empresa');
    return await response.json();
};