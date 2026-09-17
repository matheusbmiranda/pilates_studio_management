import { API_BASE_URL } from '@/constants/api';

export type AulaRequest = {
    niveis: string[];
    aparelhos: string[];
    regioesCorporais: string[];
    focosMusculares: string[];
    exercicioIds: string[];
    alunoIds: string[];
};

export type Aula = {
    id: string;
    niveis: string[];
    aparelhos: string[];
    regioesCorporais: string[];
    focosMusculares: string[];
    exercicioIds: string[];
    alunoIds: string[];
    criadaEm: string;
};

export async function criarAula(
    aula: AulaRequest,
): Promise<void> {
    await requestJson<void>('/aulas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aula),
    });
}

export async function listarAulas(
    data?: string,
): Promise<Aula[]> {

    const params = new URLSearchParams();

    if (data && data.trim()) {
        params.append('data', data.trim());
    }

    const query = params.toString();

    return requestJson<Aula[]>(
        query ? `/aulas?${query}` : '/aulas',
        {},
    );
}

export async function buscarAulasPorAluno(
    alunoId: string,
): Promise<Aula[]> {

    return requestJson<Aula[]>(
        `/aulas/aluno/${encodeURIComponent(alunoId)}`,
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