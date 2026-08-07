package com.devnet.stagetracker.repositories;

import com.devnet.stagetracker.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
}