package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "tache")
public class Tache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idTache")
    private Integer idTache;

    @Setter
    @Column(nullable = false, length = 100)
    private String nom;

    @Setter
    @Column(nullable = false, length = 255)
    private String description;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutTache statut;

    @Setter
    @ManyToOne
    @JoinColumn(name = "stage_id", nullable = false)
    private Stage stage;

    @Setter
    @ManyToOne
    @JoinColumn(name = "encadrant_id", nullable = false)
    private Encadrant encadrant;

    public enum StatutTache {
        A_FAIRE, EN_COURS, TERMINEE
    }

    public Integer getId() { return idTache; }
    public void setId(Integer idTache) { this.idTache = idTache; }

    public String getNom() { return nom; }

    public String getDescription() { return description; }

    public StatutTache getStatut() { return statut; }

    public Stage getStage() { return stage; }

    public Encadrant getEncadrant() { return encadrant; }
}