package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Entretien;
import com.devnet.stagetracker.repositories.EntretienRepository;
import com.devnet.stagetracker.services.interfaces.IEntretienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EntretienServiceImpl
        extends AbstractCrudServiceImpl<Entretien, Integer>
        implements IEntretienService {

    @Autowired
    private EntretienRepository EntretienRepository;

    @Override
    protected JpaRepository<Entretien, Integer> getRepository() {
        return EntretienRepository;
    }

    @Override
    protected void assignerId(Entretien entite, Integer id) {
        entite.setId(id);
    }
}