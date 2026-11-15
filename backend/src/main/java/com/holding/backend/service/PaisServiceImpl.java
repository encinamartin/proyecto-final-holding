package com.holding.backend.service;

import com.holding.backend.model.Pais;
import com.holding.backend.repository.PaisRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PaisServiceImpl implements PaisService {

    private final PaisRepository paisRepository;

    public PaisServiceImpl(PaisRepository paisRepository) {
        this.paisRepository = paisRepository;
    }

    @Override
    public Pais guardarPais(Pais pais) {
        return paisRepository.save(pais);
    }

    @Override
    public List<Pais> listarTodos() {
        return paisRepository.findAll();
    }

    @Override
    public Pais buscarPorId(Long id) {
        return paisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("País no encontrado con el ID: " + id));
    }

    @Override
    public void eliminarPais(Long id) {
        Pais pais = buscarPorId(id);
        paisRepository.delete(pais);
    }
}
