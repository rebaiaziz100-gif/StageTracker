
package com.devnet.stagetracker.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CandidatureRequest {

    @NotBlank(message = "La date de dépôt est obligatoire")
    private String dateDepot;

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    @Size(max = 2000, message = "La lettre de motivation ne doit pas dépasser 2000 caractères")
    private String lettreMotivation;

    @NotBlank(message = "Le CV est obligatoire")
    @Size(max = 255, message = "Le CV ne doit pas dépasser 255 caractères")
    private String cv;

    @NotNull(message = "L'identifiant de l'étudiant est obligatoire")
    private Integer etudiantId;

    @NotNull(message = "L'identifiant de l'offre est obligatoire")
    private Integer offreId;

    public String getDateDepot() { return dateDepot; }
    public void setDateDepot(String dateDepot) { this.dateDepot = dateDepot; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getLettreMotivation() { return lettreMotivation; }
    public void setLettreMotivation(String lettreMotivation) { this.lettreMotivation = lettreMotivation; }

    public String getCv() { return cv; }
    public void setCv(String cv) { this.cv = cv; }

    public Integer getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Integer etudiantId) { this.etudiantId = etudiantId; }

    public Integer getOffreId() { return offreId; }
    public void setOffreId(Integer offreId) { this.offreId = offreId; }
}