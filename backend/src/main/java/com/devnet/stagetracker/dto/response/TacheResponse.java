package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TacheResponse {

    private Integer id;
    private String nom;
    private String description;
    private String statut;
    private Integer stageId;
    private String encadrantNom;
    private Integer encadrantId;
}
