package com.holding.backend.repository;

import com.holding.backend.model.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
}
