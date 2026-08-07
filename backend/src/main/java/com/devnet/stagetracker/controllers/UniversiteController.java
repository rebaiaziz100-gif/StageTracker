package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.entities.Universite;
import com.devnet.stagetracker.services.interfaces.IUniversiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/universites")
public class UniversiteController {

    @Autowired
    private IUniversiteService UniversiteService;

    @GetMapping
    public ResponseEntity<List<Universite>> getAll() {
        return ResponseEntity.ok(UniversiteService.rechercherToutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Universite> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(UniversiteService.rechercherParId(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Universite> create(@RequestBody Universite offre) {
        return ResponseEntity.ok(UniversiteService.ajouter(offre));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Universite> update(@PathVariable Integer id, @RequestBody Universite offre) {
        return ResponseEntity.ok(UniversiteService.modifier(id, offre));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        UniversiteService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}
