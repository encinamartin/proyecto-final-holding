package com.holding.backend.service;

import com.holding.backend.model.AreaMercado;
import com.holding.backend.repository.AreaMercadoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AreaMercadoServiceImpl implements AreaMercadoService {

    private final AreaMercadoRepository areaMercadoRepository;

    public AreaMercadoServiceImpl(AreaMercadoRepository areaMercadoRepository) {
        this.areaMercadoRepository = areaMercadoRepository;
    }

    @Override
    @Transactional
    public AreaMercado guardarAreaMercado(AreaMercado areaMercado) {
        return areaMercadoRepository.save(areaMercado);
    }

    @Override
    public List<AreaMercado> listarTodas() {
        return areaMercadoRepository.findAll();
    }

    @Override
    public AreaMercado buscarPorId(Long id) {
        return areaMercadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Área de mercado no encontrada con ID: " + id));
    }

    @Override
    @Transactional
    public void eliminarAreaMercado(Long id) {
        AreaMercado area = buscarPorId(id);
        areaMercadoRepository.delete(area);
    }
}
