package com.holding.backend.service;

import com.holding.backend.model.Asesor;
import com.holding.backend.model.AsignacionAsesor;
import java.util.List;

public interface AsesorService {
    Asesor guardarAsesor(Asesor asesor);
    List<Asesor> listarTodos();
    Asesor buscarPorId(Long id);
    void eliminarAsesor(Long id);

    // Métodos para la asignación con auditoría temporal
    AsignacionAsesor asignarAEmpresaYArea(Long asesorId, Long empresaId, Long areaId);
    List<AsignacionAsesor> listarTodasAsignaciones();
    void eliminarAsignacion(Long asignacionId);
}