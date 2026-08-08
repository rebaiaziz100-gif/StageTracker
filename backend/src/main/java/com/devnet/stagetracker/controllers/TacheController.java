package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.TacheRequest;
import com.devnet.stagetracker.dto.response.TacheResponse;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.Stage;
import com.devnet.stagetracker.entities.Tache;
import com.devnet.stagetracker.repositories.EncadrantRepository;
import com.devnet.stagetracker.repositories.StageRepository;
import com.devnet.stagetracker.services.interfaces.ITacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/taches")
public class TacheController {

    @Autowired
    private ITacheService tacheService;

    @Autowired
    private StageRepository stageRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @GetMapping
    public ResponseEntity<List<TacheResponse>> getAll() {
        List<TacheResponse> responses = tacheService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TacheResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toResponse(tacheService.rechercherParId(id)));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @PostMapping
    public ResponseEntity<Tache> create(@RequestBody TacheRequest request) {
        Tache tache = construire(request);
        return ResponseEntity.ok(tacheService.ajouter(tache));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @PutMapping("/{id}")
    public ResponseEntity<Tache> update(@PathVariable Integer id, @RequestBody TacheRequest request) {
        Tache tache = construire(request);
        return ResponseEntity.ok(tacheService.modifier(id, tache));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        tacheService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private Tache construire(TacheRequest request) {
        Tache tache = new Tache();
        tache.setNom(request.getNom());
        tache.setDescription(request.getDescription());
        tache.setStatut(Tache.StatutTache.valueOf(request.getStatut()));

        Stage stage = stageRepository.findById(request.getStageId())
                .orElseThrow(() -> new ResourceNotFoundException("Stage introuvable"));
        tache.setStage(stage);

        Encadrant encadrant = encadrantRepository.findById(request.getEncadrantId())
                .orElseThrow(() -> new ResourceNotFoundException("Encadrant introuvable"));
        tache.setEncadrant(encadrant);

        return tache;
    }

    private TacheResponse toResponse(Tache tache) {
        TacheResponse response = new TacheResponse();

        response.setId(tache.getId());
        response.setNom(tache.getNom());
        response.setDescription(tache.getDescription());
        response.setStatut(tache.getStatut().name());
        response.setStageId(tache.getStage().getId());
        response.setEncadrantNom(tache.getEncadrant().getNom() + " " + tache.getEncadrant().getPrenom());
        response.setEncadrantId(tache.getEncadrant().getUserID());

        return response;
    }
}
