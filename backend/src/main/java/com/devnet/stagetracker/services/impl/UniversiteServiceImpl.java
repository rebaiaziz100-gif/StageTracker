package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Universite;
import com.devnet.stagetracker.repositories.UniversiteRepository;
import com.devnet.stagetracker.services.interfaces.IUniversiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class UniversiteServiceImpl
        extends AbstractCrudServiceImpl<Universite, Integer>
        implements IUniversiteService {

    @Autowired
    private UniversiteRepository UniversiteRepository;

    @Override
    protected JpaRepository<Universite, Integer> getRepository() {
        return UniversiteRepository;
    }

    @Override
    protected void assignerId(Universite entite, Integer id) {
        entite.setId(id);
    }
}