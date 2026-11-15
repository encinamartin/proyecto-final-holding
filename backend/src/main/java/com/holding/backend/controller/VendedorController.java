package com.holding.backend.controller;

import com.holding.backend.model.Vendedor;
import com.holding.backend.service.VendedorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/vendedores")
@CrossOrigin(origins = "*")
public class VendedorController {

    private final VendedorService vendedorService;

    public VendedorController(VendedorService vendedorService) {
        this.vendedorService = vendedorService;
    }

    @PostMapping
    public ResponseEntity<Vendedor> crearVendedor(@RequestBody Vendedor vendedor) {
        Vendedor nuevoVendedor = vendedorService.guardarVendedor(vendedor);
        return new ResponseEntity<>(nuevoVendedor, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Vendedor>> listarVendedores() {
        return ResponseEntity.ok(vendedorService.listarTodos());
    }

    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Vendedor>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(vendedorService.listarPorEmpresa(empresaId));
    }

    // Endpoint clave para la regla de negocio: Captación Piramidal
    @PostMapping("/{idCaptador}/captar/{idSubordinado}")
    public ResponseEntity<Vendedor> captarVendedor(
            @PathVariable Long idCaptador, 
            @PathVariable Long idSubordinado) {
        Vendedor actualizado = vendedorService.registrarCaptacion(idCaptador, idSubordinado);
        return ResponseEntity.ok(actualizado);
    }
}
