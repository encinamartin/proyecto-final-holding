package com.holding.backend.service;

import com.holding.backend.model.Vendedor;
import java.util.List;

public interface VendedorService {
    Vendedor guardarVendedor(Vendedor vendedor);
    List<Vendedor> listarTodos();
    List<Vendedor> listarPorEmpresa(Long empresaId);
    Vendedor buscarPorId(Long id);
    Vendedor registrarCaptacion(Long idCaptador, Long idSubordinado);
}
