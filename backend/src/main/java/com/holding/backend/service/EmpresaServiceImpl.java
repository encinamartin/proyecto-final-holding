package com.holding.backend.service;

import com.holding.backend.model.AreaMercado;
import com.holding.backend.model.Empresa;
import com.holding.backend.repository.AreaMercadoRepository;
import com.holding.backend.repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final AreaMercadoRepository areaMercadoRepository;

    public EmpresaServiceImpl(EmpresaRepository empresaRepository, AreaMercadoRepository areaMercadoRepository) {
        this.empresaRepository = empresaRepository;
        this.areaMercadoRepository = areaMercadoRepository;
    }

    @Override
    @Transactional
    public Empresa guardarEmpresa(Empresa empresa) {
        return empresaRepository.save(empresa);
    }

    @Override
    public List<Empresa> listarTodas() {
        return empresaRepository.findAll();
    }

    @Override
    public Empresa buscarPorId(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con el ID: " + id));
    }

    @Override
    @Transactional
    public void eliminarEmpresa(Long id) {
        Empresa empresa = buscarPorId(id);
        empresaRepository.delete(empresa);
    }

    @Override
    @Transactional
    public Empresa asignarAreaMercado(Long empresaId, Long areaId) {
        Empresa empresa = buscarPorId(empresaId);
        AreaMercado area = areaMercadoRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Área de mercado no encontrada con el ID: " + areaId));
        empresa.agregarAreaMercado(area);
        return empresaRepository.save(empresa);
    }

    @Override
    @Transactional
    public Empresa removerAreaMercado(Long empresaId, Long areaId) {
        Empresa empresa = buscarPorId(empresaId);
        AreaMercado area = areaMercadoRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Área de mercado no encontrada con el ID: " + areaId));
        empresa.removerAreaMercado(area);
        return empresaRepository.save(empresa);
    }
}