const API_URL = 'http://localhost:8080/api/empresas';

export const listarEmpresas = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las empresas');
    return await response.json();
};

export const obtenerEmpresaPorId = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener la empresa');
    return await response.json();
};

export const crearEmpresa = async (empresa) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(empresa),
    });
    if (!response.ok) throw new Error('Error al crear la empresa');
    return await response.json();
};

export const eliminarEmpresa = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la empresa');
};