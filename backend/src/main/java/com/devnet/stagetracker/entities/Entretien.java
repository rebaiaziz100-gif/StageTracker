package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "entretien")

public class Entretien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEnt")
    private Integer id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @lombok.Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutEntretien statut;

    @lombok.Setter
    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    private Candidature candidature;

    @lombok.Setter
    @ManyToOne
    @JoinColumn(name = "encadrant_id", nullable = false)
    private Encadrant encadrant;

    public enum StatutEntretien {
        PLANIFIE, REALISE, ANNULE
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public StatutEntretien getStatut() { return statut; }

    public Candidature getCandidature() { return candidature; }

    public Encadrant getEncadrant() { return encadrant; }

}
