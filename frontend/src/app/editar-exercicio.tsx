import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import {
    atualizarExercicio,
    buscarExercicioPorId,
    uploadImagemExercicio,
    type ExercicioRequest,
} from '@/services/exercicios-api';

const niveis = [
    'Iniciante',
    'Intermediário',
    'Avançado',
    'Gestante',
];

const aparelhos = [
    'Barrel',
    'Chair',
    'Cadillac',
    'Reformer',
    'Torre',
    'Mat (Solo)',
];

const regioesCorporais = [
    'Coluna cervical',
    'Coluna torácica',
    'Coluna Lombar',
    'Coluna Vertebral',
    'Centro de Forças',
    'Cadeias Laterais',
    'Membros Inferiores',
    'Membros Superiores',
    'Abdômen/Core',
    'Pelve',
    'Quadril',
    'Glúteo',
    'Corpo Inteiro',
];

const focosMusculares = [
    'Alongamento',
    'Mobilidade',
    'Fortalecimento',
    'Respiração',
];

const nivelParaApi: Record<string, string> = {
    Iniciante: 'INICIANTE',
    Intermediário: 'INTERMEDIARIO',
    Avançado: 'AVANCADO',
    Gestante: 'GESTANTE',
};

const aparelhoParaApi: Record<string, string> = {
    Barrel: 'BARREL',
    Chair: 'CHAIR',
    Cadillac: 'CADILLAC',
    Reformer: 'REFORMER',
    Torre: 'TORRE',
    'Mat (Solo)': 'MAT',
};

const regiaoParaApi: Record<string, string> = {
    'Coluna cervical': 'COLUNA_CERVICAL',
    'Coluna torácica': 'COLUNA_TORACICA',
    'Coluna Lombar': 'COLUNA_LOMBAR',
    'Coluna Vertebral': 'COLUNA_VERTEBRAL',
    'Centro de Forças': 'CENTRO_DE_FORCAS',
    'Cadeias Laterais': 'CADEIAS_LATERAIS',
    'Membros Inferiores': 'MEMBROS_INFERIORES',
    'Membros Superiores': 'MEMBROS_SUPERIORES',
    'Abdômen/Core': 'ABDOMEN_CORE',
    Pelve: 'PELVE',
    Quadril: 'QUADRIL',
    Glúteo: 'GLUTEO',
    'Corpo Inteiro': 'CORPO_INTEIRO',
};

const focoParaApi: Record<string, string> = {
    Alongamento: 'ALONGAMENTO',
    Mobilidade: 'MOBILIDADE',
    Fortalecimento: 'FORTALECIMENTO',
    Respiração: 'RESPIRACAO',
};

function inverterMapa(mapa: Record<string, string>) {
    return Object.fromEntries(
        Object.entries(mapa).map(([label, valorApi]) => [valorApi, label]),
    );
}

const nivelDeApi = inverterMapa(nivelParaApi);
const aparelhoDeApi = inverterMapa(aparelhoParaApi);
const regiaoDeApi = inverterMapa(regiaoParaApi);
const focoDeApi = inverterMapa(focoParaApi);

