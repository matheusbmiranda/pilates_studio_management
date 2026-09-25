import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buscarAulaPorId, type Aula } from '@/services/aulas-api';
import { buscarAlunoPorId, type Aluno } from '@/services/alunos-api';
import { buscarExercicioPorId, type Exercicio } from '@/services/exercicios-api';

function formatarData(data: string) {
    const parteData = data.slice(0, 10);
    const [ano, mes, dia] = parteData.split('-');

    if (!ano || !mes || !dia) {
        return '-';
    }

    return `${dia}/${mes}/${ano}`;
}

function formatarNivel(valor: string) {
    const niveis: Record<string, string> = {
        INICIANTE: 'Iniciante',
        INTERMEDIARIO: 'Intermediário',
        AVANCADO: 'Avançado',
    };

    return niveis[valor] ?? valor;
}

function formatarAparelho(valor: string) {
    const aparelhos: Record<string, string> = {
        BARREL: 'Barrel',
        CHAIR: 'Chair',
        CADILLAC: 'Cadillac',
        REFORMER: 'Reformer',
        TORRE: 'Torre',
        MAT: 'Mat (Solo)',
    };

    return aparelhos[valor] ?? valor;
}

function formatarRegiao(valor: string) {
    const regioes: Record<string, string> = {
        COLUNA_CERVICAL: 'Coluna cervical',
        COLUNA_TORACICA: 'Coluna torácica',
        COLUNA_LOMBAR: 'Coluna lombar',
        MEMBROS_INFERIORES: 'Membros inferiores',
        MEMBROS_SUPERIORES: 'Membros superiores',
        ABDOMEN_CORE: 'Abdômen/Core',
        PELVE: 'Pelve',
        QUADRIL: 'Quadril',
        GLUTEO: 'Glúteo',
        CORPO_INTEIRO: 'Corpo inteiro',
        COLUNA_VERTEBRAL: 'Coluna vertebral',
        CENTRO_DE_FORCAS: 'Centro de forças',
        CADEIAS_LATERAIS: 'Cadeias laterais',
    };

    return regioes[valor] ?? valor;
}

function formatarFoco(valor: string) {
    const focos: Record<string, string> = {
        ALONGAMENTO: 'Alongamento',
        MOBILIDADE: 'Mobilidade',
        FORTALECIMENTO: 'Fortalecimento',
        RESPIRACAO: 'Respiração',
    };

    return focos[valor] ?? valor;
}

export default function DetalhesAulaScreen() {
    const router = useRouter();
    const { aulaId } = useLocalSearchParams<{ aulaId?: string }>();

    const [aula, setAula] = useState<Aula | null>(null);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [exercicios, setExercicios] = useState<Exercicio[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        async function carregar() {
            if (!aulaId || typeof aulaId !== 'string') {
                setErro('Aula não encontrada.');
                setCarregando(false);
                return;
            }

            try {
                const resposta = await buscarAulaPorId(aulaId);

                const alunosResultados = await Promise.allSettled(
                    resposta.alunoIds.map((id) => buscarAlunoPorId(id)),
                );

                const exerciciosResultados = await Promise.allSettled(
                    resposta.exercicioIds.map((id) => buscarExercicioPorId(id)),
                );

                const alunosCarregados = alunosResultados
                    .filter(
                        (resultado): resultado is PromiseFulfilledResult<Aluno> =>
                            resultado.status === 'fulfilled',
                    )
                    .map((resultado) => resultado.value);

                const exerciciosCarregados = exerciciosResultados
                    .filter(
                        (resultado): resultado is PromiseFulfilledResult<Exercicio> =>
                            resultado.status === 'fulfilled',
                    )
                    .map((resultado) => resultado.value);

                setAula(resposta);
                setAlunos(alunosCarregados);
                setExercicios(exerciciosCarregados);
            } catch (error) {
                setErro(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar a aula.',
                );
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [aulaId]);

    if (carregando) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#276749" />
                    <Text style={styles.loadingText}>
                        Carregando aula...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!aula) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.center}>
                    <Text style={styles.errorTitle}>
                        Não foi possível carregar a aula.
                    </Text>

                    {erro && (
                        <Text style={styles.errorText}>
                            {erro}
                        </Text>
                    )}

                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text style={styles.backButtonText}>
                            Voltar
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
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
                        onPress={() => router.back()}
                        style={styles.backIconButton}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>

                    <View>
                        <Text style={styles.title}>
                            Aula {formatarData(aula.criadaEm)}
                        </Text>

                        <Text style={styles.subtitle}>
                            Registro da aula
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nível</Text>

                    {aula.niveis.map((nivel) => (
                        <Text key={nivel} style={styles.value}>
                            {formatarNivel(nivel)}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aparelho</Text>

                    {aula.aparelhos.map((aparelho) => (
                        <Text key={aparelho} style={styles.value}>
                            {formatarAparelho(aparelho)}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Região muscular
                    </Text>

                    {aula.regioesCorporais.map((regiao) => (
                        <Text key={regiao} style={styles.value}>
                            {formatarRegiao(regiao)}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Foco muscular
                    </Text>

                    {aula.focosMusculares.map((foco) => (
                        <Text key={foco} style={styles.value}>
                            {formatarFoco(foco)}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Exercícios
                    </Text>

                    {exercicios.length === 0 ? (
                        <Text style={styles.emptyDetail}>
                            Sem exercícios para essa aula
                        </Text>
                    ) : (
                        exercicios.map((exercicio) => (
                            <Text key={exercicio.id} style={styles.listItem}>
                                • {exercicio.nome}
                            </Text>
                        ))
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Alunos
                    </Text>

                    {alunos.length === 0 ? (
                        <Text style={styles.emptyDetail}>
                            Sem alunos para essa aula
                        </Text>
                    ) : (
                        alunos.map((aluno) => (
                            <Text key={aluno.id} style={styles.listItem}>
                                • {aluno.nome}
                            </Text>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F7F8F7',
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        marginBottom: 30,
    },

    backIconButton: {
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
        marginBottom: 14,
        padding: 16,
    },

    sectionTitle: {
        color: '#344139',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },

    value: {
        color: '#1D2B25',
        fontSize: 15,
        marginBottom: 4,
    },

    listItem: {
        color: '#48544D',
        fontSize: 14,
        marginBottom: 6,
    },

    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },

    loadingText: {
        color: '#68736C',
        fontSize: 14,
        marginTop: 12,
    },

    errorTitle: {
        color: '#1D2B25',
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },

    errorText: {
        color: '#B42318',
        fontSize: 13,
        marginTop: 8,
        textAlign: 'center',
    },

    backButton: {
        backgroundColor: '#276749',
        borderRadius: 10,
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 11,
    },

    backButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },

    emptyDetail: {
        color: '#737D77',
        fontSize: 14,
    },
});