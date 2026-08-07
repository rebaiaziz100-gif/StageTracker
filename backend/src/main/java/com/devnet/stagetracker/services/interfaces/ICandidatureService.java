package com.devnet.stagetracker.services.interfaces;

import com.devnet.stagetracker.entities.Candidature;
import com.devnet.stagetracker.entities.Encadrant;

import java.time.LocalDate;

public interface ICandidatureService extends ICRUD<Candidature, Integer> {
    Candidature accepter(Integer id, Encadrant encadrant, LocalDate dateDebut, LocalDate dateFin,
                          String type, String sujetPFE, LocalDate dateSoutenance);

    Candidature refuser(Integer id, String commentaire);
}
