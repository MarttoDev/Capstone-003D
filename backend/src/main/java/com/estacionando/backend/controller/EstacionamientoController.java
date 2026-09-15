package com.estacionando.backend.controller;

import com.estacionando.backend.model.Estacionamiento;
import com.estacionando.backend.repository.EstacionamientoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estacionamientos")
@CrossOrigin(origins = "*") // Evita bloqueos de CORS al llamar desde Next.js
public class EstacionamientoController {

    private final EstacionamientoRepository repository;

    public EstacionamientoController(EstacionamientoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Estacionamiento> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Estacionamiento> crear(@RequestBody Estacionamiento estacionamiento) {
        if (estacionamiento.getAnfitrionId() == null) {
            estacionamiento.setAnfitrionId(1L); // Asigna a Gaspar si viene nulo
        }
        Estacionamiento nuevo = repository.save(estacionamiento);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }
}