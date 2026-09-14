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

export async function listarAlunos(
    page: number = 0,
    size: number = 15,
    nome?: string,
): Promise<AlunoPage> {

    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (nome && nome.trim()) {
        params.append('nome', nome.trim());
    }

    return requestJson<AlunoPage>(
        `/alunos?${params.toString()}`,
        {},
    );
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