package com.pilatesstudio.backend.model.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "aulas")
public class Aula {

    @Id
    private String id;

    private List<String> niveis = new ArrayList<>();

    private List<String> aparelhos = new ArrayList<>();

    private List<String> regioesCorporais = new ArrayList<>();

    private List<String> focosMusculares = new ArrayList<>();

    private List<String> exercicioIds = new ArrayList<>();

    private List<String> alunoIds = new ArrayList<>();

    private LocalDateTime criadaEm;
}