package com.devnet.stagetracker.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntretienRequest {

    private String date;
    private String statut;
    private Integer idCond;
    private Integer userID;
}