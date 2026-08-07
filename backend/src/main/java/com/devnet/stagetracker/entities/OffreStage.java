package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "offre_de_stage")

public class OffreStage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOff;

    @Setter
    @Column(nullable = false, length = 100)
    private String titre;

    @Setter
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Setter
    @Column(name = "nombre_places", nullable = false)
    private Integer nombrePlaces;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutOffre statut;

    public enum StatutOffre {
        OUVERTE, FERMEE
    }

    public Integer getId() { return idOff; }
    public void setId(Integer id) { this.idOff = idOff; }

    public String getTitre() { return titre; }

    public String getDescription() { return description; }

    public Integer getNombrePlaces() { return nombrePlaces; }

    public StatutOffre getStatut() { return statut; }


}
