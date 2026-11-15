package com.holding.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "empresas")
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(name = "facturacion_anual")
    private double facturacionAnual;

    @Column(name = "fecha_ingreso_holding")
    private LocalDate fechaIngresoHolding;

    @Column(name = "cantidad_vendedores")
    private int cantidadVendedores;

    // Relación ManyToOne: Muchas empresas pueden tener su sede en el mismo País.
    // 'pais_sede_id' será la clave foránea (FK) en la tabla 'empresas'.
    @ManyToOne
    @JoinColumn(name = "pais_sede_id", nullable = false)
    private Pais paisSede;

    // Relación ManyToMany: Una empresa opera en varias áreas; un área tiene varias empresas.
    // Creamos la tabla intermedia 'empresa_area_mercado' de forma automática.
   @ManyToMany
    @JoinTable(
        name = "empresa_area_mercado",
        joinColumns = @JoinColumn(name = "empresa_id"),
        inverseJoinColumns = @JoinColumn(name = "area_mercado_id")
    )
    private Set<AreaMercado> areasMercado = new HashSet<>();

    // Constructor vacío requerido por Hibernate
    public Empresa() {}

    // Constructor parametrizado para facilitar pruebas
    public Empresa(String nombre, double facturacionAnual, LocalDate fechaIngresoHolding, int cantidadVendedores, Pais paisSede) {
        this.nombre = nombre;
        this.facturacionAnual = facturacionAnual;
        this.fechaIngresoHolding = fechaIngresoHolding;
        this.cantidadVendedores = cantidadVendedores;
        this.paisSede = paisSede;
    }

    // Métodos utilitarios para gestionar la colección ManyToMany de forma segura
    public void agregarAreaMercado(AreaMercado area) {
        this.areasMercado.add(area);
    }

    public void removerAreaMercado(AreaMercado area) {
        this.areasMercado.remove(area);
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getFacturacionAnual() { return facturacionAnual; }
    public void setFacturacionAnual(double facturacionAnual) { this.facturacionAnual = facturacionAnual; }

    public LocalDate getFechaIngresoHolding() { return fechaIngresoHolding; }
    public void setFechaIngresoHolding(LocalDate fechaIngresoHolding) { this.fechaIngresoHolding = fechaIngresoHolding; }

    public int getCantidadVendedores() { return cantidadVendedores; }
    public void setCantidadVendedores(int cantidadVendedores) { this.cantidadVendedores = cantidadVendedores; }

    public Pais getPaisSede() { return paisSede; }
    public void setPaisSede(Pais paisSede) { this.paisSede = paisSede; }

    public Set<AreaMercado> getAreasMercado() { return areasMercado; }
    public void setAreasMercado(Set<AreaMercado> areasMercado) { this.areasMercado = areasMercado; }
}
