package com.pilatesstudio.backend.repository;

import com.pilatesstudio.backend.model.entity.Exercicio;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ExercicioRepository extends MongoRepository<Exercicio, String> {

    Page<Exercicio> findByNomeContainingIgnoreCaseOrTraducaoContainingIgnoreCase(String nome, String traducao, Pageable pageable);

}
