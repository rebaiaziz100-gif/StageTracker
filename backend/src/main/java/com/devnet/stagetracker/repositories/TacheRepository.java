package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Tache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TacheRepository extends JpaRepository<Tache, Integer> {
}