const API_URL = 'http://localhost:8080/api/vendedores';

export const listarVendedores = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los vendedores');
    return await response.json();
};

export const listarVendedoresPorEmpresa = async (empresaId) => {
    const response = await fetch(`${API_URL}/empresa/${empresaId}`);
    if (!response.ok) throw new Error('Error al filtrar vendedores por empresa');
    return await response.json();
};

export const crearVendedor = async (vendedor) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendedor),
    });
    if (!response.ok) throw new Error('Error al registrar el vendedor');
    return await response.json();
};

export const registrarCaptacion = async (idCaptador, idSubordinado) => {
    const response = await fetch(`${API_URL}/${idCaptador}/captar/${idSubordinado}`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Error al registrar la captación piramidal');
    return await response.json();
};