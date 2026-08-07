package com.devnet.stagetracker.controllers;

import com.devnet.stagetracker.dto.response.EncadrantResponse;
import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.entities.EncadrantEntreprise;
import com.devnet.stagetracker.services.interfaces.IEncadrantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encadrants")
public class EncadrantController {

    @Autowired
    private IEncadrantService encadrantService;

    @GetMapping
    public ResponseEntity<List<EncadrantResponse>> getAll() {
        List<EncadrantResponse> responses = encadrantService.rechercherToutes()
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        encadrantService.supprimer(id);
        return ResponseEntity.noContent().build();
    }

    private EncadrantResponse toResponse(Encadrant encadrant) {
        EncadrantResponse response = new EncadrantResponse();

        response.setUserID(encadrant.getUserID());
        response.setNom(encadrant.getNom());
        response.setPrenom(encadrant.getPrenom());
        response.setEmail(encadrant.getEmail());
        response.setType(encadrant instanceof EncadrantEntreprise ? "ENTREPRISE" : "UNIVERSITAIRE");

        return response;
    }
}
