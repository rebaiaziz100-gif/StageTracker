package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Etudiant;
import com.devnet.stagetracker.entities.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StageRepository extends JpaRepository<Stage, Integer> {

    List<Stage> findByEtudiantAndEtat(Etudiant etudiant, Stage.EtatStage etat);
}