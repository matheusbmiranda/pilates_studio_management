import { useCallback, useState } from 'react';
import { type Href, useFocusEffect, useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset } from '@/constants/theme';
import { listarAlunos, type Aluno as AlunoApi } from '@/services/alunos-api';

export interface Aluno {
  id: string;
  nome: string;
  status: 'Ativo' | 'Inativo';
  telefone: string;
  cadastradoEm: string;
}

type FiltroStatus = 'Todos' | Aluno['status'];
type Ordenacao = 'Nome A-Z' | 'Nome Z-A' | 'Mais recentes' | 'Mais antigos';


const filtros: FiltroStatus[] = ['Todos', 'Ativo', 'Inativo'];
const opcoesOrdenacao: Ordenacao[] = ['Nome A-Z', 'Nome Z-A', 'Mais recentes', 'Mais antigos'];

function initials(nome: string) {
  return nome
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('');
}

export default function AlunosScreen() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('Todos');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('Nome A-Z');
  const [mostrarOrdenacao, setMostrarOrdenacao] = useState(false);
  const [alunos, setAlunos] = useState<AlunoApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0);
  const [ultimaPagina, setUltimaPagina] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const sort =
      ordenacao === 'Nome A-Z'
          ? 'nome,asc'
          : ordenacao === 'Nome Z-A'
              ? 'nome,desc'
              : ordenacao === 'Mais recentes'
                  ? 'id,desc'
                  : 'id,asc';

  useFocusEffect(
      useCallback(() => {
        async function carregarAlunos() {
          setCarregando(true);
          setErro(null);
          setPagina(0);
          setUltimaPagina(false);

          try {
            const response = await listarAlunos(
                0,
                15,
                busca,
                filtroStatus === 'Todos' ? undefined : filtroStatus,
                sort,
            );

            setAlunos(response.content);
            setUltimaPagina(response.last);
          } catch (error) {
            setErro(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível carregar os alunos.'
            );
          } finally {
            setCarregando(false);
          }
        }

        carregarAlunos();
      }, [busca, filtroStatus, sort])
  );

  async function carregarMaisAlunos() {
    if (carregandoMais || ultimaPagina || carregando) {
      return;
    }

    setCarregandoMais(true);

    try {
      const proximaPagina = pagina + 1;

      const response = await listarAlunos(
          proximaPagina,
          15,
          busca,
          filtroStatus === 'Todos' ? undefined : filtroStatus,
          sort,
      );

      setAlunos((alunosAtuais) => [
        ...alunosAtuais,
        ...response.content,
      ]);

      setPagina(proximaPagina);
      setUltimaPagina(response.last);
    } catch (error) {
      setErro(
          error instanceof Error
              ? error.message
              : 'Não foi possível carregar mais alunos.'
      );
    } finally {
      setCarregandoMais(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={alunos}
        keyExtractor={(aluno) => aluno.id}
        renderItem={({ item }) => (
          <AlunoCard
            aluno={item}
            onPress={() => router.push({ pathname: '/editar-aluno', params: { alunoId: item.id } } as unknown as Href)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onEndReached={carregarMaisAlunos}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.title}>Alunos</Text>
                <Text style={styles.subtitle}>Gerenciar alunos </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cadastrar aluno"
                onPress={() => router.push('/cadastrar-aluno' as Href)}
                style={styles.addButton}>
                <AddIcon />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar aluno..."
                placeholderTextColor="#8B949E"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterGroup}>
                {filtros.map((filtro) => {
                  const selecionado = filtroStatus === filtro;
                  return (
                    <Pressable
                      key={filtro}
                      accessibilityRole="button"
                      onPress={() => setFiltroStatus(filtro)}
                      style={[styles.filterButton, selecionado && styles.filterButtonSelected]}>
                      <Text style={[styles.filterText, selecionado && styles.filterTextSelected]}>{filtro}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => setMostrarOrdenacao((valor) => !valor)}
                style={styles.sortButton}>
                <Text style={styles.sortIcon}>↕</Text>
                <Text style={styles.sortButtonText}>Ordenar</Text>
              </Pressable>
            </View>

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
                    style={styles.sortOption}>
                    <Text style={[styles.sortOptionText, ordenacao === opcao && styles.sortOptionTextSelected]}>
                      {opcao}
                    </Text>
                    {ordenacao === opcao && <Text style={styles.checkmark}>✓</Text>}
                  </Pressable>
                ))}
              </View>
            )}

            <Text style={styles.resultCount}>{alunos.length} {alunos.length === 1 ? 'aluno encontrado' : 'alunos encontrados'}</Text>
          </View>
        }

        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno encontrado.</Text>}

        ListFooterComponent={
          carregandoMais ? (
              <Text style={styles.loadingMoreText}>
                Carregando mais alunos...
              </Text>
          ) : null
        }

      />
    </SafeAreaView>
  );
}

