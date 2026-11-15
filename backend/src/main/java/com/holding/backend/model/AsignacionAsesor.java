package com.holding.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "asignaciones_asesores")
public class AsignacionAsesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asesor_id", nullable = false)
    @JsonIgnoreProperties("asignaciones")
    private Asesor asesor;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    @ManyToOne
    @JoinColumn(name = "area_mercado_id", nullable = false)
    private AreaMercado areaMercado;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    public AsignacionAsesor() {}

    public AsignacionAsesor(Asesor asesor, Empresa empresa, AreaMercado areaMercado, LocalDate fechaInicio) {
        this.asesor = asesor;
        this.empresa = empresa;
        this.areaMercado = areaMercado;
        this.fechaInicio = fechaInicio;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asesor getAsesor() { return asesor; }
    public void setAsesor(Asesor asesor) { this.asesor = asesor; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public AreaMercado getAreaMercado() { return areaMercado; }
    public void setAreaMercado(AreaMercado areaMercado) { this.areaMercado = areaMercado; }

    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
}