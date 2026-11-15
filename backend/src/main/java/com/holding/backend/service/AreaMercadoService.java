package com.holding.backend.service;

import com.holding.backend.model.AreaMercado;
import java.util.List;

public interface AreaMercadoService {
    AreaMercado guardarAreaMercado(AreaMercado areaMercado);
    List<AreaMercado> listarTodas();
    AreaMercado buscarPorId(Long id);
    void eliminarAreaMercado(Long id);
}