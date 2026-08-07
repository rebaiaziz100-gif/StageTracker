package com.devnet.stagetracker.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EntretienResponse {

    private Integer id;
    private LocalDate date;
    private String statut;
    private Integer candidatureId;
    private String encadrantNom;
}
