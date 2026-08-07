package com.devnet.stagetracker.dto.request;

public class TacheRequest {

    private String nom;
    private String description;
    private String statut;
    private Integer stageId;
    private Integer encadrantId;

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public Integer getStageId() { return stageId; }
    public void setStageId(Integer stageId) { this.stageId = stageId; }

    public Integer getEncadrantId() { return encadrantId; }
    public void setEncadrantId(Integer encadrantId) { this.encadrantId = encadrantId; }
}
