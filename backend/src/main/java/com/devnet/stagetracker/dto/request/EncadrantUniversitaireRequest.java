package com.devnet.stagetracker.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncadrantUniversitaireRequest {

    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;

    private String nomUniversite;
    private String fonction;
}