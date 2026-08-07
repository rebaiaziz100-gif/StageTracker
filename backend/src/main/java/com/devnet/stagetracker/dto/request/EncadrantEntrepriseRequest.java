package com.devnet.stagetracker.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncadrantEntrepriseRequest {

    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;

    private String poste;
    private String departement;
}