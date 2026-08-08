package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class StageResponse {

    private Integer id;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String etat;
    private String etudiantNom;
    private Integer etudiantId;
    private String encadrantNom;
    private Integer encadrantId;
    private Integer candidatureId;
    private String type;
    private String sujetPFE;
    private LocalDate dateSoutenance;
}
