package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidatureRepository extends JpaRepository<Candidature, Integer> {
}