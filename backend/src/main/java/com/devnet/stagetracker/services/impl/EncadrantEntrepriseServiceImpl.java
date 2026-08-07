package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.EncadrantEntreprise;
import com.devnet.stagetracker.repositories.EncadrantEntrepriseRepository;
import com.devnet.stagetracker.services.interfaces.IEncadrantEntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class EncadrantEntrepriseServiceImpl
        extends AbstractCrudServiceImpl<EncadrantEntreprise, Integer>
        implements IEncadrantEntrepriseService {

    @Autowired
    private EncadrantEntrepriseRepository EncadrantEntrepriseRepository;

    @Override
    protected JpaRepository<EncadrantEntreprise, Integer> getRepository() {
        return EncadrantEntrepriseRepository;
    }

    @Override
    protected void assignerId(EncadrantEntreprise entite, Integer id) {
        entite.setUserID(id);
    }
}
