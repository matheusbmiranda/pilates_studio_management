package com.pilatesstudio.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AulaRequestDTO {

    @NotEmpty(message = "Selecione pelo menos um nível.")
    private List<String> niveis;

    @NotEmpty(message = "Selecione pelo menos um aparelho.")
    private List<String> aparelhos;

    @NotEmpty(message = "Selecione pelo menos uma região corporal.")
    private List<String> regioesCorporais;

    @NotEmpty(message = "Selecione pelo menos um foco muscular.")
    private List<String> focosMusculares;

    @NotEmpty(message = "Selecione pelo menos um exercício.")
    private List<String> exercicioIds;

    @NotEmpty(message = "Selecione pelo menos um aluno que fará essa aula.")
    private List<String> alunoIds;
}