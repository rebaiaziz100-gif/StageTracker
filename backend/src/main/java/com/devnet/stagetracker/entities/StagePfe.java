package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "stage_pfe")

public class StagePfe extends Stage {
    @Column(name = "sujet_pfe", nullable = false, length = 200)
    private String sujetPFE;

    @Column(name = "date_soutenance")
    private LocalDate dateSoutenance;

    // Getters et Setters
    public String getSujetPFE() { return sujetPFE; }
    public void setSujetPFE(String sujetPFE) { this.sujetPFE = sujetPFE; }

    public LocalDate getDateSoutenance() { return dateSoutenance; }
    public void setDateSoutenance(LocalDate dateSoutenance) { this.dateSoutenance = dateSoutenance; }
}
