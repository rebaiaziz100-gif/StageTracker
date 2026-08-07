package com.devnet.stagetracker.entities;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "stage")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public abstract class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idStage")
    private Integer idStage;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EtatStage etat;

    @Setter
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @Setter
    @ManyToOne
    @JoinColumn(name = "encadrant_id", nullable = false)
    private Encadrant encadrant;

    @Setter
    @OneToOne
    @JoinColumn(name = "candidature_id", nullable = false, unique = true)
    private Candidature candidature;

    public enum EtatStage {
        EN_COURS, TERMINE, VALIDE
    }

    public Integer getId() { return idStage; }
    public void setId(Integer id) { this.idStage = id; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public EtatStage getEtat() { return etat; }

    public Etudiant getEtudiant() { return etudiant; }

    public Encadrant getEncadrant() { return encadrant; }

    public Candidature getCandidature() { return candidature; }
}