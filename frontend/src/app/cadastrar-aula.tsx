import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import {
    criarAula,
    type AulaRequest,
} from '@/services/aulas-api';
import {
    listarExercicios,
    type Exercicio,
} from '@/services/exercicios-api';
import {
    listarAlunos,
    type Aluno,
} from '@/services/alunos-api';

const niveis = [
    ['Iniciante', 'INICIANTE'],
    ['Intermediário', 'INTERMEDIARIO'],
    ['Avançado', 'AVANCADO'],
    ['Gestante', 'GESTANTE'],
] as const;

const aparelhos = [
    ['Barrel', 'BARREL'],
    ['Chair', 'CHAIR'],
    ['Cadillac', 'CADILLAC'],
    ['Reformer', 'REFORMER'],
    ['Torre', 'TORRE'],
    ['Mat (Solo)', 'MAT'],
] as const;

const regioesCorporais = [
    ['Coluna cervical', 'COLUNA_CERVICAL'],
    ['Coluna torácica', 'COLUNA_TORACICA'],
    ['Coluna lombar', 'COLUNA_LOMBAR'],
    ['Coluna vertebral', 'COLUNA_VERTEBRAL'],
    ['Centro de forças', 'CENTRO_DE_FORCAS'],
    ['Cadeias laterais', 'CADEIAS_LATERAIS'],
    ['Membros inferiores', 'MEMBROS_INFERIORES'],
    ['Membros superiores', 'MEMBROS_SUPERIORES'],
    ['Abdômen/Core', 'ABDOMEN_CORE'],
    ['Pelve', 'PELVE'],
    ['Quadril', 'QUADRIL'],
    ['Glúteo', 'GLUTEO'],
    ['Corpo inteiro', 'CORPO_INTEIRO'],
] as const;

const focosMusculares = [
    ['Alongamento', 'ALONGAMENTO'],
    ['Mobilidade', 'MOBILIDADE'],
    ['Fortalecimento', 'FORTALECIMENTO'],
    ['Respiração', 'RESPIRACAO'],
] as const;

