package com.estacionando.backend.repository;

import com.estacionando.backend.model.Estacionamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstacionamientoRepository extends JpaRepository<Estacionamiento, Long> {
}