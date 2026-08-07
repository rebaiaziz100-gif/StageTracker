package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
@Entity
@Table(name = "encadrant_universitaire")

public class EncadrantUniversitaire extends Encadrant{

    @Column(name = "nom_universite", nullable = false, length = 100)
    private String nomUniversite;

    @Column(nullable = false, length = 50)
    private String fonction;

    // Getters et Setters
    public String getNomUniversite() { return nomUniversite; }
    public void setNomUniversite(String nomUniversite) { this.nomUniversite = nomUniversite; }

    public String getFonction() { return fonction; }
    public void setFonction(String fonction) { this.fonction = fonction; }
}



