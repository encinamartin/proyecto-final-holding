package com.holding.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "vendedores")
public class Vendedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_vendedor", nullable = false, unique = true)
    private String codigoVendedor;

    @Column(nullable = false)
    private String nombre;

    private String direccion;

    @Column(name = "fecha_captacion")
    private LocalDate fechaCaptacion;

    // Relación ManyToOne con la Empresa: Un vendedor pertenece de forma exclusiva a una firma.
    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private Empresa empresa;

    // RELACIÓN AUTORREFERENCIADA (Piramidal)
    // Muchos vendedores pueden ser captados por el mismo vendedor "superior".
    @ManyToOne
    @JoinColumn(name = "captador_id")
    @JsonIgnoreProperties({"captados", "captador"})
    private Vendedor captador;

    // Un vendedor "superior" puede captar a muchos vendedores subordinados.
    // El 'mappedBy' apunta al atributo 'captador' de esta misma clase.
    @OneToMany(mappedBy = "captador", cascade = CascadeType.ALL)
    @JsonIgnoreProperties({"captador", "captados"})
    private Set<Vendedor> captados = new HashSet<>();

    // Constructor vacío requerido por Hibernate
    public Vendedor() {}

    // Constructor parametrizado para facilitar el desarrollo
    public Vendedor(String codigoVendedor, String nombre, String direccion, LocalDate fechaCaptacion, Empresa empresa) {
        this.codigoVendedor = codigoVendedor;
        this.nombre = nombre;
        this.direccion = direccion;
        this.fechaCaptacion = fechaCaptacion;
        this.empresa = empresa;
    }

    // Método utilitario para añadir un vendedor captado a la estructura piramidal
    public void captarVendedor(Vendedor subordinado) {
        subordinado.setCaptador(this);
        subordinado.setFechaCaptacion(LocalDate.now()); // Registra la fecha actual de captación
        subordinado.setEmpresa(this.empresa); // Regla de negocio: Debe ser de la misma empresa
        this.captados.add(subordinado);
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoVendedor() { return codigoVendedor; }
    public void setCodigoVendedor(String codigoVendedor) { this.codigoVendedor = codigoVendedor; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public LocalDate getFechaCaptacion() { return fechaCaptacion; }
    public void setFechaCaptacion(LocalDate fechaCaptacion) { this.fechaCaptacion = fechaCaptacion; }

    public Empresa getEmpresa() { return empresa; }
    public void setEmpresa(Empresa empresa) { this.empresa = empresa; }

    public Vendedor getCaptador() { return captador; }
    public void setCaptador(Vendedor captador) { this.captador = captador; }

    public Set<Vendedor> getCaptados() { return captados; }
    public void setCaptados(Set<Vendedor> captados) { this.captados = captados; }
}