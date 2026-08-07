package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EncadrantResponse {

    private Integer userID;

    private String nom;
    private String prenom;
    private String email;
    private String type;
}
