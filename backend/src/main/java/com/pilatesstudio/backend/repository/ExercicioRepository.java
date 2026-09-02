package com.pilatesstudio.backend.repository;

import com.pilatesstudio.backend.model.entity.Exercicio;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExercicioRepository extends MongoRepository<Exercicio, String> {
}
