package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Entretien;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EntretienRepository extends JpaRepository<Entretien, Integer> {
}