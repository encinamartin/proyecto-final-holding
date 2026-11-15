package com.holding.backend.controller;

import com.holding.backend.model.Empresa;
import com.holding.backend.service.EmpresaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "*")
public class EmpresaController {

    private final EmpresaService empresaService;

    public EmpresaController(EmpresaService empresaService) {
        this.empresaService = empresaService;
    }

    @PostMapping
    public ResponseEntity<Empresa> crearEmpresa(@RequestBody Empresa empresa) {
        Empresa nuevaEmpresa = empresaService.guardarEmpresa(empresa);
        return new ResponseEntity<>(nuevaEmpresa, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> listarEmpresas() {
        List<Empresa> empresas = empresaService.listarTodas();
        return ResponseEntity.ok(empresas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerEmpresaPorId(@PathVariable Long id) {
        Empresa empresa = empresaService.buscarPorId(id);
        return ResponseEntity.ok(empresa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEmpresa(@PathVariable Long id) {
        empresaService.eliminarEmpresa(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{empresaId}/areas/{areaId}")
    public ResponseEntity<Empresa> asignarAreaMercado(@PathVariable Long empresaId, @PathVariable Long areaId) {
        Empresa empresaActualizada = empresaService.asignarAreaMercado(empresaId, areaId);
        return ResponseEntity.ok(empresaActualizada);
    }

    @DeleteMapping("/{empresaId}/areas/{areaId}")
    public ResponseEntity<Empresa> removerAreaMercado(@PathVariable Long empresaId, @PathVariable Long areaId) {
        Empresa empresaActualizada = empresaService.removerAreaMercado(empresaId, areaId);
        return ResponseEntity.ok(empresaActualizada);
    }
}