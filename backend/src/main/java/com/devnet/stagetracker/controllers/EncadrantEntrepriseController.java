package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.EncadrantEntrepriseRequest;
import com.devnet.stagetracker.dto.response.EncadrantEntrepriseResponse;
import com.devnet.stagetracker.entities.EncadrantEntreprise;
import com.devnet.stagetracker.services.interfaces.IEncadrantEntrepriseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/encadrants/entreprises")
@CrossOrigin("*")
public class EncadrantEntrepriseController {

    @Autowired
    private IEncadrantEntrepriseService encadrantEntrepriseService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public EncadrantEntrepriseResponse create(
            @RequestBody EncadrantEntrepriseRequest request) {

        EncadrantEntreprise encadrant = new EncadrantEntreprise();

        // Attributes inherited from Utilisateur
        encadrant.setNom(request.getNom());
        encadrant.setPrenom(request.getPrenom());
        encadrant.setEmail(request.getEmail());

        encadrant.setMotDePasse(
                passwordEncoder.encode(request.getMotDePasse())
        );

        // Attributes specific to EncadrantEntreprise
        encadrant.setPoste(request.getPoste());
        encadrant.setDepartement(request.getDepartement());


        EncadrantEntreprise saved = encadrantEntrepriseService.ajouter(encadrant);


        EncadrantEntrepriseResponse response =
                new EncadrantEntrepriseResponse();

        response.setUserID(saved.getUserID());

        response.setNom(saved.getNom());
        response.setPrenom(saved.getPrenom());
        response.setEmail(saved.getEmail());

        response.setPoste(saved.getPoste());
        response.setDepartement(saved.getDepartement());


        return response;
    }


    @GetMapping("/{id}")
    public EncadrantEntrepriseResponse getById(
            @PathVariable Integer id) {

        EncadrantEntreprise encadrant = encadrantEntrepriseService.rechercherParId(id);


        EncadrantEntrepriseResponse response =
                new EncadrantEntrepriseResponse();

        response.setUserID(encadrant.getUserID());

        response.setNom(encadrant.getNom());
        response.setPrenom(encadrant.getPrenom());
        response.setEmail(encadrant.getEmail());

        response.setPoste(encadrant.getPoste());
        response.setDepartement(encadrant.getDepartement());


        return response;
    }


    @GetMapping
    public java.util.List<EncadrantEntrepriseResponse> getAll() {

        return encadrantEntrepriseService.rechercherToutes()
                .stream()
                .map(encadrant -> {

                    EncadrantEntrepriseResponse response =
                            new EncadrantEntrepriseResponse();

                    response.setUserID(encadrant.getUserID());

                    response.setNom(encadrant.getNom());
                    response.setPrenom(encadrant.getPrenom());
                    response.setEmail(encadrant.getEmail());

                    response.setPoste(encadrant.getPoste());
                    response.setDepartement(encadrant.getDepartement());

                    return response;

                })
                .toList();
    }
}