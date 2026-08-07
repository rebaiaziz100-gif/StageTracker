package com.devnet.stagetracker.dto.request;

public class StageRequest {

    private String type; // "ETE" ou "PFE"
    private String dateDebut;
    private String dateFin;
    private String etat;
    private Integer etudiantId;
    private Integer encadrantId;
    private Integer candidatureId;
    private String sujetPFE;
    private String dateSoutenance;

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }

    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }

    public String getEtat() { return etat; }
    public void setEtat(String etat) { this.etat = etat; }

    public Integer getEtudiantId() { return etudiantId; }
    public void setEtudiantId(Integer etudiantId) { this.etudiantId = etudiantId; }

    public Integer getEncadrantId() { return encadrantId; }
    public void setEncadrantId(Integer encadrantId) { this.encadrantId = encadrantId; }

    public Integer getCandidatureId() { return candidatureId; }
    public void setCandidatureId(Integer candidatureId) { this.candidatureId = candidatureId; }

    public String getSujetPFE() { return sujetPFE; }
    public void setSujetPFE(String sujetPFE) { this.sujetPFE = sujetPFE; }

    public String getDateSoutenance() { return dateSoutenance; }
    public void setDateSoutenance(String dateSoutenance) { this.dateSoutenance = dateSoutenance; }
}
