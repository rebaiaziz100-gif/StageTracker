package com.devnet.stagetracker.entities;
import jakarta.persistence.*;
@Entity
@Table(name = "encadrant_entreprise")

public class EncadrantEntreprise extends Encadrant {
    @Column(nullable = false, length = 50)
    private String poste;
    private String departement;

    // Getters et Setters
    public String getPoste() { return poste; }
    public void setPoste(String poste) { this.poste = poste; }
    public String getDepartement(){ return departement;};
    public void setDepartement(String departement) {this.departement = departement ; }
}
