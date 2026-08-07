package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.EntretienRequest;
import com.devnet.stagetracker.dto.response.EntretienResponse;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.entities.Candidature;
import com.devnet.stagetracker.repositories.CandidatureRepository;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.Entretien;
import com.devnet.stagetracker.repositories.EncadrantRepository;
import com.devnet.stagetracker.services.interfaces.IEntretienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/entretiens")
public class EntretienController {

    @Autowired
    private IEntretienService EntretienService;

    @GetMapping
    public ResponseEntity<List<EntretienResponse>> getAll() {
        List<EntretienResponse> responses = EntretienService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntretienResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toResponse(EntretienService.rechercherParId(id)));
    }

    @Autowired
    private CandidatureRepository candidatureRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @PostMapping
    public ResponseEntity<Entretien> create(@RequestBody EntretienRequest request) {

        Entretien entretien = new Entretien();

        entretien.setDate(LocalDate.parse(request.getDate()));

        entretien.setStatut(
                Entretien.StatutEntretien.valueOf(request.getStatut())
        );

        Candidature candidature = candidatureRepository.findById(request.getIdCond())
                .orElseThrow(() -> new ResourceNotFoundException("Candidature introuvable"));

        entretien.setCandidature(candidature);

        Encadrant encadrant = encadrantRepository.findById(request.getUserID())
                .orElseThrow(() -> new ResourceNotFoundException("Encadrant introuvable"));

        entretien.setEncadrant(encadrant);

        Entretien savedEntretien = EntretienService.ajouter(entretien);

        return ResponseEntity.ok(savedEntretien);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @PutMapping("/{id}")
    public ResponseEntity<Entretien> update(@PathVariable Integer id, @RequestBody Entretien offre) {
        return ResponseEntity.ok(EntretienService.modifier(id, offre));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        EntretienService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private EntretienResponse toResponse(Entretien entretien) {
        EntretienResponse response = new EntretienResponse();

        response.setId(entretien.getId());
        response.setDate(entretien.getDate());
        response.setStatut(entretien.getStatut().name());
        response.setCandidatureId(entretien.getCandidature().getId());
        response.setEncadrantNom(entretien.getEncadrant().getNom() + " " + entretien.getEncadrant().getPrenom());

        return response;
    }
}
