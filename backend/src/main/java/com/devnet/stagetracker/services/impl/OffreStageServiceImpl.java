package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.OffreStage;
import com.devnet.stagetracker.repositories.OffreStageRepository;
import com.devnet.stagetracker.services.interfaces.IOffreStageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class OffreStageServiceImpl
        extends AbstractCrudServiceImpl<OffreStage, Integer>
        implements IOffreStageService {

    @Autowired
    private OffreStageRepository offreStageRepository;

    @Override
    protected JpaRepository<OffreStage, Integer> getRepository() {
        return offreStageRepository;
    }

    @Override
    protected void assignerId(OffreStage entite, Integer id) {
        entite.setId(id);
    }
}