package com.holding.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "asesores")
public class Asesor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String cuil;

    private String especialidad;

    @OneToMany(mappedBy = "asesor", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("asesor")
    private Set<AsignacionAsesor> asignaciones = new HashSet<>();

    public Asesor() {}

    public Asesor(String nombre, String cuil, String especialidad) {
        this.nombre = nombre;
        this.cuil = cuil;
        this.especialidad = especialidad;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCuil() { return cuil; }
    public void setCuil(String cuil) { this.cuil = cuil; }

    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }

    public Set<AsignacionAsesor> getAsignaciones() { return asignaciones; }
    public void setAsignaciones(Set<AsignacionAsesor> asignaciones) { this.asignaciones = asignaciones; }
}