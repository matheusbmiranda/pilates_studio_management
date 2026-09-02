package com.pilatesstudio.backend.dto;

import com.pilatesstudio.backend.model.enums.Aparelho;
import com.pilatesstudio.backend.model.enums.FocoMuscular;
import com.pilatesstudio.backend.model.enums.NivelAluno;
import com.pilatesstudio.backend.model.enums.RegiaoCorporal;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ExercicioRequest {

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