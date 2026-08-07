package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.StageRequest;
import com.devnet.stagetracker.dto.response.StageResponse;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.entities.Candidature;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.Etudiant;
import com.devnet.stagetracker.entities.Stage;
import com.devnet.stagetracker.entities.StageEte;
import com.devnet.stagetracker.entities.StagePfe;
import com.devnet.stagetracker.repositories.CandidatureRepository;
import com.devnet.stagetracker.repositories.EncadrantRepository;
import com.devnet.stagetracker.repositories.EtudiantRepository;
import com.devnet.stagetracker.services.interfaces.IStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stages")
public class StageController {

    @Autowired
    private IStageService stageService;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    @GetMapping
    public ResponseEntity<List<StageResponse>> getAll() {
        List<StageResponse> responses = stageService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toResponse(stageService.rechercherParId(id)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Stage> create(@RequestBody StageRequest request) {
        Stage stage = construire(request);
        return ResponseEntity.ok(stageService.ajouter(stage));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'ENCADRANTENTREPRISE', 'ENCADRANTUNIVERSITAIRE')")
    @PutMapping("/{id}")
    public ResponseEntity<Stage> update(@PathVariable Integer id, @RequestBody StageRequest request) {
        Stage stage = construire(request);
        return ResponseEntity.ok(stageService.modifier(id, stage));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/valider")
    public ResponseEntity<Stage> valider(@PathVariable Integer id) {
        return ResponseEntity.ok(stageService.valider(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        stageService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private Stage construire(StageRequest request) {
        Stage stage;

        if ("PFE".equalsIgnoreCase(request.getType())) {
            StagePfe stagePfe = new StagePfe();
            stagePfe.setSujetPFE(request.getSujetPFE());
            if (request.getDateSoutenance() != null) {
                stagePfe.setDateSoutenance(LocalDate.parse(request.getDateSoutenance()));
            }
            stage = stagePfe;
        } else {
            stage = new StageEte();
        }

        stage.setDateDebut(LocalDate.parse(request.getDateDebut()));
        stage.setDateFin(LocalDate.parse(request.getDateFin()));
        stage.setEtat(Stage.EtatStage.valueOf(request.getEtat()));

        Etudiant etudiant = etudiantRepository.findById(request.getEtudiantId())
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));
        stage.setEtudiant(etudiant);

        Encadrant encadrant = encadrantRepository.findById(request.getEncadrantId())
                .orElseThrow(() -> new ResourceNotFoundException("Encadrant introuvable"));
        stage.setEncadrant(encadrant);

        Candidature candidature = candidatureRepository.findById(request.getCandidatureId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidature introuvable"));
        stage.setCandidature(candidature);

        return stage;
    }

    private StageResponse toResponse(Stage stage) {
        StageResponse response = new StageResponse();

        response.setId(stage.getId());
        response.setDateDebut(stage.getDateDebut());
        response.setDateFin(stage.getDateFin());
        response.setEtat(stage.getEtat().name());
        response.setEtudiantNom(stage.getEtudiant().getNom() + " " + stage.getEtudiant().getPrenom());
        response.setEncadrantNom(stage.getEncadrant().getNom() + " " + stage.getEncadrant().getPrenom());
        response.setType(stage instanceof StagePfe ? "PFE" : "ETE");

        return response;
    }
}
