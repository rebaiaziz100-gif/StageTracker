package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.AccepterCandidatureRequest;
import com.devnet.stagetracker.dto.request.CandidatureRequest;
import com.devnet.stagetracker.dto.request.RefuserCandidatureRequest;
import com.devnet.stagetracker.dto.response.CandidatureResponse;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.entities.Candidature;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.Etudiant;
import com.devnet.stagetracker.entities.OffreStage;
import com.devnet.stagetracker.repositories.EncadrantRepository;
import com.devnet.stagetracker.repositories.EtudiantRepository;
import com.devnet.stagetracker.repositories.OffreStageRepository;
import com.devnet.stagetracker.services.interfaces.ICandidatureService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    @Autowired
    private ICandidatureService candidatureService;

    @Autowired
    private EtudiantRepository etudiantRepository;

    @Autowired
    private OffreStageRepository offreStageRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @GetMapping
    public ResponseEntity<List<CandidatureResponse>> getAll() {
        List<CandidatureResponse> responses = candidatureService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidatureResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toResponse(candidatureService.rechercherParId(id)));
    }

    @PostMapping
    public ResponseEntity<Candidature> create(@Valid @RequestBody CandidatureRequest request) {

        Candidature candidature = new Candidature();
        candidature.setDateDepot(LocalDate.parse(request.getDateDepot()));
        candidature.setStatut(Candidature.StatutCandidature.valueOf(request.getStatut()));
        candidature.setLettreMotivation(request.getLettreMotivation());
        candidature.setCv(request.getCv());

        Etudiant etudiant = etudiantRepository.findById(request.getEtudiantId())
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant introuvable"));
        candidature.setEtudiant(etudiant);

        OffreStage offre = offreStageRepository.findById(request.getOffreId())
                .orElseThrow(() -> new ResourceNotFoundException("Offre introuvable"));
        candidature.setOffre(offre);

        return ResponseEntity.ok(candidatureService.ajouter(candidature));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/accepter")
    public ResponseEntity<Candidature> accepter(@PathVariable Integer id,
                                                 @RequestBody AccepterCandidatureRequest request) {

        Encadrant encadrant = encadrantRepository.findById(request.getEncadrantId())
                .orElseThrow(() -> new ResourceNotFoundException("Encadrant introuvable"));

        Candidature candidature = candidatureService.accepter(
                id,
                encadrant,
                LocalDate.parse(request.getDateDebut()),
                LocalDate.parse(request.getDateFin()),
                request.getType(),
                request.getSujetPFE(),
                request.getDateSoutenance() != null ? LocalDate.parse(request.getDateSoutenance()) : null
        );

        return ResponseEntity.ok(candidature);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/refuser")
    public ResponseEntity<Candidature> refuser(@PathVariable Integer id,
                                                @RequestBody RefuserCandidatureRequest request) {

        Candidature candidature = candidatureService.refuser(id, request.getCommentaire());

        return ResponseEntity.ok(candidature);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        candidatureService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private CandidatureResponse toResponse(Candidature candidature) {
        CandidatureResponse response = new CandidatureResponse();

        response.setId(candidature.getId());
        response.setDateDepot(candidature.getDateDepot());
        response.setStatut(candidature.getStatut().name());
        response.setLettreMotivation(candidature.getLettreMotivation());
        response.setCv(candidature.getCv());
        response.setDateTraitement(candidature.getDateTraitement());
        response.setCommentaire(candidature.getCommentaire());
        response.setEtudiantNom(candidature.getEtudiant().getNom());
        response.setEtudiantPrenom(candidature.getEtudiant().getPrenom());
        response.setOffreTitre(candidature.getOffre().getTitre());

        return response;
    }
}