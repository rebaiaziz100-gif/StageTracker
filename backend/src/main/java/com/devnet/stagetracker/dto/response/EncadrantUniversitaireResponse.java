package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncadrantUniversitaireResponse {

    private Integer userID;

    private String nom;
    private String prenom;
    private String email;

    private String nomUniversite;
    private String fonction;
}