package com.pilatesstudio.backend.model.entity;

import com.pilatesstudio.backend.model.enums.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "alunos")
public class Aluno {

    @Id
    private String id;

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