function AlunoCard({
                     aluno,
                     onPress,
                   }: {
  aluno: AlunoApi;
  onPress: () => void;
}) {
  const ativo = aluno.status === 'ATIVO';

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${aluno.nome}`} onPress={onPress} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(aluno.nome)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.studentName} numberOfLines={1}>{aluno.nome}</Text>
          <View style={[styles.statusBadge, ativo ? styles.statusActive : styles.statusInactive]}>
            <View style={[styles.statusDot, ativo ? styles.statusDotActive : styles.statusDotInactive]} />
            <Text style={[styles.statusText, ativo ? styles.statusTextActive : styles.statusTextInactive]}>{ativo ? 'Ativo' : 'Inativo'}</Text>
          </View>
        </View>
        <Text style={styles.phone}>{aluno.telefone}</Text>
      </View>
    </Pressable>
  );
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
  safeArea: { flex: 1, backgroundColor: '#F7F8F7' },
  listContent: { paddingHorizontal: 20, paddingBottom: BottomTabInset + 24 },
  headerContent: { paddingTop: 16, paddingBottom: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#1D2B25', fontSize: 30, fontWeight: '700', letterSpacing: -0.7 },
  subtitle: { color: '#6C7670', fontSize: 14, marginTop: 4 },
  addButton: { alignItems: 'center', backgroundColor: '#276749', borderRadius: 16, height: 48, justifyContent: 'center', width: 48 },
  addIcon: { alignItems: 'center', flexDirection: 'row', height: 20, width: 20 },
  addIconHorizontal: { backgroundColor: '#FFFFFF', borderRadius: 2, flex: 1, height: 3 },
  addIconVertical: { backgroundColor: '#FFFFFF', borderRadius: 2, height: 20, width: 3 },
  searchContainer: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 14, borderWidth: 1, flexDirection: 'row', height: 52, paddingHorizontal: 15 },
  searchIcon: { color: '#68736C', fontSize: 27, lineHeight: 27, marginRight: 8, transform: [{ rotate: '-20deg' }] },
  searchInput: { color: '#1D2B25', flex: 1, fontSize: 16, height: '100%' },
  filterRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  filterGroup: { backgroundColor: '#E9EEEA', borderRadius: 10, flexDirection: 'row', padding: 3 },
  filterButton: { borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8 },
  filterButtonSelected: { backgroundColor: '#FFFFFF', shadowColor: '#1D2B25', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  filterText: { color: '#66716A', fontSize: 13, fontWeight: '600' },
  filterTextSelected: { color: '#276749' },
  sortButton: { alignItems: 'center', flexDirection: 'row', paddingVertical: 8 },
  sortIcon: { color: '#276749', fontSize: 17, marginRight: 4 },
  sortButtonText: { color: '#276749', fontSize: 13, fontWeight: '700' },
  sortMenu: { backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 12, borderWidth: 1, marginTop: 10, overflow: 'hidden' },
  sortOption: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 45, paddingHorizontal: 14 },
  sortOptionText: { color: '#48544D', fontSize: 14 },
  sortOptionTextSelected: { color: '#276749', fontWeight: '700' },
  checkmark: { color: '#276749', fontSize: 16, fontWeight: '700' },
  resultCount: { color: '#737D77', fontSize: 13, marginTop: 20 },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E9ECEA', borderRadius: 16, borderWidth: 1, flexDirection: 'row', marginBottom: 12, minHeight: 88, padding: 14, shadowColor: '#1D2B25', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.035, shadowRadius: 5, elevation: 1 },
  avatar: { alignItems: 'center', backgroundColor: '#E3F0E8', borderRadius: 22, height: 44, justifyContent: 'center', marginRight: 13, width: 44 },
  avatarText: { color: '#276749', fontSize: 14, fontWeight: '700' },
  cardContent: { flex: 1, minWidth: 0 },
  nameRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  studentName: { color: '#1D2B25', flex: 1, fontSize: 16, fontWeight: '700' },
  statusBadge: { alignItems: 'center', borderRadius: 20, flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 4 },
  statusActive: { backgroundColor: '#E5F5EA' },
  statusInactive: { backgroundColor: '#F2F1EF' },
  statusDot: { borderRadius: 3, height: 6, marginRight: 5, width: 6 },
  statusDotActive: { backgroundColor: '#2F855A' },
  statusDotInactive: { backgroundColor: '#8A8D8B' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextActive: { color: '#25734B' },
  statusTextInactive: { color: '#6E7370' },
  phone: { color: '#6C7670', fontSize: 14, marginTop: 6 },
  emptyText: { color: '#737D77', fontSize: 15, paddingTop: 28, textAlign: 'center' },
  loadingMoreText: {textAlign: 'center', paddingVertical: 16,},
});
