package com.holding.backend.service;

import com.holding.backend.model.Empresa;
import java.util.List;

public interface EmpresaService {
    Empresa guardarEmpresa(Empresa empresa);
    List<Empresa> listarTodas();
    Empresa buscarPorId(Long id);
    void eliminarEmpresa(Long id);
    Empresa asignarAreaMercado(Long empresaId, Long areaId);
    Empresa removerAreaMercado(Long empresaId, Long areaId);
}