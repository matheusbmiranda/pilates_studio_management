package com.pilatesstudio.backend.dto;

import com.pilatesstudio.backend.model.enums.StatusAluno;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AlunoResponseDTO {

    private String id;

    private String nome;

    private LocalDate dataNascimento;

    private String telefone;

    private String email;

    private StatusAluno status;

    private String observacoes;
}
