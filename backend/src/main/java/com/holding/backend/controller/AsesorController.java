package com.holding.backend.controller;

import com.holding.backend.model.Asesor;
import com.holding.backend.model.AsignacionAsesor;
import com.holding.backend.service.AsesorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asesores")
@CrossOrigin(origins = "*")
public class AsesorController {

    private final AsesorService asesorService;

    public AsesorController(AsesorService asesorService) {
        this.asesorService = asesorService;
    }

    @PostMapping
    public ResponseEntity<Asesor> crearAsesor(@RequestBody Asesor asesor) {
        Asesor nuevoAsesor = asesorService.guardarAsesor(asesor);
        return new ResponseEntity<>(nuevoAsesor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Asesor>> listarAsesores() {
        return ResponseEntity.ok(asesorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asesor> obtenerAsesorPorId(@PathVariable Long id) {
        return ResponseEntity.ok(asesorService.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAsesor(@PathVariable Long id) {
        asesorService.eliminarAsesor(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{asesorId}/asignar/{empresaId}/area/{areaId}")
    public ResponseEntity<AsignacionAsesor> asignarAsesor(
            @PathVariable Long asesorId,
            @PathVariable Long empresaId,
            @PathVariable Long areaId) {
        AsignacionAsesor nuevaAsignacion = asesorService.asignarAEmpresaYArea(asesorId, empresaId, areaId);
        return new ResponseEntity<>(nuevaAsignacion, HttpStatus.CREATED);
    }

    @GetMapping("/asignaciones")
    public ResponseEntity<List<AsignacionAsesor>> listarAsignaciones() {
        return ResponseEntity.ok(asesorService.listarTodasAsignaciones());
    }

    @DeleteMapping("/asignaciones/{asignacionId}")
    public ResponseEntity<Void> eliminarAsignacion(@PathVariable Long asignacionId) {
        asesorService.eliminarAsignacion(asignacionId);
        return ResponseEntity.noContent().build();
    }
}
