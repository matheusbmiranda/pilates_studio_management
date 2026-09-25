import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { type Href, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { listarAulas, type Aula } from '@/services/aulas-api';

function formatarBuscaData(valor: string) {
  const numeros = valor.replace(/\D/g, '').slice(0, 8);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

function formatarData(data: string) {
  const parteData = data.slice(0, 10);
  const [ano, mes, dia] = parteData.split('-');

  if (!ano || !mes || !dia) {
    return '-';
  }

  return `${dia}/${mes}/${ano}`;
}

export default function AulasScreen() {
  const router = useRouter();

  const [busca, setBusca] = useState('');
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
      useCallback(() => {
        carregarAulas();
      }, []),
  );

  async function carregarAulas() {
    setCarregando(true);
    setErro(null);

    try {
      const resposta = await listarAulas();
      setAulas(resposta);
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Não foi possível carregar as aulas.',
      );
    } finally {
      setCarregando(false);
    }
  }

  const aulasFiltradas = aulas.filter((aula) => {
    const buscaNumerica = busca.replace(/\D/g, '');

    if (!buscaNumerica) {
      return true;
    }

    const dataNumerica = formatarData(aula.criadaEm).replace(/\D/g, '');

    return dataNumerica.startsWith(buscaNumerica);
  });

  return (
      <SafeAreaView style={styles.safeArea}>
        <FlatList
            data={aulasFiltradas}
            keyExtractor={(aula) => aula.id}
            renderItem={({ item }) => (
                <AulaCard
                    aula={item}
                    onPress={() =>
                        router.push({
                          pathname: '/detalhes-aula',
                          params: { aulaId: item.id },
                        } as unknown as Href)
                    }
                />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerContent}>
                <View style={styles.topBar}>
                  <View>
                    <Text style={styles.title}>Aulas</Text>
                    <Text style={styles.subtitle}>Gerenciar aulas</Text>
                  </View>

                  <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Cadastrar aula"
                      onPress={() =>
                          router.push('/cadastrar-aula' as Href)
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
                      onChangeText={(texto) => setBusca(formatarBuscaData(texto))}
                      placeholder="Buscar aula..."
                      placeholderTextColor="#8B949E"
                      style={styles.searchInput}
                      returnKeyType="search"
                      keyboardType="numeric"
                  />
                </View>

                <Text style={styles.resultCount}>
                  {aulasFiltradas.length}{' '}
                  {aulasFiltradas.length === 1
                      ? 'aula encontrada'
                      : 'aulas encontradas'}
                </Text>

                </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                {carregando ? (
                    <ActivityIndicator size="small" color="#276749" />
                ) : erro ? (
                    <>
                      <Text style={styles.emptyText}>
                        Não foi possível carregar as aulas.
                      </Text>
                      <Text style={styles.errorText}>{erro}</Text>

                      <Pressable
                          onPress={carregarAulas}
                          style={styles.retryButton}
                      >
                        <Text style={styles.retryButtonText}>
                          Tentar novamente
                        </Text>
                      </Pressable>
                    </>
                ) : (
                    <Text style={styles.emptyText}>
                      Nenhuma aula encontrada.
                    </Text>
                )}
              </View>
            }
        />
      </SafeAreaView>
  );
}

function AulaCard({
                    aula,
                    onPress,
                  }: {
  aula: Aula;
  onPress: () => void;
}) {
  return (
      <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aula de ${formatarData(aula.criadaEm)}`}
          onPress={onPress}
          style={styles.card}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            Aula {formatarData(aula.criadaEm)}
          </Text>

          <Text style={styles.cardInfo}>
            {aula.alunoIds.length}{' '}
            {aula.alunoIds.length === 1 ? 'aluno' : 'alunos'}
            {' • '}
            {aula.exercicioIds.length}{' '}
            {aula.exercicioIds.length === 1
                ? 'exercício'
                : 'exercícios'}
          </Text>
        </View>

        <Text style={styles.cardArrow}>›</Text>
      </Pressable>
  );
}

function AddIcon() {
  return (
      <View style={styles.addIcon}>
        <View style={styles.addIconHorizontal} />
        <View style={styles.addIconVertical} />
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
    justifyContent: 'center',
    height: 20,
    width: 20,
  },

  addIconHorizontal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 3,
    position: 'absolute',
    width: 20,
  },

  addIconVertical: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    height: 20,
    position: 'absolute',
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
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    color: '#1D2B25',
    fontSize: 16,
    fontWeight: '700',
  },

  cardInfo: {
    color: '#68736C',
    fontSize: 13,
    marginTop: 6,
  },

  cardArrow: {
    color: '#276749',
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 12,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    color: '#737D77',
    fontSize: 14,
    textAlign: 'center',
  },

  errorText: {
    color: '#B42318',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#E9EEEA',
    borderRadius: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  retryButtonText: {
    color: '#276749',
    fontSize: 13,
    fontWeight: '700',
  },
});