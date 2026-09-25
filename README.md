# Pilates Studio Management

Sistema para gerenciamento de alunos, exercícios e aulas de um estúdio de Pilates.

O projeto foi desenvolvido com uma arquitetura separando **frontend** e **backend**, utilizando React Native com Expo no frontend, Java com Spring Boot no backend e MongoDB Atlas para persistência dos dados.

## Tecnologias

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- Expo Web

### Backend

- Java
- Spring Boot
- Spring Data MongoDB
- Maven

### Banco e serviços

- MongoDB Atlas
- Cloudinary para armazenamento das imagens dos exercícios

## Estrutura do projeto

```text
Pilates Studio Management/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   └── services/
│   └── ...
│
└── backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       └── resources/
    └── ...
```

## Funcionalidades

### Alunos

- Cadastro de alunos
- Edição de alunos
- Status ativo/inativo
- Busca por nome
- Filtro por status
- Ordenação
- Histórico de aulas por aluno

### Exercícios

- Cadastro de exercícios
- Edição de exercícios
- Busca
- Ordenação
- Filtros por nível, aparelho, região corporal e foco muscular
- Objetivos e contraindicações
- Upload de imagem
- Visualização da imagem cadastrada
- Paginação

### Aulas

- Cadastro de aulas
- Seleção de alunos
- Seleção de exercícios
- Filtros para escolha dos exercícios
- Paginação na seleção de exercícios
- Histórico de aulas
- Consulta de aulas por aluno
- Consulta de aulas por data
- Identificação automática da aula por data

## Modelo das aulas

Cada aula armazena os critérios utilizados no cadastro e as referências dos alunos e exercícios selecionados.

```text
Aula
├── nome
├── níveis
├── aparelhos
├── regiões corporais
├── focos musculares
├── exercícios
├── alunos
└── data de criação
```

Os exercícios e alunos são referenciados por seus IDs. O frontend resolve essas referências quando precisa apresentar os dados completos.

## Execução local

### Backend

Entre na pasta do backend e execute a aplicação Spring Boot pelo Maven ou pela IDE utilizada no projeto.

O backend precisa estar configurado para acessar o MongoDB Atlas e os demais serviços utilizados pela aplicação.

### Frontend

Entre na pasta do frontend e instale as dependências:

```bash
npm install
```

Depois execute o projeto com Expo:

```bash
npx expo start
```

Para abrir a versão web:

```bash
npx expo start --web
```

## Web e mobile

Embora o frontend seja desenvolvido com React Native, o projeto utiliza Expo e pode ser executado também na web por meio do Expo Web.

## Observações

O projeto ainda está em fase de desenvolvimento e passará por melhorias e aperfeiçoamentos. 
