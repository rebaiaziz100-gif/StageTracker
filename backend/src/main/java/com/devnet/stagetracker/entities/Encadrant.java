package com.devnet.stagetracker.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "encadrant")
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class Encadrant extends Utilisateur{

}
