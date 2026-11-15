package com.holding.backend.controller;

import com.holding.backend.model.Pais;
import com.holding.backend.service.PaisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paises")
@CrossOrigin(origins = "*")
public class PaisController {

    private final PaisService paisService;

    public PaisController(PaisService paisService) {
        this.paisService = paisService;
    }

    @PostMapping
    public ResponseEntity<Pais> crearPais(@RequestBody Pais pais) {
        Pais nuevoPais = paisService.guardarPais(pais);
        return new ResponseEntity<>(nuevoPais, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Pais>> listarPaises() {
        List<Pais> paises = paisService.listarTodos();
        return ResponseEntity.ok(paises);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pais> obtenerPaisPorId(@PathVariable Long id) {
        Pais pais = paisService.buscarPorId(id);
        return ResponseEntity.ok(pais);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPais(@PathVariable Long id) {
        paisService.eliminarPais(id);
        return ResponseEntity.noContent().build();
    }
}
