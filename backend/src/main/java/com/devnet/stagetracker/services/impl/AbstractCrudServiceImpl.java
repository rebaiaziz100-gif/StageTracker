package com.devnet.stagetracker.services.impl;

import com.devnet.stagetracker.exception.ResourceNotFoundException;
import com.devnet.stagetracker.services.interfaces.ICRUD;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class AbstractCrudServiceImpl<T,ID> implements ICRUD<T,ID> {

    protected abstract JpaRepository<T, ID> getRepository();
    protected abstract void assignerId(T entite, ID id);

    @Override
    public T ajouter(T entite) {
        return getRepository().save(entite);
    }

    @Override
    public T rechercherParId(ID id) {
        return getRepository().findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ressource introuvable : " + id));
    }

    @Override
    public List<T> rechercherToutes() {
        return getRepository().findAll();
    }

    @Override
    public T modifier(ID id,T entite) {
        assignerId(entite, id);
        return getRepository().save(entite);
    }

    @Override
    public void supprimer(ID id) {
        getRepository().deleteById(id);
    }
}
