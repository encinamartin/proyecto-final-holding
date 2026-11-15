package com.holding.backend.service;

import com.holding.backend.model.Vendedor;
import com.holding.backend.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class VendedorServiceImpl implements VendedorService {

    private final VendedorRepository vendedorRepository;

    // Inyección por constructor
    public VendedorServiceImpl(VendedorRepository vendedorRepository) {
        this.vendedorRepository = vendedorRepository;
    }

    @Override
    @Transactional
    public Vendedor guardarVendedor(Vendedor vendedor) {
        return vendedorRepository.save(vendedor);
    }

    @Override
    public List<Vendedor> listarTodos() {
        return vendedorRepository.findAll();
    }

    @Override
    public List<Vendedor> listarPorEmpresa(Long empresaId) {
        // Usamos la query derivada que armamos antes en el repositorio
        return vendedorRepository.findByEmpresaId(empresaId);
    }

    @Override
    public Vendedor buscarPorId(Long id) {
        return vendedorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado con ID: " + id));
    }

    @Override
    @Transactional
    public Vendedor registrarCaptacion(Long idCaptador, Long idSubordinado) {
        // 1. Buscamos ambos vendedores en la base de datos
        Vendedor captador = buscarPorId(idCaptador);
        Vendedor subordinado = buscarPorId(idSubordinado);

        // 2. Delegamos la lógica de negocio al método encapsulado en el Modelo (POO Puro)
        captador.captarVendedor(subordinado);

        // 3. Guardamos los cambios de ambos (el subordinado actualiza su empresa y captador)
        vendedorRepository.save(captador);
        return vendedorRepository.save(subordinado);
    }
}
