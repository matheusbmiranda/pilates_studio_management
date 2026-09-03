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

    @NotBlank(message = "O nome não pode estar vazio.")
    private String nome;

    @NotNull(message = "Preencha a data de nascimento.")
    private LocalDate dataNascimento;

    @NotBlank(message = "O telefone não pode estar vazio")
    private String telefone;

    @Email(message = "E-mail inválido.")
    private String email;

    @NotNull(message = "Selecione o status")
    private StatusAluno status;

    private String observacoes;
}