export default function EditarExercicioScreen() {
    const router = useRouter();

    const { id } = useLocalSearchParams<{ id?: string }>();

    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const [erroOperacao, setErroOperacao] = useState('');

    const [nome, setNome] = useState('');
    const [traducao, setTraducao] = useState('');

    const [niveisSelecionados, setNiveisSelecionados] = useState<string[]>([]);
    const [aparelhosSelecionados, setAparelhosSelecionados] = useState<string[]>([]);
    const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>([]);
    const [focosSelecionados, setFocosSelecionados] = useState<string[]>([]);

    const [objetivos, setObjetivos] = useState<string[]>([]);
    const [novoObjetivo, setNovoObjetivo] = useState('');

    const [contraindicacoes, setContraindicacoes] = useState<string[]>([]);
    const [novaContraindicacao, setNovaContraindicacao] = useState('');

    const [imagemUrl, setImagemUrl] = useState<string | null>(null);
    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

    useEffect(() => {
        carregarExercicio();
    }, [id]);

    async function carregarExercicio() {
        if (!id) {
            setErroOperacao('Exercício não encontrado.');
            setCarregando(false);
            return;
        }

        try {
            setCarregando(true);
            setErroOperacao('');

            const exercicio = await buscarExercicioPorId(id);

            setNome(exercicio.nome ?? '');
            setTraducao(exercicio.traducao ?? '');

            setNiveisSelecionados(
                (exercicio.niveis ?? [])
                    .map((nivel) => nivelDeApi[nivel] ?? nivel)
                    .filter(Boolean),
            );

            setAparelhosSelecionados(
                (exercicio.aparelhos ?? [])
                    .map((aparelho) => aparelhoDeApi[aparelho] ?? aparelho)
                    .filter(Boolean),
            );

            setRegioesSelecionadas(
                (exercicio.regioesCorporais ?? [])
                    .map((regiao) => regiaoDeApi[regiao] ?? regiao)
                    .filter(Boolean),
            );

            setFocosSelecionados(
                (exercicio.focosMusculares ?? [])
                    .map((foco) => focoDeApi[foco] ?? foco)
                    .filter(Boolean),
            );

            setObjetivos(exercicio.objetivos ?? []);
            setContraindicacoes(exercicio.contraindicacoes ?? []);
            setImagemUrl(exercicio.imagemUrl ?? null);
        } catch {
            setErroOperacao('Não foi possível carregar o exercício.');
        } finally {
            setCarregando(false);
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

    function adicionarObjetivo() {
        const valor = novoObjetivo.trim();

        if (!valor) {
            return;
        }

        setObjetivos((atual) => [...atual, valor]);
        setNovoObjetivo('');
    }

    function removerObjetivo(index: number) {
        setObjetivos((atual) => atual.filter((_, i) => i !== index));
    }

    function adicionarContraindicacao() {
        const valor = novaContraindicacao.trim();

        if (!valor) {
            return;
        }

        setContraindicacoes((atual) => [...atual, valor]);
        setNovaContraindicacao('');
    }

    function removerContraindicacao(index: number) {
        setContraindicacoes((atual) =>
            atual.filter((_, i) => i !== index),
        );
    }

    async function selecionarImagem() {
        try {
            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.78,
            });

            if (resultado.canceled || !resultado.assets?.length) {
                return;
            }

            const imagem = resultado.assets[0];

            const imagemRedimensionada = await ImageManipulator.manipulateAsync(
                imagem.uri,
                [
                    {
                        resize: {
                            width: 1280,
                        },
                    },
                ],
                {
                    compress: 0.78,
                    format: ImageManipulator.SaveFormat.JPEG,
                },
            );

            setImagemSelecionada(imagemRedimensionada.uri);
        } catch {
            setErroOperacao('Não foi possível selecionar a imagem.');
        }
    }

    async function salvar() {
        if (!id) {
            setErroOperacao('Exercício não encontrado.');
            return;
        }

        if (!nome.trim()) {
            setErroOperacao('Informe o nome do exercício.');
            return;
        }

        try {
            setSalvando(true);
            setErroOperacao('');

            let novaImagemUrl = imagemUrl;

            if (imagemSelecionada) {
                novaImagemUrl = await uploadImagemExercicio(imagemSelecionada);
            }

            const exercicio: ExercicioRequest = {
                nome: nome.trim(),
                traducao: traducao.trim(),
                niveis: niveisSelecionados.map((nivel) => nivelParaApi[nivel]),
                aparelhos: aparelhosSelecionados.map((aparelho) => aparelhoParaApi[aparelho]),
                regioesCorporais: regioesSelecionadas.map((regiao) => regiaoParaApi[regiao]),
                focosMusculares: focosSelecionados.map((foco) => focoParaApi[foco]),
                objetivos,
                contraindicacoes,
                imagemUrl: novaImagemUrl,
            };

            await atualizarExercicio(id, exercicio);

            router.replace('/(tabs)/exercicios?sucesso=atualizado');
        } catch {
            setErroOperacao('Não foi possível salvar o exercício.');
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return (
            <View style={styles.centralizado}>
                <ActivityIndicator size="large" />
                <Text style={styles.textoCarregando}>
                    Carregando exercício...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.titulo}>Editar exercício</Text>

                <Text style={styles.subtitulo}>
                    Atualize os dados do exercício
                </Text>

                {erroOperacao ? (
                    <Text style={styles.erro}>
                        {erroOperacao}
                    </Text>
                ) : null}

                <Text style={styles.label}>Nome</Text>

                <TextInput
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome do exercício"
                    style={styles.input}
                />

                <Text style={styles.label}>Tradução</Text>

                <TextInput
                    value={traducao}
                    onChangeText={setTraducao}
                    placeholder="Tradução"
                    style={styles.input}
                />

                <Text style={styles.label}>Nível</Text>

                <View style={styles.opcoes}>
                    {niveis.map((nivel) => (
                        <Pressable
                            key={nivel}
                            onPress={() =>
                                alternarSelecao(
                                    nivel,
                                    niveisSelecionados,
                                    setNiveisSelecionados,
                                )
                            }
                            style={[
                                styles.opcao,
                                niveisSelecionados.includes(nivel) && styles.opcaoSelecionada,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.opcaoTexto,
                                    niveisSelecionados.includes(nivel) &&
                                    styles.opcaoTextoSelecionada,
                                ]}
                            >
                                {nivel}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Aparelho</Text>

                <View style={styles.opcoes}>
                    {aparelhos.map((aparelho) => (
                        <Pressable
                            key={aparelho}
                            onPress={() =>
                                alternarSelecao(
                                    aparelho,
                                    aparelhosSelecionados,
                                    setAparelhosSelecionados,
                                )
                            }
                            style={[
                                styles.opcao,
                                aparelhosSelecionados.includes(aparelho) &&
                                styles.opcaoSelecionada,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.opcaoTexto,
                                    aparelhosSelecionados.includes(aparelho) &&
                                    styles.opcaoTextoSelecionada,
                                ]}
                            >
                                {aparelho}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Região corporal</Text>

                <View style={styles.opcoes}>
                    {regioesCorporais.map((regiao) => (
                        <Pressable
                            key={regiao}
                            onPress={() =>
                                alternarSelecao(
                                    regiao,
                                    regioesSelecionadas,
                                    setRegioesSelecionadas,
                                )
                            }
                            style={[
                                styles.opcao,
                                regioesSelecionadas.includes(regiao) &&
                                styles.opcaoSelecionada,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.opcaoTexto,
                                    regioesSelecionadas.includes(regiao) &&
                                    styles.opcaoTextoSelecionada,
                                ]}
                            >
                                {regiao}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Foco muscular</Text>

                <View style={styles.opcoes}>
                    {focosMusculares.map((foco) => (
                        <Pressable
                            key={foco}
                            onPress={() =>
                                alternarSelecao(
                                    foco,
                                    focosSelecionados,
                                    setFocosSelecionados,
                                )
                            }
                            style={[
                                styles.opcao,
                                focosSelecionados.includes(foco) &&
                                styles.opcaoSelecionada,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.opcaoTexto,
                                    focosSelecionados.includes(foco) &&
                                    styles.opcaoTextoSelecionada,
                                ]}
                            >
                                {foco}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>Objetivos</Text>

                <View style={styles.linha}>
                    <TextInput
                        value={novoObjetivo}
                        onChangeText={setNovoObjetivo}
                        placeholder="Digite um objetivo"
                        style={[styles.input, styles.inputFlex]}
                        onSubmitEditing={adicionarObjetivo}
                    />

                    <Pressable
                        onPress={adicionarObjetivo}
                        style={styles.botaoAdicionar}
                    >
                        <Text style={styles.botaoAdicionarTexto}>+</Text>
                    </Pressable>
                </View>

                {objetivos.map((objetivo, index) => (
                    <View key={`${objetivo}-${index}`} style={styles.itemLista}>
                        <Text style={styles.itemTexto}>{objetivo}</Text>

                        <Pressable onPress={() => removerObjetivo(index)}>
                            <Text style={styles.remover}>Remover</Text>
                        </Pressable>
                    </View>
                ))}

                <Text style={styles.label}>Contraindicações</Text>

                <View style={styles.linha}>
                    <TextInput
                        value={novaContraindicacao}
                        onChangeText={setNovaContraindicacao}
                        placeholder="Digite uma contraindicação"
                        style={[styles.input, styles.inputFlex]}
                        onSubmitEditing={adicionarContraindicacao}
                    />

                    <Pressable
                        onPress={adicionarContraindicacao}
                        style={styles.botaoAdicionar}
                    >
                        <Text style={styles.botaoAdicionarTexto}>+</Text>
                    </Pressable>
                </View>

                {contraindicacoes.map((contraindicacao, index) => (
                    <View
                        key={`${contraindicacao}-${index}`}
                        style={styles.itemLista}
                    >
                        <Text style={styles.itemTexto}>
                            {contraindicacao}
                        </Text>

                        <Pressable
                            onPress={() => removerContraindicacao(index)}
                        >
                            <Text style={styles.remover}>Remover</Text>
                        </Pressable>
                    </View>
                ))}

                <Text style={styles.label}>Imagem</Text>

                {imagemSelecionada || imagemUrl ? (
                    <Image
                        source={{
                            uri: imagemSelecionada ?? imagemUrl ?? undefined,
                        }}
                        style={styles.imagem}
                    />
                ) : (
                    <View style={styles.semImagem}>
                        <Text style={styles.semImagemTexto}>
                            Nenhuma imagem cadastrada
                        </Text>
                    </View>
                )}

                <Pressable
                    onPress={selecionarImagem}
                    style={styles.botaoImagem}
                >
                    <Text style={styles.botaoImagemTexto}>
                        Alterar imagem
                    </Text>
                </Pressable>

                <Pressable
                    onPress={salvar}
                    disabled={salvando}
                    style={[
                        styles.botaoSalvar,
                        salvando && styles.botaoDesabilitado,
                    ]}
                >
                    {salvando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoSalvarTexto}>
                            Salvar alterações
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={() => router.back()}
                    disabled={salvando}
                    style={styles.botaoCancelar}
                >
                    <Text style={styles.botaoCancelarTexto}>
                        Cancelar
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    conteudo: {
        padding: 24,
        paddingBottom: 48,
    },

    titulo: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 4,
    },

    subtitulo: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },

    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 18,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },

    linha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    inputFlex: {
        flex: 1,
    },

    opcoes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    opcao: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 9,
    },

    opcaoSelecionada: {
        backgroundColor: '#287653',
        borderColor: '#287653',
    },

    opcaoTexto: {
        fontSize: 14,
        color: '#444',
    },

    opcaoTextoSelecionada: {
        color: '#fff',
    },

    itemLista: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
    },

    itemTexto: {
        flex: 1,
        fontSize: 15,
    },

    remover: {
        color: '#d00',
        marginLeft: 12,
    },

    botaoAdicionar: {
        width: 46,
        height: 46,
        borderRadius: 10,
        backgroundColor: '#287653',
        alignItems: 'center',
        justifyContent: 'center',
    },

    botaoAdicionarTexto: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
    },

    imagem: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 10,
        backgroundColor: '#f2f2f2',
    },

    semImagem: {
        height: 160,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },

    semImagemTexto: {
        color: '#777',
    },

    botaoImagem: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: 'center',
    },

    botaoImagemTexto: {
        fontSize: 15,
        fontWeight: '600',
    },

    botaoSalvar: {
        marginTop: 28,
        backgroundColor: '#287653',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
    },

    botaoDesabilitado: {
        opacity: 0.6,
    },

    botaoSalvarTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    botaoCancelar: {
        marginTop: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },

    botaoCancelarTexto: {
        fontSize: 16,
        color: '#287653',
        fontWeight: '600',
    },

    erro: {
        color: '#d00',
        backgroundColor: '#fff0f0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },

    centralizado: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },

    textoCarregando: {
        marginTop: 12,
        color: '#666',
    },
});