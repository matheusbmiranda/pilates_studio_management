import { Platform } from 'react-native';

import { API_BASE_URL } from '@/constants/api';

type CloudinarySignature = {
  cloudName: string;
  apiKey: string;
  uploadPreset: string;
  timestamp: number;
  signature: string;
};

export type ExercicioRequest = {
  nome: string;
  traducao: string;
  niveis: string[];
  aparelhos: string[];
  regioesCorporais: string[];
  focosMusculares: string[];
  objetivos: string[];
  contraindicacoes: string[];
  imagemUrl: string | null;
};

export type Exercicio = {
  id: string;
  nome: string;
  traducao: string;
  niveis: string[];
  aparelhos: string[];
  regioesCorporais: string[];
  focosMusculares: string[];
  objetivos: string[];
  contraindicacoes: string[];
  imagemUrl: string | null;
};

export type ExercicioPage = {
  content: Exercicio[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
};

export async function uploadImagemExercicio(uri: string): Promise<string> {
  const signature = await requestJson<CloudinarySignature>('/uploads/cloudinary/signature', { method: 'POST' });
  const formData = new FormData();

  formData.append('api_key', signature.apiKey);
  formData.append('timestamp', String(signature.timestamp));
  formData.append('signature', signature.signature);
  formData.append('upload_preset', signature.uploadPreset);

  if (Platform.OS === 'web') {
    const imageBlob = await fetch(uri).then(async (response) => {
      if (!response.ok) throw new Error('Não foi possível preparar a imagem para upload.');
      return response.blob();
    });
    formData.append('file', imageBlob, 'exercicio.jpg');
  } else {
    formData.append('file', { uri, type: 'image/jpeg', name: 'exercicio.jpg' } as unknown as Blob);
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const payload = await response.json() as { secure_url?: string; error?: { message?: string } };

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? 'Não foi possível enviar a imagem para o Cloudinary.');
  }

  return payload.secure_url;
}

export async function criarExercicio(exercicio: ExercicioRequest): Promise<void> {
  await requestJson('/exercicios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercicio),
  });
}

export async function listarExercicios(
    page: number = 0,
    size: number = 15,
    nome?: string,
    sort?: string,
    nivel?: string[],
    aparelhos?: string[],
    regioesCorporais?: string[],
    focosMusculares?: string[],
): Promise<ExercicioPage> {

  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (nome && nome.trim()) {
    params.append('nome', nome.trim());
  }

  if (sort) {
    params.append('sort', sort);
  }

  if (nivel && nivel.length > 0) {
    nivel.forEach((valor) => {
      params.append('nivel', valor);
    });
  }

  if (aparelhos && aparelhos.length > 0) {
    aparelhos.forEach((valor) => {
      params.append('aparelho', valor);
    });
  }

  if (regioesCorporais && regioesCorporais.length > 0) {
    regioesCorporais.forEach((valor) => {
      params.append('regiaoCorporal', valor);
    });
  }

  if (focosMusculares && focosMusculares.length > 0) {
    focosMusculares.forEach((valor) => {
      params.append('focoMuscular', valor);
    });
  }

  return requestJson<ExercicioPage>(
      `/exercicios?${params.toString()}`,
      {},
  );
}

export async function buscarExercicioPorId(
    id: string,
): Promise<Exercicio> {

  return requestJson<Exercicio>(
      `/exercicios/${id}`,
      {},
  );
}

export async function atualizarExercicio(
    id: string,
    exercicio: ExercicioRequest,
): Promise<Exercicio> {

  return requestJson<Exercicio>(
      `/exercicios/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercicio),
      },
  );
}

async function requestJson<T = unknown>(path: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json().catch(() => undefined) as T | { message?: string; error?: string } | undefined;

  if (!response.ok) {
    const error = payload as { message?: string; error?: string } | undefined;
    throw new Error(error?.message ?? error?.error ?? 'Não foi possível concluir a solicitação.');
  }

  return payload as T;
}
