package com.devnet.stagetracker.entities;


import jakarta.persistence.*;

@Entity
@Table(name = "etudiant")

public class Etudiant extends Utilisateur{

    @Column(nullable = false, length = 50)
    private String filiere;

    @Column(nullable = false, length = 20)
    private String niveau;

    @lombok.Setter
    @ManyToOne
    @JoinColumn(name = "universiteID", nullable = false)
    private Universite universite;

    // Getters et Setters
    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public Universite getUniversite() { return universite; }

}
