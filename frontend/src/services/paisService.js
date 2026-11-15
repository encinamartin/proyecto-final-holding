const API_URL = 'http://localhost:8080/api/paises';

export const listarPaises = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los países');
    return await response.json();
};

export const crearPais = async (pais) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pais),
    });
    if (!response.ok) throw new Error('Error al crear el país');
    return await response.json();
};

export const eliminarPais = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el país');
};