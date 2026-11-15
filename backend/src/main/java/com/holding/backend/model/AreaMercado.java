package com.holding.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "areas_mercado")
public class AreaMercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_area", nullable = false, unique = true)
    private String nombreArea;

    @Column(length = 500)
    private String descripcion;

    // Constructor vacío requerido por Hibernate
    public AreaMercado() {}

    // Constructor parametrizado
    public AreaMercado(String nombreArea, String descripcion) {
        this.nombreArea = nombreArea;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombreArea() { return nombreArea; }
    public void setNombreArea(String nombreArea) { this.nombreArea = nombreArea; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
}
