import { useEffect, useRef, useState } from 'react';
import {type Href, router, useLocalSearchParams, useRouter} from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import {
  listarExercicios,
  type Exercicio,
} from '@/services/exercicios-api';

type Ordenacao =
    | 'Nome A-Z'
    | 'Nome Z-A'
    | 'Mais recentes'
    | 'Mais antigos';

const TAMANHO_PAGINA = 15;

const opcoesOrdenacao: Ordenacao[] = [
  'Nome A-Z',
  'Nome Z-A',
  'Mais recentes',
  'Mais antigos',
];

const ordenacaoParaApi: Record<Ordenacao, string> = {
  'Nome A-Z': 'nome,asc',
  'Nome Z-A': 'nome,desc',
  'Mais recentes': 'id,desc',
  'Mais antigos': 'id,asc',
};

export default function ExerciciosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sucesso?: string }>();

  const [mensagemSucesso, setMensagemSucesso] = useState(false);

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('Nome A-Z');
  const [mostrarOrdenacao, setMostrarOrdenacao] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [nivelFiltro, setNivelFiltro] = useState<string[]>([]);
  const [aparelhoFiltro, setAparelhoFiltro] = useState<string[]>([]);
  const [regiaoCorporalFiltro, setRegiaoCorporalFiltro] = useState<string[]>([]);
  const [focoMuscularFiltro, setFocoMuscularFiltro] = useState<string[]>([]);

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [totalElementos, setTotalElementos] = useState(0);

  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const requisicaoRef = useRef(0);

  async function carregarPagina(
      pagina: number,
      termoBusca: string,
      ordenacaoAtual: Ordenacao = ordenacao,
      nivelAtual: string[] = nivelFiltro,
      aparelhoAtual: string[] = aparelhoFiltro,
      regiaoCorporalAtual: string[] = regiaoCorporalFiltro,
      focoMuscularAtual: string[] = focoMuscularFiltro,
  ) {
    setCarregando(true);
    setErro(null);

    const requisicaoAtual = ++requisicaoRef.current;

    try {
      const response = await listarExercicios(
          pagina,
          TAMANHO_PAGINA,
          termoBusca,
          ordenacaoParaApi[ordenacaoAtual],
          nivelAtual,
          aparelhoAtual,
          regiaoCorporalAtual,
          focoMuscularAtual,
      );

      if (requisicaoAtual !== requisicaoRef.current) {
        return;
      }

      setExercicios(response.content);
      setTotalElementos(response.totalElements);

      const paginas = Math.max(
          1,
          Math.ceil(response.totalElements / TAMANHO_PAGINA),
      );

      setTotalPaginas(paginas);
      setPaginaAtual(pagina);
    } catch (error) {
      if (requisicaoAtual !== requisicaoRef.current) {
        return;
      }

      const mensagem =
          error instanceof Error
              ? error.message
              : 'Não foi possível carregar os exercícios.';

      setErro(mensagem);
    } finally {
      if (requisicaoAtual === requisicaoRef.current) {
        setCarregando(false);
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarPagina(0, busca);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    busca,
    ordenacao,
    nivelFiltro,
    aparelhoFiltro,
    regiaoCorporalFiltro,
    focoMuscularFiltro,
  ]);

  useEffect(() => {
    if (params.sucesso !== '1') {
      return;
    }

    setMensagemSucesso(true);

    carregarPagina(0, busca);

    const timer = setTimeout(() => {
      setMensagemSucesso(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [params.sucesso]);

  function recarregar() {
    carregarPagina(paginaAtual, busca);
  }

  return (
      <SafeAreaView style={styles.safeArea}>
        {mensagemSucesso && (
            <View style={styles.successMessage}>
              <Text style={styles.successMessageText}>
                Exercício salvo com sucesso.
              </Text>
            </View>
        )}

        <FlatList
            data={exercicios}
            keyExtractor={(exercicio) => exercicio.id}
            renderItem={({ item }) => (
                <ExercicioCard exercicio={item} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerContent}>
                <View style={styles.topBar}>
                  <View>
                    <Text style={styles.title}>Exercícios</Text>
                    <Text style={styles.subtitle}>
                      Gerenciar exercícios
                    </Text>
                  </View>

                  <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cadastrar exercício"
                      onPress={() =>
                          router.push('/cadastrar-exercicio' as Href)
                      }
                      style={styles.addButton}
                  >
                    <AddIcon />
                  </Pressable>
                </View>

                <View style={styles.searchContainer}>
                  <Text style={styles.searchIcon}>⌕</Text>

                  <TextInput
                      value={busca}
                      onChangeText={setBusca}
                      placeholder="Buscar exercício..."
                      placeholderTextColor="#8B949E"
                      style={styles.searchInput}
                      returnKeyType="search"
                  />
                </View>

                <View style={styles.filterRow}>
                  <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Filtrar exercícios"
                      onPress={() => setMostrarFiltros((valor) => !valor)}
                      style={styles.filterButton}
                  >
                    <Text style={styles.filterIcon}>≡</Text>
                    <Text style={styles.filterButtonText}>
                      Filtrar
                    </Text>
                  </Pressable>

                  <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                          setMostrarOrdenacao((valor) => !valor)
                      }
                      style={styles.sortButton}
                  >
                    <Text style={styles.sortIcon}>↕</Text>
                    <Text style={styles.sortButtonText}>
                      Ordenar
                    </Text>
                  </Pressable>
                </View>

                {mostrarFiltros && (
                    <View style={styles.filterMenu}>
                      <Text style={styles.filterTitle}>Filtros</Text>

                      <Text style={styles.filterSectionTitle}>Nível</Text>

                      <View style={styles.filterOptions}>
                        {[
                          ['Iniciante', 'INICIANTE'],
                          ['Intermediário', 'INTERMEDIARIO'],
                          ['Avançado', 'AVANCADO'],
                          ['Gestante', 'GESTANTE'],
                        ].map(([label, value]) => (
                            <Pressable
                                key={value}
                                onPress={() => {
                                  setNivelFiltro((atual) =>
                                      atual.includes(value)
                                          ? atual.filter((nivel) => nivel !== value)
                                          : [...atual, value]
                                  );
                                }}
                                style={[
                                  styles.filterOption,
                                  nivelFiltro.includes(value) && styles.filterOptionSelected,
                                ]}
                            >
                              <Text
                                  style={[
                                    styles.filterOptionText,
                                    nivelFiltro.includes(value) &&
                                    styles.filterOptionTextSelected,
                                  ]}
                              >
                                {label}
                              </Text>
                            </Pressable>
                        ))}
                      </View>

                      <Text style={styles.filterSectionTitle}>Aparelho</Text>

                      <View style={styles.filterOptions}>
                        {[
                          ['Barrel', 'BARREL'],
                          ['Chair', 'CHAIR'],
                          ['Cadillac', 'CADILLAC'],
                          ['Reformer', 'REFORMER'],
                          ['Torre', 'TORRE'],
                          ['Mat', 'MAT'],
                        ].map(([label, value]) => (
                            <Pressable
                                key={value}
                                onPress={() => {
                                  setAparelhoFiltro((atual) =>
                                      atual.includes(value)
                                          ? atual.filter((aparelho) => aparelho !== value)
                                          : [...atual, value]
                                  );
                                }}
                                style={[
                                  styles.filterOption,
                                  aparelhoFiltro.includes(value) &&
                                  styles.filterOptionSelected,
                                ]}
                            >
                              <Text
                                  style={[
                                    styles.filterOptionText,
                                    aparelhoFiltro.includes(value) &&
                                    styles.filterOptionTextSelected,
                                  ]}
                              >
                                {label}
                              </Text>
                            </Pressable>
                        ))}
                      </View>

                      <Text style={styles.filterSectionTitle}>Região corporal</Text>

                      <View style={styles.filterOptions}>
                        {[
                          ['Coluna cervical', 'COLUNA_CERVICAL'],
                          ['Coluna torácica', 'COLUNA_TORACICA'],
                          ['Coluna lombar', 'COLUNA_LOMBAR'],
                          ['Membros inferiores', 'MEMBROS_INFERIORES'],
                          ['Membros superiores', 'MEMBROS_SUPERIORES'],
                          ['Abdômen / Core', 'ABDOMEN_CORE'],
                          ['Pelve', 'PELVE'],
                          ['Quadril', 'QUADRIL'],
                          ['Glúteo', 'GLUTEO'],
                          ['Corpo inteiro', 'CORPO_INTEIRO'],
                        ].map(([label, value]) => (
                            <Pressable
                                key={value}
                                onPress={() => {
                                  setRegiaoCorporalFiltro((atual) =>
                                      atual.includes(value)
                                          ? atual.filter((regiao) => regiao !== value)
                                          : [...atual, value]
                                  );
                                }}
                                style={[
                                  styles.filterOption,
                                  regiaoCorporalFiltro.includes(value) &&
                                  styles.filterOptionSelected,
                                ]}
                            >
                              <Text
                                  style={[
                                    styles.filterOptionText,
                                    regiaoCorporalFiltro.includes(value) &&
                                    styles.filterOptionTextSelected,
                                  ]}
                              >
                                {label}
                              </Text>
                            </Pressable>
                        ))}
                      </View>

                      <Text style={styles.filterSectionTitle}>Foco muscular</Text>

                      <View style={styles.filterOptions}>
                        {[
                          ['Alongamento', 'ALONGAMENTO'],
                          ['Mobilidade', 'MOBILIDADE'],
                          ['Fortalecimento', 'FORTALECIMENTO'],
                          ['Respiração', 'RESPIRACAO'],
                        ].map(([label, value]) => (
                            <Pressable
                                key={value}
                                onPress={() => {
                                  setFocoMuscularFiltro((atual) =>
                                      atual.includes(value)
                                          ? atual.filter((foco) => foco !== value)
                                          : [...atual, value]
                                  );
                                }}
                                style={[
                                  styles.filterOption,
                                  focoMuscularFiltro.includes(value) &&
                                  styles.filterOptionSelected,
                                ]}
                            >
                              <Text
                                  style={[
                                    styles.filterOptionText,
                                    focoMuscularFiltro.includes(value) &&
                                    styles.filterOptionTextSelected,
                                  ]}
                              >
                                {label}
                              </Text>
                            </Pressable>
                        ))}
                      </View>

                      <Pressable
                          onPress={() => {
                            setNivelFiltro([]);
                            setAparelhoFiltro([]);
                            setRegiaoCorporalFiltro([]);
                            setFocoMuscularFiltro([]);
                          }}
                          style={styles.clearFilterButton}
                      >
                        <Text style={styles.clearFilterButtonText}>
                          Limpar filtros
                        </Text>
                      </Pressable>
                    </View>
                )}

                {mostrarOrdenacao && (
                    <View style={styles.sortMenu}>
                      {opcoesOrdenacao.map((opcao) => (
                          <Pressable
                              key={opcao}
                              accessibilityRole="button"
                              onPress={() => {
                                setOrdenacao(opcao);
                                setMostrarOrdenacao(false);
                              }}
                              style={styles.sortOption}
                          >
                            <Text
                                style={[
                                  styles.sortOptionText,
                                  ordenacao === opcao &&
                                  styles.sortOptionTextSelected,
                                ]}
                            >
                              {opcao}
                            </Text>

                            {ordenacao === opcao && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                          </Pressable>
                      ))}
                    </View>
                )}

                {!carregando && !erro && (
                    <Text style={styles.resultCount}>
                      {totalElementos}{' '}
                      {totalElementos === 1
                          ? 'exercício encontrado'
                          : 'exercícios encontrados'}
                    </Text>
                )}
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {carregando ? (
                    <ActivityIndicator size="small" color="#276749" />
                ) : erro ? (
                    <>
                      <Text style={styles.emptyText}>
                        Não foi possível carregar os exercícios.
                      </Text>

                      <Pressable
                          accessibilityRole="button"
                          onPress={recarregar}
                          style={styles.retryButton}
                      >
                        <Text style={styles.retryButtonText}>
                          Tentar novamente
                        </Text>
                      </Pressable>
                    </>
                ) : (
                    <Text style={styles.emptyText}>
                      Nenhum exercício encontrado.
                    </Text>
                )}
              </View>
            }
            ListFooterComponent={
              totalPaginas > 1 ? (
                  <View style={styles.paginationContainer}>
                    <Pressable
                        onPress={() => {
                          if (paginaAtual > 0) {
                            carregarPagina(
                                paginaAtual - 1,
                                busca,
                                ordenacao,
                                nivelFiltro,
                                aparelhoFiltro,
                                regiaoCorporalFiltro,
                                focoMuscularFiltro,
                            );
                          }
                        }}
                        disabled={paginaAtual === 0 || carregando}
                        style={[
                          styles.paginationButton,
                          (paginaAtual === 0 || carregando) &&
                          styles.paginationButtonDisabled,
                        ]}
                    >
                      <Text style={styles.paginationButtonText}>
                        ← Anterior
                      </Text>
                    </Pressable>

                    <Text style={styles.paginationText}>
                      Página {paginaAtual + 1} de {totalPaginas}
                    </Text>

                    <Pressable
                        onPress={() => {
                          if (paginaAtual < totalPaginas - 1) {
                            carregarPagina(
                                paginaAtual + 1,
                                busca,
                                ordenacao,
                                nivelFiltro,
                                aparelhoFiltro,
                                regiaoCorporalFiltro,
                                focoMuscularFiltro,
                            );
                          }
                        }}
                        disabled={
                            paginaAtual === totalPaginas - 1 || carregando
                        }
                        style={[
                          styles.paginationButton,
                          (paginaAtual === totalPaginas - 1 || carregando) &&
                          styles.paginationButtonDisabled,
                        ]}
                    >
                      <Text style={styles.paginationButtonText}>
                        Próxima →
                      </Text>
                    </Pressable>
                  </View>
              ) : null
            }
        />
      </SafeAreaView>
  );
}

function ExercicioCard({
                         exercicio,
                       }: {
  exercicio: Exercicio;
}) {
  const nivel = formatarNivel(exercicio.niveis[0]);
  const aparelho = formatarAparelho(exercicio.aparelhos[0]);

  return (
      <Pressable
          accessibilityRole="button"
          accessibilityLabel={exercicio.nome}
          onPress={() => {
            router.push(`/editar-exercicio?id=${exercicio.id}` as Href);
          }}
          style={styles.card}
      >
        {exercicio.imagemUrl ? (
            <Image
                source={{ uri: exercicio.imagemUrl }}
                style={styles.avatarImage}
            />
        ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {exercicio.nome.slice(0, 1).toUpperCase()}
              </Text>
            </View>
        )}

        <View style={styles.cardContent}>
          <View style={styles.nameRow}>
            <Text
                style={styles.exerciseName}
                numberOfLines={1}
            >
              {exercicio.nome}
            </Text>

            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {nivel}
              </Text>
            </View>
          </View>

          {exercicio.traducao ? (
              <Text
                  style={styles.translation}
                  numberOfLines={1}
              >
                {exercicio.traducao}
              </Text>
          ) : null}

          <Text style={styles.details}>
            {aparelho} · {nivel}
          </Text>
        </View>
      </Pressable>
  );
}

function formatarNivel(nivel?: string) {
  const niveis: Record<string, string> = {
    INICIANTE: 'Iniciante',
    INTERMEDIARIO: 'Intermediário',
    AVANCADO: 'Avançado',
  };

  return niveis[nivel ?? ''] ?? nivel ?? '-';
}

function formatarAparelho(aparelho?: string) {
  const aparelhos: Record<string, string> = {
    MAT: 'Mat',
    REFORMER: 'Reformer',
    CADILLAC: 'Cadillac',
    CHAIR: 'Chair',
    BARRIL: 'Barril',
    PEDI_POLE: 'Pedi Pole',
  };

  return aparelhos[aparelho ?? ''] ?? aparelho ?? '-';
}

function AddIcon() {
  return (
      <View style={styles.addIcon}>
        <View style={styles.addIconHorizontal} />
        <View style={styles.addIconVertical} />
        <View style={styles.addIconHorizontal} />
      </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F8F7',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: BottomTabInset + 24,
  },

  headerContent: {
    paddingTop: 16,
    paddingBottom: 16,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    color: '#1D2B25',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.7,
  },

  subtitle: {
    color: '#6C7670',
    fontSize: 14,
    marginTop: 4,
  },

  addButton: {
    alignItems: 'center',
    backgroundColor: '#276749',
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },

  addIcon: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 20,
    width: 20,
  },

  addIconHorizontal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    flex: 1,
    height: 3,
  },

  addIconVertical: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 20,
    width: 3,
  },

  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E9E6',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    paddingHorizontal: 15,
  },

  searchIcon: {
    color: '#68736C',
    fontSize: 27,
    lineHeight: 27,
    marginRight: 8,
    transform: [{ rotate: '-20deg' }],
  },

  searchInput: {
    color: '#1D2B25',
    flex: 1,
    fontSize: 16,
    height: '100%',
  },

  filterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  filterButton: {
    alignItems: 'center',
    backgroundColor: '#E9EEEA',
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },

  filterIcon: {
    color: '#276749',
    fontSize: 17,
    marginRight: 5,
  },

  filterButtonText: {
    color: '#276749',
    fontSize: 13,
    fontWeight: '700',
  },

  sortButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
  },

  sortIcon: {
    color: '#276749',
    fontSize: 17,
    marginRight: 4,
  },

  sortButtonText: {
    color: '#276749',
    fontSize: 13,
    fontWeight: '700',
  },

  sortMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E9E6',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    overflow: 'hidden',
  },

  sortOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 45,
    paddingHorizontal: 14,
  },

  sortOptionText: {
    color: '#48544D',
    fontSize: 14,
  },

  sortOptionTextSelected: {
    color: '#276749',
    fontWeight: '700',
  },

  checkmark: {
    color: '#276749',
    fontSize: 16,
    fontWeight: '700',
  },

  resultCount: {
    color: '#737D77',
    fontSize: 13,
    marginTop: 20,
  },

  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E9ECEA',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 96,
    padding: 14,
    shadowColor: '#1D2B25',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },

  avatar: {
    alignItems: 'center',
    backgroundColor: '#E3F0E8',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    marginRight: 13,
    width: 44,
  },

  avatarImage: {
    backgroundColor: '#E3F0E8',
    borderRadius: 22,
    height: 44,
    marginRight: 13,
    width: 44,
  },

  avatarText: {
    color: '#276749',
    fontSize: 14,
    fontWeight: '700',
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  exerciseName: {
    color: '#1D2B25',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },

  levelBadge: {
    backgroundColor: '#E5F5EA',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  levelText: {
    color: '#25734B',
    fontSize: 11,
    fontWeight: '700',
  },

  translation: {
    color: '#6C7670',
    fontSize: 14,
    marginTop: 5,
  },

  details: {
    color: '#48544D',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 28,
  },

  emptyText: {
    color: '#737D77',
    fontSize: 15,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#276749',
    borderRadius: 10,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  successMessage: {
    backgroundColor: '#E3F0E8',
    borderColor: '#B8D8C3',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },

  successMessageText: {
    color: '#276749',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  filterMenu: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E9E6',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 10,
    padding: 14,
  },

  filterTitle: {
    color: '#1D2B25',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },

  filterSectionTitle: {
    color: '#48544D',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },

  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterOption: {
    borderColor: '#D9E1DC',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  filterOptionSelected: {
    backgroundColor: '#276749',
    borderColor: '#276749',
  },

  filterOptionText: {
    color: '#48544D',
    fontSize: 13,
  },

  filterOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  clearFilterButton: {
    marginTop: 14,
    paddingVertical: 8,
  },

  clearFilterButtonText: {
    color: '#276749',
    fontSize: 13,
    fontWeight: '700',
  },

  paginationContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingVertical: 16,
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
});