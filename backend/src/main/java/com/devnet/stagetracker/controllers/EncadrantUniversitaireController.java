package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.request.EncadrantUniversitaireRequest;
import com.devnet.stagetracker.dto.response.EncadrantUniversitaireResponse;
import com.devnet.stagetracker.entities.EncadrantUniversitaire;
import com.devnet.stagetracker.services.interfaces.IEncadrantUniversitaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadrants/universitaires")
@CrossOrigin("*")
public class EncadrantUniversitaireController {

    @Autowired
    private IEncadrantUniversitaireService encadrantUniversitaireService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public EncadrantUniversitaireResponse create(
            @RequestBody EncadrantUniversitaireRequest request) {

        EncadrantUniversitaire encadrant = new EncadrantUniversitaire();

        encadrant.setNom(request.getNom());
        encadrant.setPrenom(request.getPrenom());
        encadrant.setEmail(request.getEmail());

        encadrant.setMotDePasse(
                passwordEncoder.encode(request.getMotDePasse())
        );

        encadrant.setNomUniversite(request.getNomUniversite());
        encadrant.setFonction(request.getFonction());


        EncadrantUniversitaire saved = encadrantUniversitaireService.ajouter(encadrant);


        EncadrantUniversitaireResponse response =
                new EncadrantUniversitaireResponse();

        response.setUserID(saved.getUserID());
        response.setNom(saved.getNom());
        response.setPrenom(saved.getPrenom());
        response.setEmail(saved.getEmail());
        response.setNomUniversite(saved.getNomUniversite());
        response.setFonction(saved.getFonction());


        return response;
    }


    @GetMapping
    public List<EncadrantUniversitaireResponse> getAll() {

        return encadrantUniversitaireService.rechercherToutes()
                .stream()
                .map(encadrant -> {
                    EncadrantUniversitaireResponse response =
                            new EncadrantUniversitaireResponse();

                    response.setUserID(encadrant.getUserID());
                    response.setNom(encadrant.getNom());
                    response.setPrenom(encadrant.getPrenom());
                    response.setEmail(encadrant.getEmail());
                    response.setNomUniversite(encadrant.getNomUniversite());
                    response.setFonction(encadrant.getFonction());

                    return response;
                })
                .toList();
    }
}