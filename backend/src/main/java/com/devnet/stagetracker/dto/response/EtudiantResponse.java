package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EtudiantResponse {

    private Integer userID;

    private String nom;
    private String prenom;
    private String email;

    private String filiere;
    private String niveau;
    private Integer universiteId;
    private String universiteNom;
}