export default function CadastrarAulaScreen() {
    const router = useRouter();

    const [niveisSelecionados, setNiveisSelecionados] = useState<string[]>([]);
    const [aparelhosSelecionados, setAparelhosSelecionados] = useState<string[]>([]);
    const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>([]);
    const [focosSelecionados, setFocosSelecionados] = useState<string[]>([]);

    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [exerciciosSelecionados, setExerciciosSelecionados] = useState<string[]>([]);

    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
    const [buscaAluno, setBuscaAluno] = useState('');

    const [exercicioInfo, setExercicioInfo] = useState<Exercicio | null>(null);

    const [carregandoExercicios, setCarregandoExercicios] = useState(false);
    const [carregandoAlunos, setCarregandoAlunos] = useState(false);
    const [salvando, setSalvando] = useState(false);

    const [erro, setErro] = useState('');

    const [paginaExercicios, setPaginaExercicios] = useState(0);
    const [totalPaginasExercicios, setTotalPaginasExercicios] = useState(1);

    useEffect(() => {
        const possuiFiltro =
            niveisSelecionados.length > 0 ||
            aparelhosSelecionados.length > 0 ||
            regioesSelecionadas.length > 0 ||
            focosSelecionados.length > 0;

        if (!possuiFiltro) {
            setExercicios([]);
            setExerciciosSelecionados([]);
            return;
        }

        carregarExercicios(0);
    }, [
        niveisSelecionados,
        aparelhosSelecionados,
        regioesSelecionadas,
        focosSelecionados,
    ]);

    useEffect(() => {
        const termo = buscaAluno.trim();

        if (!termo) {
            setAlunos([]);
            setCarregandoAlunos(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setCarregandoAlunos(true);
                setErro('');

                const resposta = await listarAlunos(
                    0,
                    100,
                    termo,
                );

                const termoNormalizado = termo.toLowerCase();

                const alunosEncontrados = resposta.content.filter((aluno) =>
                    aluno.nome.toLowerCase().startsWith(termoNormalizado),
                );

                setAlunos(alunosEncontrados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível buscar os alunos.',
                );
                setAlunos([]);
            } finally {
                setCarregandoAlunos(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [buscaAluno]);

    async function carregarExercicios(pagina: number = 0) {
        try {
            setCarregandoExercicios(true);
            setErro('');

            const resposta = await listarExercicios(
                pagina,
                10,
                '',
                'nome,asc',
                niveisSelecionados,
                aparelhosSelecionados,
                regioesSelecionadas,
                focosSelecionados,
            );

            setExercicios(resposta.content);

            setPaginaExercicios(pagina);
            setTotalPaginasExercicios(
                Math.max(1, resposta.totalPages),
            );

        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar os exercícios.',
            );
        } finally {
            setCarregandoExercicios(false);
        }
    }

    function alternarSelecao(
        valor: string,
        selecionados: string[],
        setSelecionados: React.Dispatch<React.SetStateAction<string[]>>,
    ) {
        setSelecionados((atual) =>
            atual.includes(valor)
                ? atual.filter((item) => item !== valor)
                : [...atual, valor],
        );
    }

    function limparFiltros() {
        setNiveisSelecionados([]);
        setAparelhosSelecionados([]);
        setRegioesSelecionadas([]);
        setFocosSelecionados([]);
        setExerciciosSelecionados([]);
    }

    function limparSelecaoAlunos() {
        setAlunosSelecionados([]);
    }

    async function salvar() {
        setErro('');

        if (niveisSelecionados.length === 0) {
            setErro('Selecione pelo menos um nível.');
            return;
        }

        if (aparelhosSelecionados.length === 0) {
            setErro('Selecione pelo menos um aparelho.');
            return;
        }

        if (regioesSelecionadas.length === 0) {
            setErro('Selecione pelo menos uma região corporal.');
            return;
        }

        if (focosSelecionados.length === 0) {
            setErro('Selecione pelo menos um foco muscular.');
            return;
        }

        if (exerciciosSelecionados.length === 0) {
            setErro('Selecione pelo menos um exercício.');
            return;
        }

        if (alunosSelecionados.length === 0) {
            setErro('Selecione pelo menos um aluno.');
            return;
        }

        const dados: AulaRequest = {
            niveis: niveisSelecionados,
            aparelhos: aparelhosSelecionados,
            regioesCorporais: regioesSelecionadas,
            focosMusculares: focosSelecionados,
            exercicioIds: exerciciosSelecionados,
            alunoIds: alunosSelecionados,
        };

        try {
            setSalvando(true);

            await criarAula(dados);

            router.back();
        } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível salvar a aula.',
            );
        } finally {
            setSalvando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Voltar"
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>

                    <View>
                        <Text style={styles.title}>Nova aula</Text>
                        <Text style={styles.subtitle}>
                            Monte a aula e selecione os alunos
                        </Text>
                    </View>
                </View>

                {erro ? (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>{erro}</Text>
                    </View>
                ) : null}

                <FilterSection
                    title="Nível"
                    options={niveis}
                    selected={niveisSelecionados}
                    onToggle={(valor) =>
                        alternarSelecao(
                            valor,
                            niveisSelecionados,
                            setNiveisSelecionados,
                        )
                    }
                />

                <FilterSection
                    title="Aparelho"
                    options={aparelhos}
                    selected={aparelhosSelecionados}
                    onToggle={(valor) =>
                        alternarSelecao(
                            valor,
                            aparelhosSelecionados,
                            setAparelhosSelecionados,
                        )
                    }
                />

                <FilterSection
                    title="Região corporal"
                    options={regioesCorporais}
                    selected={regioesSelecionadas}
                    onToggle={(valor) =>
                        alternarSelecao(
                            valor,
                            regioesSelecionadas,
                            setRegioesSelecionadas,
                        )
                    }
                />

                <FilterSection
                    title="Foco muscular"
                    options={focosMusculares}
                    selected={focosSelecionados}
                    onToggle={(valor) =>
                        alternarSelecao(
                            valor,
                            focosSelecionados,
                            setFocosSelecionados,
                        )
                    }
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>
                                Exercícios
                            </Text>
                            <Text style={styles.sectionSubtitle}>
                                {exerciciosSelecionados.length}{' '}
                                selecionado(s)
                            </Text>
                        </View>

                        <Pressable
                            onPress={limparFiltros}
                            style={styles.clearSmallButton}
                        >
                            <Text style={styles.clearSmallButtonText}>
                                Limpar filtros
                            </Text>
                        </Pressable>
                    </View>

                    {carregandoExercicios ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator
                                size="small"
                                color="#276749"
                            />
                        </View>
                    ) : exercicios.length === 0 ? (
                        <Text style={styles.emptyText}>
                            Nenhum exercício corresponde aos filtros.
                        </Text>
                    ) : (
                        <View style={styles.exerciseList}>
                            {exercicios.map((exercicio) => {
                                const selecionado =
                                    exerciciosSelecionados.includes(
                                        exercicio.id,
                                    );

                                return (
                                    <View
                                        key={exercicio.id}
                                        style={[
                                            styles.exerciseCard,
                                            selecionado &&
                                            styles.exerciseCardSelected,
                                        ]}
                                    >
                                        <Pressable
                                            onPress={() =>
                                                alternarSelecao(
                                                    exercicio.id,
                                                    exerciciosSelecionados,
                                                    setExerciciosSelecionados,
                                                )
                                            }
                                            style={styles.exerciseMain}
                                        >
                                            <View
                                                style={[
                                                    styles.checkbox,
                                                    selecionado &&
                                                    styles.checkboxSelected,
                                                ]}
                                            >
                                                {selecionado ? (
                                                    <Text
                                                        style={
                                                            styles.checkboxText
                                                        }
                                                    >
                                                        ✓
                                                    </Text>
                                                ) : null}
                                            </View>

                                            <View
                                                style={
                                                    styles.exerciseContent
                                                }
                                            >
                                                <Text
                                                    style={
                                                        styles.exerciseName
                                                    }
                                                >
                                                    {exercicio.nome}
                                                </Text>

                                                {exercicio.traducao ? (
                                                    <Text
                                                        style={
                                                            styles.exerciseTranslation
                                                        }
                                                    >
                                                        {exercicio.traducao}
                                                    </Text>
                                                ) : null}
                                            </View>
                                        </Pressable>

                                        <Pressable
                                            onPress={() =>
                                                setExercicioInfo(
                                                    exercicio,
                                                )
                                            }
                                            style={styles.infoButton}
                                        >
                                            <Text
                                                style={
                                                    styles.infoButtonText
                                                }
                                            >
                                                i
                                            </Text>
                                        </Pressable>
                                    </View>
                                );
                            })}
                            {totalPaginasExercicios > 1 ? (
                                <View style={styles.paginationContainer}>
                                    <Pressable
                                        onPress={() => {
                                            if (
                                                paginaExercicios > 0 &&
                                                !carregandoExercicios
                                            ) {
                                                carregarExercicios(
                                                    paginaExercicios - 1,
                                                );
                                            }
                                        }}
                                        disabled={
                                            paginaExercicios === 0 ||
                                            carregandoExercicios
                                        }
                                        style={[
                                            styles.paginationButton,
                                            (paginaExercicios === 0 ||
                                                carregandoExercicios) &&
                                            styles.paginationButtonDisabled,
                                        ]}
                                    >
                                        <Text style={styles.paginationButtonText}>
                                            ← Anterior
                                        </Text>
                                    </Pressable>

                                    <Text style={styles.paginationText}>
                                        Página {paginaExercicios + 1} de{' '}
                                        {totalPaginasExercicios}
                                    </Text>

                                    <Pressable
                                        onPress={() => {
                                            if (
                                                paginaExercicios <
                                                totalPaginasExercicios - 1 &&
                                                !carregandoExercicios
                                            ) {
                                                carregarExercicios(
                                                    paginaExercicios + 1,
                                                );
                                            }
                                        }}
                                        disabled={
                                            paginaExercicios ===
                                            totalPaginasExercicios - 1 ||
                                            carregandoExercicios
                                        }
                                        style={[
                                            styles.paginationButton,
                                            (paginaExercicios ===
                                                totalPaginasExercicios - 1 ||
                                                carregandoExercicios) &&
                                            styles.paginationButtonDisabled,
                                        ]}
                                    >
                                        <Text style={styles.paginationButtonText}>
                                            Próxima →
                                        </Text>
                                    </Pressable>
                                </View>
                            ) : null}
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View>
                            <Text style={styles.sectionTitle}>
                                Alunos
                            </Text>
                            <Text style={styles.sectionSubtitle}>
                                {alunosSelecionados.length}{' '}
                                selecionado(s)
                            </Text>
                        </View>

                        {alunosSelecionados.length > 0 ? (
                            <Pressable
                                onPress={limparSelecaoAlunos}
                                style={styles.clearSmallButton}
                            >
                                <Text
                                    style={
                                        styles.clearSmallButtonText
                                    }
                                >
                                    Limpar
                                </Text>
                            </Pressable>
                        ) : null}
                    </View>

                    <View style={styles.studentSearch}>
                        <TextInput
                            value={buscaAluno}
                            onChangeText={setBuscaAluno}
                            placeholder="Buscar aluno..."
                            placeholderTextColor="#8B949E"
                            style={styles.studentSearchInput}
                        />
                    </View>

                    {carregandoAlunos ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator
                                size="small"
                                color="#276749"
                            />
                        </View>
                    ) : alunos.length === 0 ? (
                        <Text style={styles.emptyText}>
                            {buscaAluno.trim()
                                ? 'Nenhum aluno encontrado.'
                                : 'Digite o nome do aluno para buscar.'}
                        </Text>
                    ) : (
                        <View style={styles.studentList}>
                            {alunos.map((aluno) => {
                                const selecionado =
                                    alunosSelecionados.includes(
                                        aluno.id,
                                    );

                                return (
                                    <Pressable
                                        key={aluno.id}
                                        onPress={() =>
                                            alternarSelecao(
                                                aluno.id,
                                                alunosSelecionados,
                                                setAlunosSelecionados,
                                            )
                                        }
                                        style={[
                                            styles.studentCard,
                                            selecionado &&
                                            styles.studentCardSelected,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.checkbox,
                                                selecionado &&
                                                styles.checkboxSelected,
                                            ]}
                                        >
                                            {selecionado ? (
                                                <Text
                                                    style={
                                                        styles.checkboxText
                                                    }
                                                >
                                                    ✓
                                                </Text>
                                            ) : null}
                                        </View>

                                        <View style={styles.studentContent}>
                                            <Text
                                                style={
                                                    styles.studentName
                                                }
                                            >
                                                {aluno.nome}
                                            </Text>

                                            <Text
                                                style={
                                                    styles.studentPhone
                                                }
                                            >
                                                {aluno.telefone}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>

                <Pressable
                    onPress={salvar}
                    disabled={salvando}
                    style={[
                        styles.saveButton,
                        salvando && styles.saveButtonDisabled,
                    ]}
                >
                    {salvando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            Salvar aula
                        </Text>
                    )}
                </Pressable>
            </ScrollView>

            <Modal
                visible={exercicioInfo !== null}
                animationType="slide"
                transparent
                onRequestClose={() => setExercicioInfo(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {exercicioInfo ? (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {exercicioInfo.nome}
                                    </Text>

                                    <Pressable
                                        onPress={() =>
                                            setExercicioInfo(null)
                                        }
                                        style={styles.modalClose}
                                    >
                                        <Text
                                            style={
                                                styles.modalCloseText
                                            }
                                        >
                                            ×
                                        </Text>
                                    </Pressable>
                                </View>

                                {exercicioInfo.imagemUrl ? (
                                    <Image
                                        source={{ uri: exercicioInfo.imagemUrl }}
                                        style={styles.exerciseInfoImage}
                                    />
                                ) : null}

                                {exercicioInfo.traducao ? (
                                    <Text
                                        style={
                                            styles.modalTranslation
                                        }
                                    >
                                        {exercicioInfo.traducao}
                                    </Text>
                                ) : null}

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                >
                                    <DetailList
                                        title="Objetivos"
                                        items={exercicioInfo.objetivos}
                                    />

                                    <DetailList
                                        title="Contraindicações"
                                        items={
                                            exercicioInfo.contraindicacoes
                                        }
                                    />
                                </ScrollView>
                            </>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function FilterSection({
                           title,
                           options,
                           selected,
                           onToggle,
                       }: {
    title: string;
    options: readonly (readonly [string, string])[];
    selected: string[];
    onToggle: (valor: string) => void;
}) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>

            <View style={styles.options}>
                {options.map(([label, value]) => {
                    const selecionado = selected.includes(value);

                    return (
                        <Pressable
                            key={value}
                            onPress={() => onToggle(value)}
                            style={[
                                styles.option,
                                selecionado &&
                                styles.optionSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionText,
                                    selecionado &&
                                    styles.optionTextSelected,
                                ]}
                            >
                                {label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

function DetailList({
                        title,
                        items,
                    }: {
    title: string;
    items?: string[];
}) {
    return (
        <View style={styles.detailSection}>
            <Text style={styles.detailTitle}>{title}</Text>

            {!items || items.length === 0 ? (
                <Text style={styles.detailEmpty}>
                    Nenhum item registrado.
                </Text>
            ) : (
                items.map((item, index) => (
                    <Text
                        key={`${item}-${index}`}
                        style={styles.detailItem}
                    >
                        • {item}
                    </Text>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F8F7',
    },

    content: {
        padding: 20,
        paddingBottom: BottomTabInset + 32,
    },

    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        marginBottom: 28,
    },

    backButton: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E9E6',
        borderRadius: 14,
        borderWidth: 1,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },

    backIcon: {
        color: '#276749',
        fontSize: 34,
        fontWeight: '300',
        lineHeight: 37,
        marginTop: -3,
    },

    title: {
        color: '#1D2B25',
        fontSize: 25,
        fontWeight: '700',
    },

    subtitle: {
        color: '#6C7670',
        fontSize: 14,
        marginTop: 3,
    },

    section: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E9E6',
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 18,
        padding: 16,
    },

    sectionHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    sectionTitle: {
        color: '#344139',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
    },

    sectionSubtitle: {
        color: '#737D77',
        fontSize: 12,
    },

    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    option: {
        backgroundColor: '#E9EEEA',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    optionSelected: {
        backgroundColor: '#276749',
    },

    optionText: {
        color: '#48544D',
        fontSize: 13,
        fontWeight: '600',
    },

    optionTextSelected: {
        color: '#FFFFFF',
    },

    clearSmallButton: {
        paddingHorizontal: 8,
        paddingVertical: 5,
    },

    clearSmallButtonText: {
        color: '#276749',
        fontSize: 12,
        fontWeight: '700',
    },

    loadingBox: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    emptyText: {
        color: '#737D77',
        fontSize: 13,
        paddingVertical: 8,
    },

    exerciseList: {
        gap: 8,
    },

    exerciseCard: {
        alignItems: 'center',
        backgroundColor: '#F7F8F7',
        borderColor: '#E5E9E6',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 10,
    },

    exerciseCardSelected: {
        backgroundColor: '#E9F3ED',
        borderColor: '#276749',
    },

    exerciseMain: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },

    checkbox: {
        alignItems: 'center',
        borderColor: '#B8C2BC',
        borderRadius: 6,
        borderWidth: 1.5,
        height: 22,
        justifyContent: 'center',
        marginRight: 10,
        width: 22,
    },

    checkboxSelected: {
        backgroundColor: '#276749',
        borderColor: '#276749',
    },

    checkboxText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    exerciseContent: {
        flex: 1,
    },

    exerciseName: {
        color: '#1D2B25',
        fontSize: 14,
        fontWeight: '700',
    },

    exerciseTranslation: {
        color: '#737D77',
        fontSize: 12,
        marginTop: 3,
    },

    infoButton: {
        alignItems: 'center',
        borderColor: '#276749',
        borderRadius: 999,
        borderWidth: 1,
        height: 28,
        justifyContent: 'center',
        width: 28,
    },

    infoButtonText: {
        color: '#276749',
        fontSize: 14,
        fontWeight: '700',
    },

    studentSearch: {
        backgroundColor: '#F7F8F7',
        borderColor: '#E5E9E6',
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 10,
    },

    studentSearchInput: {
        color: '#1D2B25',
        fontSize: 14,
        height: 46,
        paddingHorizontal: 14,
    },

    studentList: {
        gap: 8,
    },

    studentCard: {
        alignItems: 'center',
        backgroundColor: '#F7F8F7',
        borderColor: '#E5E9E6',
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 12,
    },

    studentCardSelected: {
        backgroundColor: '#E9F3ED',
        borderColor: '#276749',
    },

    studentContent: {
        flex: 1,
    },

    studentName: {
        color: '#1D2B25',
        fontSize: 14,
        fontWeight: '700',
    },

    studentPhone: {
        color: '#737D77',
        fontSize: 12,
        marginTop: 3,
    },

    saveButton: {
        alignItems: 'center',
        backgroundColor: '#276749',
        borderRadius: 12,
        minHeight: 50,
        justifyContent: 'center',
        marginTop: 4,
    },

    saveButtonDisabled: {
        opacity: 0.6,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },

    errorBox: {
        backgroundColor: '#FFF1F0',
        borderColor: '#F3C7C3',
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 16,
        padding: 12,
    },

    errorText: {
        color: '#B42318',
        fontSize: 13,
    },

    modalOverlay: {
        backgroundColor: 'rgba(0,0,0,0.45)',
        flex: 1,
        justifyContent: 'flex-end',
    },

    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '82%',
        padding: 20,
    },

    modalHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },

    modalTitle: {
        color: '#1D2B25',
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        marginRight: 12,
    },

    modalClose: {
        alignItems: 'center',
        backgroundColor: '#E9EEEA',
        borderRadius: 20,
        height: 34,
        justifyContent: 'center',
        width: 34,
    },

    modalCloseText: {
        color: '#276749',
        fontSize: 25,
        fontWeight: '300',
        lineHeight: 28,
    },

    modalTranslation: {
        color: '#737D77',
        fontSize: 13,
        marginBottom: 20,
    },

    detailSection: {
        marginBottom: 20,
    },

    detailTitle: {
        color: '#344139',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },

    detailItem: {
        color: '#48544D',
        fontSize: 14,
        marginBottom: 5,
    },

    detailEmpty: {
        color: '#737D77',
        fontSize: 13,
    },

    paginationContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
    },

    paginationButton: {
        backgroundColor: '#E9EEEA',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    paginationButtonDisabled: {
        opacity: 0.4,
    },

    paginationButtonText: {
        color: '#276749',
        fontSize: 13,
        fontWeight: '700',
    },

    paginationText: {
        color: '#737D77',
        fontSize: 13,
        fontWeight: '600',
    },

    exerciseInfoImage: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 16,
        resizeMode: 'contain',
    },
});