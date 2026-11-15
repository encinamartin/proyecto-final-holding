package com.holding.backend.controller;

import com.holding.backend.model.AreaMercado;
import com.holding.backend.service.AreaMercadoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/areas-mercado")
@CrossOrigin(origins = "*")
public class AreaMercadoController {

    private final AreaMercadoService areaMercadoService;

    public AreaMercadoController(AreaMercadoService areaMercadoService) {
        this.areaMercadoService = areaMercadoService;
    }

    @PostMapping
    public ResponseEntity<AreaMercado> crearAreaMercado(@RequestBody AreaMercado areaMercado) {
        AreaMercado nuevaArea = areaMercadoService.guardarAreaMercado(areaMercado);
        return new ResponseEntity<>(nuevaArea, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AreaMercado>> listarAreasMercado() {
        return ResponseEntity.ok(areaMercadoService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaMercado> obtenerAreaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(areaMercadoService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAreaMercado(@PathVariable Long id) {
        areaMercadoService.eliminarAreaMercado(id);
        return ResponseEntity.noContent().build();
    }
}
