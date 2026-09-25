package com.pilatesstudio.backend.dto;

import com.pilatesstudio.backend.model.enums.StatusAluno;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AlunoRequestDTO {

    @NotBlank(message = "Preencha o nome do aluno.")
    private String nome;

    @NotNull(message = "Preencha a data de nascimento do aluno.")
    private LocalDate dataNascimento;

    @NotBlank(message = "Preencha o número de telefone do aluno.")
    private String telefone;

    @Email(message = "Formato de e-mail inválido.")
    private String email;

    @NotNull(message = "Selecione o status.")
    private StatusAluno status;

    private String observacoes;
}
