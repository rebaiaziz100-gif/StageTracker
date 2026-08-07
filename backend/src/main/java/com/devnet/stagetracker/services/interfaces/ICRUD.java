package com.devnet.stagetracker.services.interfaces;

import java.util.List;

public interface ICRUD <T, ID> {
    T ajouter(T entite);
    T rechercherParId(ID id);
    List<T> rechercherToutes();
    T modifier(ID id, T entite);
    void supprimer(ID id);
}
