package com.pilatesstudio.backend.model.entity;


import com.pilatesstudio.backend.model.enums.Aparelho;
import com.pilatesstudio.backend.model.enums.FocoMuscular;
import com.pilatesstudio.backend.model.enums.NivelAluno;
import com.pilatesstudio.backend.model.enums.RegiaoCorporal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "exercicios")
public class Exercicio {

    @Id
    private String id;

    private String nome;

    private String traducao;

    private Set<NivelAluno> niveis;

    private Set<Aparelho> aparelhos;

    private Set<RegiaoCorporal> regioesCorporais;

    private Set<FocoMuscular> focosMusculares;

    private List<String> objetivos;

    private List<String> contraindicacoes;

    private String imagemUrl;
}
