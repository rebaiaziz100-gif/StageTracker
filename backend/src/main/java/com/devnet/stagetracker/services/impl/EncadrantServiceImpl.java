package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Encadrant;
import com.devnet.stagetracker.repositories.EncadrantRepository;
import com.devnet.stagetracker.services.interfaces.IEncadrantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EncadrantServiceImpl
        extends AbstractCrudServiceImpl<Encadrant, Integer>
        implements IEncadrantService {

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Override
    protected JpaRepository<Encadrant, Integer> getRepository() {
        return encadrantRepository;
    }

    @Override
    protected void assignerId(Encadrant entite, Integer id) {
        entite.setUserID(id);
    }
}
