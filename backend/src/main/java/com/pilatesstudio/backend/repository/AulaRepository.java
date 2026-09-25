package com.pilatesstudio.backend.repository;

import com.pilatesstudio.backend.model.entity.Aula;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AulaRepository extends MongoRepository<Aula, String> {

    List<Aula> findAllByOrderByCriadaEmDesc();

    List<Aula> findByCriadaEmBetweenOrderByCriadaEmDesc(
            LocalDateTime inicio,
            LocalDateTime fim
    );

    long countByCriadaEmBetween(LocalDateTime inicio, LocalDateTime fim);

    List<Aula> findByAlunoIdsContainingOrderByCriadaEmDesc(String alunoId);
}