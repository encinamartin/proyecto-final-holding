package com.holding.backend.service;

import com.holding.backend.model.AreaMercado;
import com.holding.backend.model.Asesor;
import com.holding.backend.model.AsignacionAsesor;
import com.holding.backend.model.Empresa;
import com.holding.backend.repository.AreaMercadoRepository;
import com.holding.backend.repository.AsesorRepository;
import com.holding.backend.repository.AsignacionAsesorRepository;
import com.holding.backend.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class AsesorServiceImpl implements AsesorService {

    private final AsesorRepository asesorRepository;
    private final AsignacionAsesorRepository asignacionAsesorRepository;
    private final EmpresaRepository empresaRepository;
    private final AreaMercadoRepository areaMercadoRepository;

    public AsesorServiceImpl(AsesorRepository asesorRepository,
                             AsignacionAsesorRepository asignacionAsesorRepository,
                             EmpresaRepository empresaRepository,
                             AreaMercadoRepository areaMercadoRepository) {
        this.asesorRepository = asesorRepository;
        this.asignacionAsesorRepository = asignacionAsesorRepository;
        this.empresaRepository = empresaRepository;
        this.areaMercadoRepository = areaMercadoRepository;
    }

    @Override
    @Transactional
    public Asesor guardarAsesor(Asesor asesor) {
        return asesorRepository.save(asesor);
    }

    @Override
    public List<Asesor> listarTodos() {
        return asesorRepository.findAll();
    }

    @Override
    public Asesor buscarPorId(Long id) {
        return asesorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asesor no encontrado con ID: " + id));
    }

    @Override
    @Transactional
    public void eliminarAsesor(Long id) {
        Asesor asesor = buscarPorId(id);
        asesorRepository.delete(asesor);
    }

    @Override
    @Transactional
    public AsignacionAsesor asignarAEmpresaYArea(Long asesorId, Long empresaId, Long areaId) {
        Asesor asesor = buscarPorId(asesorId);

        Empresa empresa = empresaRepository.findById(empresaId)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con ID: " + empresaId));

        AreaMercado area = areaMercadoRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Área de Mercado no encontrada con ID: " + areaId));

        // Regla de coherencia: la empresa debe operar en el área de mercado seleccionada
        boolean empresaOperaEnArea = empresa.getAreasMercado().stream()
                .anyMatch(a -> a.getId().equals(area.getId()));
        if (!empresaOperaEnArea) {
            throw new IllegalArgumentException("La empresa '" + empresa.getNombre() + "' no opera en el área '" + area.getNombreArea() + "'.");
        }

        // Evitamos duplicar exactamente la misma asignación (Asesor + Empresa + Área)
        boolean yaAsignado = asesor.getAsignaciones().stream()
                .anyMatch(asig -> asig.getEmpresa().getId().equals(empresa.getId())
                        && asig.getAreaMercado().getId().equals(area.getId()));
        if (yaAsignado) {
            throw new IllegalArgumentException("El asesor ya se encuentra asignado a esa empresa y área de mercado.");
        }

        AsignacionAsesor asignacion = new AsignacionAsesor();
        asignacion.setAsesor(asesor);
        asignacion.setEmpresa(empresa);
        asignacion.setAreaMercado(area);
        asignacion.setFechaInicio(LocalDate.now());

        return asignacionAsesorRepository.save(asignacion);
    }

    @Override
    public List<AsignacionAsesor> listarTodasAsignaciones() {
        return asignacionAsesorRepository.findAll();
    }

    @Override
    @Transactional
    public void eliminarAsignacion(Long asignacionId) {
        AsignacionAsesor asignacion = asignacionAsesorRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + asignacionId));
        asignacionAsesorRepository.delete(asignacion);
    }
}