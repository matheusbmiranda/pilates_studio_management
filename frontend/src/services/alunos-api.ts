import { API_BASE_URL } from '@/constants/api';

export type Aluno = {
    id: string;
    nome: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    status: string;
    observacoes: string | null;
};

export type AlunoPage = {
    content: Aluno[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    numberOfElements: number;
    empty: boolean;
};

export type AlunoRequest = {
    nome: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    status: string;
    observacoes?: string;
};

export async function criarAluno(
    aluno: AlunoRequest,
): Promise<Aluno> {
    return requestJson<Aluno>('/alunos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
    });
}

export async function listarAlunos(
    page: number = 0,
    size: number = 15,
    nome?: string,
    status?: string,
    sort?: string,
): Promise<AlunoPage> {

    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (nome && nome.trim()) {
        params.append('nome', nome.trim());
    }

    if (status && status.trim()) {
        params.append('status', status.trim());
    }

    if (sort && sort.trim()) {
        params.append('sort', sort.trim());
    }

    return requestJson<AlunoPage>(
        `/alunos?${params.toString()}`,
        {},
    );
}

export async function buscarAlunoPorId(
    id: string,
): Promise<Aluno> {
    return requestJson<Aluno>(`/alunos/${id}`, {});
}

export async function atualizarAluno(
    id: string,
    aluno: AlunoRequest,
): Promise<Aluno> {
    return requestJson<Aluno>(`/alunos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aluno),
    });
}

async function requestJson<T = unknown>(
    path: string,
    options: RequestInit,
): Promise<T> {

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        options,
    );

    const payload = await response
        .json()
        .catch(() => undefined) as
        T |
        { message?: string; error?: string } |
        undefined;

    if (!response.ok) {
        const error = payload as
            { message?: string; error?: string } |
            undefined;

        throw new Error(
            error?.message ??
            error?.error ??
            'Não foi possível concluir a solicitação.'
        );
    }

    return payload as T;
}