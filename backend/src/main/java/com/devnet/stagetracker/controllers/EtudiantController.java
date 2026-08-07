package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.EtudiantRequest;
import com.devnet.stagetracker.dto.response.EtudiantResponse;
import com.devnet.stagetracker.entities.Etudiant;
import com.devnet.stagetracker.entities.Universite;
import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.helper.SecurityHelper;
import com.devnet.stagetracker.repositories.UniversiteRepository;
import com.devnet.stagetracker.services.interfaces.IEtudiantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/etudiants")
public class EtudiantController {

    @Autowired
    private IEtudiantService etudiantService;

    @Autowired
    private UniversiteRepository universiteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityHelper securityHelper;

    @GetMapping
    public ResponseEntity<List<EtudiantResponse>> getAll() {
        List<EtudiantResponse> responses = etudiantService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EtudiantResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(toResponse(etudiantService.rechercherParId(id)));
    }

    @PostMapping
    public ResponseEntity<EtudiantResponse> create(@Valid @RequestBody EtudiantRequest request) {

        Etudiant etudiant = new Etudiant();
        etudiant.setNom(request.getNom());
        etudiant.setPrenom(request.getPrenom());
        etudiant.setEmail(request.getEmail());
        etudiant.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        etudiant.setFiliere(request.getFiliere());
        etudiant.setNiveau(request.getNiveau());
        etudiant.setUniversite(rechercherUniversite(request.getUniversiteId()));

        return ResponseEntity.ok(toResponse(etudiantService.ajouter(etudiant)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EtudiantResponse> update(@PathVariable Integer id, @Valid @RequestBody EtudiantRequest request) {

        if (!securityHelper.estAdminOuProprietaire(id)) {
            throw new AccessDeniedException("Vous ne pouvez modifier que votre propre profil");
        }

        Etudiant etudiant = etudiantService.rechercherParId(id);

        etudiant.setNom(request.getNom());
        etudiant.setPrenom(request.getPrenom());
        etudiant.setEmail(request.getEmail());
        etudiant.setFiliere(request.getFiliere());
        etudiant.setNiveau(request.getNiveau());

        if (request.getMotDePasse() != null && !request.getMotDePasse().isBlank()) {
            etudiant.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }

        if (request.getUniversiteId() != null) {
            etudiant.setUniversite(rechercherUniversite(request.getUniversiteId()));
        }

        return ResponseEntity.ok(toResponse(etudiantService.ajouter(etudiant)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!securityHelper.estAdminOuProprietaire(id)) {
            throw new AccessDeniedException("Vous ne pouvez supprimer que votre propre profil");
        }

        etudiantService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private Universite rechercherUniversite(Integer universiteId) {
        return universiteRepository.findById(universiteId)
                .orElseThrow(() -> new ResourceNotFoundException("Université introuvable"));
    }

    private EtudiantResponse toResponse(Etudiant etudiant) {
        EtudiantResponse response = new EtudiantResponse();

        response.setUserID(etudiant.getUserID());
        response.setNom(etudiant.getNom());
        response.setPrenom(etudiant.getPrenom());
        response.setEmail(etudiant.getEmail());
        response.setFiliere(etudiant.getFiliere());
        response.setNiveau(etudiant.getNiveau());
        response.setUniversiteId(etudiant.getUniversite().getId());
        response.setUniversiteNom(etudiant.getUniversite().getNom());

        return response;
    }
}
