package com.holding.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "paises")
public class Pais {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    private double pib;
    private long habitantes;
    private String capital;

    // Constructor vacío requerido por Hibernate
    public Pais() {}

    // Constructor con parámetros para facilitar la creación de objetos
    public Pais(String nombre, double pib, long habitantes, String capital) {
        this.nombre = nombre;
        this.pib = pib;
        this.habitantes = habitantes;
        this.capital = capital;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPib() { return pib; }
    public void setPib(double pib) { this.pib = pib; }

    public long getHabitantes() { return habitantes; }
    public void setHabitantes(long habitantes) { this.habitantes = habitantes; }

    public String getCapital() { return capital; }
    public void setCapital(String capital) { this.capital = capital; }
}
