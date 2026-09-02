export type StatusAluno = 'Ativo' | 'Inativo';

export interface AtividadeAula {
  equipamento: string;
  exercicios: string[];
}

export interface AulaAluno {
  id: string;
  data: string;
  nivel: string;
  objetivoPrincipal: string;
  objetivosSecundarios: string[];
  atividades: AtividadeAula[];
}

export interface Aluno {
  id: string;
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  status: StatusAluno;
  observacoes: string;
  cadastradoEm: string;
}

const alunosIniciais: Aluno[] = [
  { id: '1', nome: 'Ana Beatriz Costa', dataNascimento: '14/05/1992', telefone: '(11) 98765-4321', email: 'ana.costa@email.com', status: 'Ativo', observacoes: 'Prefere aulas no período da manhã.', cadastradoEm: '2026-08-12' },
  { id: '2', nome: 'Beatriz Almeida', dataNascimento: '22/09/1987', telefone: '(11) 99824-1076', email: 'beatriz.almeida@email.com', status: 'Ativo', observacoes: 'Atenção à mobilidade de ombros.', cadastradoEm: '2026-07-28' },
  { id: '3', nome: 'Camila Rodrigues', dataNascimento: '03/02/1995', telefone: '(11) 97654-1298', email: 'camila.rodrigues@email.com', status: 'Inativo', observacoes: 'Sem aulas registradas.', cadastradoEm: '2026-03-19' },
  { id: '4', nome: 'Carolina Martins', dataNascimento: '18/11/1990', telefone: '(11) 98912-3645', email: 'carolina.martins@email.com', status: 'Ativo', observacoes: '', cadastradoEm: '2026-08-03' },
  { id: '5', nome: 'Fernanda Lima', dataNascimento: '27/07/1984', telefone: '(11) 99183-5072', email: 'fernanda.lima@email.com', status: 'Ativo', observacoes: 'Objetivo: melhorar a postura no trabalho.', cadastradoEm: '2026-06-15' },
  { id: '6', nome: 'Gabriela Souza', dataNascimento: '11/01/1993', telefone: '(11) 96437-2189', email: 'gabriela.souza@email.com', status: 'Inativo', observacoes: '', cadastradoEm: '2026-02-10' },
  { id: '7', nome: 'Juliana Ferreira', dataNascimento: '06/03/1989', telefone: '(11) 98245-7301', email: 'juliana.ferreira@email.com', status: 'Ativo', observacoes: 'Retomou as aulas neste mês.', cadastradoEm: '2026-07-06' },
  { id: '8', nome: 'Larissa Oliveira', dataNascimento: '30/08/1996', telefone: '(11) 97531-8642', email: 'larissa.oliveira@email.com', status: 'Ativo', observacoes: '', cadastradoEm: '2026-05-21' },
  { id: '9', nome: 'Mariana Santos', dataNascimento: '19/06/1988', telefone: '(11) 99374-6250', email: 'mariana.santos@email.com', status: 'Inativo', observacoes: 'Aguardando retorno para reagendar.', cadastradoEm: '2026-01-14' },
  { id: '10', nome: 'Patrícia Gomes', dataNascimento: '08/12/1985', telefone: '(11) 98620-4517', email: 'patricia.gomes@email.com', status: 'Ativo', observacoes: 'Evolução consistente no fortalecimento do core.', cadastradoEm: '2026-08-18' },
];

const aulasPorAluno: Record<string, AulaAluno[]> = {
  '1': [
    { id: 'ana-3', data: '21/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Fortalecimento', objetivosSecundarios: ['Mobilidade', 'Coordenação'], atividades: [{ equipamento: 'Reformer', exercicios: ['Footwork', 'Leg Press'] }, { equipamento: 'Cadillac', exercicios: ['Swan'] }] },
    { id: 'ana-2', data: '19/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Estabilidade', objetivosSecundarios: ['Postura'], atividades: [{ equipamento: 'Chair', exercicios: ['Pumping'] }, { equipamento: 'Mat', exercicios: ['The Hundred'] }] },
    { id: 'ana-1', data: '17/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Mobilidade', objetivosSecundarios: ['Alongamento'], atividades: [{ equipamento: 'Cadillac', exercicios: ['Roll Down'] }] },
  ],
  '10': [
    { id: 'patricia-6', data: '21/08/2026', nivel: 'Avançado', objetivoPrincipal: 'Fortalecimento', objetivosSecundarios: ['Resistência', 'Coordenação'], atividades: [{ equipamento: 'Reformer', exercicios: ['Long Stretch', 'Elephant'] }, { equipamento: 'Chair', exercicios: ['Mountain Climb'] }] },
    { id: 'patricia-5', data: '19/08/2026', nivel: 'Avançado', objetivoPrincipal: 'Estabilidade', objetivosSecundarios: ['Equilíbrio'], atividades: [{ equipamento: 'Cadillac', exercicios: ['Push Through', 'Hanging Back'] }] },
    { id: 'patricia-4', data: '17/08/2026', nivel: 'Avançado', objetivoPrincipal: 'Mobilidade', objetivosSecundarios: ['Postura'], atividades: [{ equipamento: 'Ladder Barrel', exercicios: ['Side Stretch'] }] },
    { id: 'patricia-3', data: '14/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Fortalecimento', objetivosSecundarios: ['Core'], atividades: [{ equipamento: 'Mat', exercicios: ['Teaser', 'Single Leg Stretch'] }] },
    { id: 'patricia-2', data: '12/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Coordenação', objetivosSecundarios: ['Mobilidade'], atividades: [{ equipamento: 'Reformer', exercicios: ['Short Box Series'] }] },
    { id: 'patricia-1', data: '10/08/2026', nivel: 'Intermediário', objetivoPrincipal: 'Avaliação inicial', objetivosSecundarios: ['Postura', 'Mobilidade'], atividades: [{ equipamento: 'Cadillac', exercicios: ['Leg Springs'] }] },
  ],
};

let alunos = alunosIniciais;
const listeners = new Set<() => void>();

export function obterAlunosMockados() { return alunos; }
export function obterAlunoMockado(id: string) { return alunos.find((aluno) => aluno.id === id); }
export function obterAulasDoAlunoMockadas(alunoId: string) { return aulasPorAluno[alunoId] ?? []; }
export function atualizarAlunoMockado(alunoAtualizado: Aluno) {
  alunos = alunos.map((aluno) => aluno.id === alunoAtualizado.id ? alunoAtualizado : aluno);
  listeners.forEach((listener) => listener());
}
export function assinarAlunosMockados(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
