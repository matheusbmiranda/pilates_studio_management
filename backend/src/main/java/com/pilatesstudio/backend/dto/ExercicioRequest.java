package com.pilatesstudio.backend.dto;

import com.pilatesstudio.backend.model.enums.Aparelho;
import com.pilatesstudio.backend.model.enums.FocoMuscular;
import com.pilatesstudio.backend.model.enums.NivelAluno;
import com.pilatesstudio.backend.model.enums.RegiaoCorporal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ExercicioRequest {

    @NotBlank(message = "O nome não pode estar vazio.")
    private String nome;

    private String traducao;

    @NotEmpty(message = "Selecione o(s) nível(is) deste exercício.")
    private Set<NivelAluno> niveis;

    @NotEmpty(message = "Selecione o aparelho deste exercício.")
    private Set<Aparelho> aparelhos;

    @NotEmpty(message = "Selecione a(s) região(ões) corporal(is) deste exercício.")
    private Set<RegiaoCorporal> regioesCorporais;

    @NotEmpty(message = "Selecione o(s) foco(s) muscular(es) deste exercício.")
    private Set<FocoMuscular> focosMusculares;

    @NotEmpty(message = "Informe o(s) objetivo(s) deste exercício.")
    private List<String> objetivos;

    private List<String> contraindicacoes;

    private String imagemUrl;
}

