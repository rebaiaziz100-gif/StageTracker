package com.devnet.stagetracker.entities;
import jakarta.persistence.*;
import lombok.Setter;

@Entity
@Table(name = "Universite")

public class Universite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer universiteID;

    @Setter
    @Column(nullable = false, length = 100)
    private String nom;

    @Setter
    @Column(nullable = false, length = 200)
    private String adresse;


    public Integer getId() { return universiteID; }
    public void setId(Integer id) { this.universiteID = id; }

    public String getNom() { return nom; }

    public String getAdresse() { return adresse; }
}
