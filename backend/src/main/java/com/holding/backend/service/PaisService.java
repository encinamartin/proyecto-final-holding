package com.holding.backend.service;

import com.holding.backend.model.Pais;
import java.util.List;

public interface PaisService {
    Pais guardarPais(Pais pais);
    List<Pais> listarTodos();
    Pais buscarPorId(Long id);
    void eliminarPais(Long id);
}
