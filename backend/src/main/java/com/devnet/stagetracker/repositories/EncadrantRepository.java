package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Encadrant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncadrantRepository extends JpaRepository<Encadrant, Integer> {
}