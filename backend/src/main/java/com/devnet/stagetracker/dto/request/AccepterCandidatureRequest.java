package com.devnet.stagetracker.dto.request;

public class AccepterCandidatureRequest {

    private Integer encadrantId;
    private String dateDebut;
    private String dateFin;
    private String type; // "ETE" ou "PFE"
    private String sujetPFE;
    private String dateSoutenance;

    public Integer getEncadrantId() { return encadrantId; }
    public void setEncadrantId(Integer encadrantId) { this.encadrantId = encadrantId; }

    public String getDateDebut() { return dateDebut; }
    public void setDateDebut(String dateDebut) { this.dateDebut = dateDebut; }

    public String getDateFin() { return dateFin; }
    public void setDateFin(String dateFin) { this.dateFin = dateFin; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSujetPFE() { return sujetPFE; }
    public void setSujetPFE(String sujetPFE) { this.sujetPFE = sujetPFE; }

    public String getDateSoutenance() { return dateSoutenance; }
    public void setDateSoutenance(String dateSoutenance) { this.dateSoutenance = dateSoutenance; }
}
