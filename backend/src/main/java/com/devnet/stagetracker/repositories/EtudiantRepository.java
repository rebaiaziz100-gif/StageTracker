package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EtudiantRepository extends JpaRepository<Etudiant, Integer> {

}