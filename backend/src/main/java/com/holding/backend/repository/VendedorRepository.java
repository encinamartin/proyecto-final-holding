package com.holding.backend.repository;

import com.holding.backend.model.Vendedor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface VendedorRepository extends JpaRepository<Vendedor, Long> {
    // Spring Data genera la query automáticamente leyendo el nombre del método:
    List<Vendedor> findByEmpresaId(Long empresaId);
}
