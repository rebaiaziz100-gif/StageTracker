package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.entities.OffreStage;
import com.devnet.stagetracker.services.interfaces.IOffreStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offres")
public class OffreStageController {

    @Autowired
    private IOffreStageService offreStageService;

    @GetMapping
    public ResponseEntity<List<OffreStage>> getAll() {
        return ResponseEntity.ok(offreStageService.rechercherToutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OffreStage> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(offreStageService.rechercherParId(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OffreStage> create(@RequestBody OffreStage offre) {
        return ResponseEntity.ok(offreStageService.ajouter(offre));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<OffreStage> update(@PathVariable Integer id, @RequestBody OffreStage offre) {
        return ResponseEntity.ok(offreStageService.modifier(id, offre));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        offreStageService.supprimer(id);
        return ResponseEntity.noContent().build();
    }
}