package com.devnet.stagetracker.entities;

import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "candidature")
public class Candidature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idCond")
    private Integer idCond;

    @Setter
    @Column(name = "date_depot", nullable = false)
    private LocalDate dateDepot;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutCandidature statut;

    @Setter
    @Column(name = "lettre_motivation", columnDefinition = "TEXT")
    private String lettreMotivation;

    @Setter
    @Column(name = "cv", nullable = false, length = 255)
    private String cv;

    @Setter
    @Column(name = "date_traitement")
    private LocalDate dateTraitement;

    @Setter
    @Column(name = "commentaire", length = 500)
    private String commentaire;

    @Setter
    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @Setter
    @ManyToOne
    @JoinColumn(name = "offre_id", nullable = false)
    private OffreStage offre;

    public enum StatutCandidature {
        EN_ATTENTE, ACCEPTEE, REFUSEE
    }

    public Integer getId() { return idCond; }
    public void setId(Integer id) { this.idCond = idCond; }

    public LocalDate getDateDepot() { return dateDepot; }

    public StatutCandidature getStatut() { return statut; }

    public String getLettreMotivation() { return lettreMotivation; }

    public String getCv() { return cv; }

    public LocalDate getDateTraitement() { return dateTraitement; }

    public String getCommentaire() { return commentaire; }

    public Etudiant getEtudiant() { return etudiant; }

    public OffreStage getOffre() { return offre; }
}
