package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CandidatureResponse {

    private Integer id;
    private LocalDate dateDepot;
    private String statut;
    private String lettreMotivation;
    private String cv;
    private LocalDate dateTraitement;
    private String commentaire;

    private String etudiantNom;
    private String etudiantPrenom;
    private String offreTitre;
}
