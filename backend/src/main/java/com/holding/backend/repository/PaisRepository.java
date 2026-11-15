package com.holding.backend.repository;

import com.holding.backend.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaisRepository extends JpaRepository<Pais, Long> {
    // Al extender JpaRepository<Pais, Long>, ya heredamos los métodos CRUD.
}
