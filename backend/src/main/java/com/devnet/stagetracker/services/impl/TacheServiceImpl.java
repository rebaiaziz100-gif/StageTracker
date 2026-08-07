package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.entities.Tache;
import com.devnet.stagetracker.repositories.TacheRepository;
import com.devnet.stagetracker.services.interfaces.ITacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class TacheServiceImpl
        extends AbstractCrudServiceImpl<Tache, Integer>
        implements ITacheService {

    @Autowired
    private TacheRepository tacheRepository;

    @Override
    protected JpaRepository<Tache, Integer> getRepository() {
        return tacheRepository;
    }

    @Override
    protected void assignerId(Tache entite, Integer id) {
        entite.setId(id);
    }
}
