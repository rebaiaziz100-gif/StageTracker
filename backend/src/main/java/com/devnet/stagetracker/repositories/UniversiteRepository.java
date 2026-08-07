package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Universite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversiteRepository extends JpaRepository<Universite, Integer> {
}