const API_URL = 'http://localhost:8080/api/asesores';

export const listarAsesores = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener los asesores');
    return await response.json();
};

export const crearAsesor = async (asesor) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(asesor),
    });
    if (!response.ok) throw new Error('Error al registrar el asesor (verificá que el CUIL no esté duplicado)');
    return await response.json();
};

export const eliminarAsesor = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el asesor');
};

export const asignarAsesorAEmpresaYArea = async (asesorId, empresaId, areaId) => {
    const response = await fetch(`${API_URL}/${asesorId}/asignar/${empresaId}/area/${areaId}`, {
        method: 'POST',
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar la asignación del asesor');
    }
    return await response.json();
};

export const listarAsignaciones = async () => {
    const response = await fetch(`${API_URL}/asignaciones`);
    if (!response.ok) throw new Error('Error al obtener las asignaciones de asesores');
    return await response.json();
};

export const eliminarAsignacion = async (asignacionId) => {
    const response = await fetch(`${API_URL}/asignaciones/${asignacionId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar la asignación');
};