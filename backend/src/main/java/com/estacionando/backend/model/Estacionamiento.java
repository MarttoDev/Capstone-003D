package com.estacionando.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "estacionamientos")
public class Estacionamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "anfitrion_id", nullable = false)
    private Long anfitrionId = 1L; // Vinculado a Gaspar por defecto

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, length = 255)
    private String direccion;

    @Column(length = 100)
    private String comuna;

    private BigDecimal latitud;
    private BigDecimal longitud;

    @Column(length = 50)
    private String tipo;

    @Column(name = "precio_hora", nullable = false)
    private BigDecimal precioHora;

    private Boolean disponible = true;

    @Column(length = 30)
    private String estado = "ACTIVO";

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Estacionamiento() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getAnfitrionId() { return anfitrionId; }
    public void setAnfitrionId(Long anfitrionId) { this.anfitrionId = anfitrionId; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getComuna() { return comuna; }
    public void setComuna(String comuna) { this.comuna = comuna; }
    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public BigDecimal getPrecioHora() { return precioHora; }
    public void setPrecioHora(BigDecimal precioHora) { this.precioHora = precioHora; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}