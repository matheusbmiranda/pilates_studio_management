import { useMemo, useState } from 'react';
import { type Href, useRouter } from 'expo-router';
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

interface Exercicio {
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
  criadoEm: string;
}

type Ordenacao = 'Nome A-Z' | 'Nome Z-A' | 'Mais recentes' | 'Mais antigos';

const exerciciosMockados: Exercicio[] = [
  { id: '1', nome: 'Hundred', traducao: 'The Hundred', niveis: ['Iniciante'], aparelhos: ['Reformer'], regioesCorporais: ['Centro do corpo'], focosMusculares: ['Abdômen'], objetivos: ['Estabilidade do core'], contraindicacoes: [], imagemUrl: null, criadoEm: '2026-08-18' },
  { id: '2', nome: 'Footwork', traducao: 'Trabalho de pés', niveis: ['Iniciante'], aparelhos: ['Reformer'], regioesCorporais: ['Membros inferiores'], focosMusculares: ['Quadríceps', 'Glúteos'], objetivos: ['Fortalecimento das pernas'], contraindicacoes: [], imagemUrl: null, criadoEm: '2026-08-10' },
  { id: '3', nome: 'Swan', traducao: 'Cisne', niveis: ['Intermediário'], aparelhos: ['Cadillac'], regioesCorporais: ['Coluna'], focosMusculares: ['Dorsais'], objetivos: ['Extensão da coluna'], contraindicacoes: ['Lombalgia aguda'], imagemUrl: null, criadoEm: '2026-07-22' },
  { id: '4', nome: 'Short Spine Massage', traducao: 'Massagem da coluna curta', niveis: ['Intermediário'], aparelhos: ['Reformer'], regioesCorporais: ['Coluna', 'Quadril'], focosMusculares: ['Abdômen', 'Isquiotibiais'], objetivos: ['Mobilidade da coluna'], contraindicacoes: [], imagemUrl: null, criadoEm: '2026-06-14' },
  { id: '5', nome: 'Mermaid', traducao: 'Sereia', niveis: ['Iniciante'], aparelhos: ['Chair'], regioesCorporais: ['Tronco'], focosMusculares: ['Oblíquos'], objetivos: ['Mobilidade lateral'], contraindicacoes: [], imagemUrl: null, criadoEm: '2026-05-03' },
  { id: '6', nome: 'Teaser', traducao: 'Canivete', niveis: ['Avançado'], aparelhos: ['Mat'], regioesCorporais: ['Centro do corpo'], focosMusculares: ['Abdômen', 'Flexores do quadril'], objetivos: ['Controle e equilíbrio'], contraindicacoes: ['Hérnia de disco'], imagemUrl: null, criadoEm: '2026-04-09' },
];

const opcoesOrdenacao: Ordenacao[] = ['Nome A-Z', 'Nome Z-A', 'Mais recentes', 'Mais antigos'];

export default function ExerciciosScreen() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState<Ordenacao>('Nome A-Z');
  const [mostrarOrdenacao, setMostrarOrdenacao] = useState(false);

  const exercicios = useMemo(() => {
    const termoBusca = busca.trim().toLocaleLowerCase('pt-BR');

    return exerciciosMockados
      .filter((exercicio) => (
        exercicio.nome.toLocaleLowerCase('pt-BR').includes(termoBusca)
        || exercicio.traducao.toLocaleLowerCase('pt-BR').includes(termoBusca)
      ))
      .sort((a, b) => {
        if (ordenacao === 'Nome A-Z') return a.nome.localeCompare(b.nome, 'pt-BR');
        if (ordenacao === 'Nome Z-A') return b.nome.localeCompare(a.nome, 'pt-BR');
        if (ordenacao === 'Mais recentes') return b.criadoEm.localeCompare(a.criadoEm);
        return a.criadoEm.localeCompare(b.criadoEm);
      });
  }, [busca, ordenacao]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={exercicios}
        keyExtractor={(exercicio) => exercicio.id}
        renderItem={({ item }) => <ExercicioCard exercicio={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={styles.topBar}>
              <View>
                <Text style={styles.title}>Exercícios</Text>
                <Text style={styles.subtitle}>Gerenciar exercícios</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cadastrar exercício"
                onPress={() => router.push('/cadastrar-exercicio' as Href)}
                style={styles.addButton}>
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
              <Pressable accessibilityRole="button" accessibilityLabel="Filtrar exercícios" style={styles.filterButton}>
                <Text style={styles.filterIcon}>≡</Text>
                <Text style={styles.filterButtonText}>Filtrar</Text>
              </Pressable>
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

            <Text style={styles.resultCount}>
              {exercicios.length} {exercicios.length === 1 ? 'exercício encontrado' : 'exercícios encontrados'}
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum exercício encontrado.</Text>}
      />
    </SafeAreaView>
  );
}

function ExercicioCard({ exercicio }: { exercicio: Exercicio }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={exercicio.nome} style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{exercicio.nome.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.nameRow}>
          <Text style={styles.exerciseName} numberOfLines={1}>{exercicio.nome}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{exercicio.niveis[0]}</Text>
          </View>
        </View>
        <Text style={styles.translation} numberOfLines={1}>{exercicio.traducao}</Text>
        <Text style={styles.details}>{exercicio.aparelhos[0]} · {exercicio.niveis[0]}</Text>
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
  filterButton: { alignItems: 'center', backgroundColor: '#E9EEEA', borderRadius: 10, flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 9 },
  filterIcon: { color: '#276749', fontSize: 17, marginRight: 5 },
  filterButtonText: { color: '#276749', fontSize: 13, fontWeight: '700' },
  sortButton: { alignItems: 'center', flexDirection: 'row', paddingVertical: 8 },
  sortIcon: { color: '#276749', fontSize: 17, marginRight: 4 },
  sortButtonText: { color: '#276749', fontSize: 13, fontWeight: '700' },
  sortMenu: { backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 12, borderWidth: 1, marginTop: 10, overflow: 'hidden' },
  sortOption: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 45, paddingHorizontal: 14 },
  sortOptionText: { color: '#48544D', fontSize: 14 },
  sortOptionTextSelected: { color: '#276749', fontWeight: '700' },
  checkmark: { color: '#276749', fontSize: 16, fontWeight: '700' },
  resultCount: { color: '#737D77', fontSize: 13, marginTop: 20 },
  card: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E9ECEA', borderRadius: 16, borderWidth: 1, flexDirection: 'row', marginBottom: 12, minHeight: 96, padding: 14, shadowColor: '#1D2B25', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.035, shadowRadius: 5, elevation: 1 },
  avatar: { alignItems: 'center', backgroundColor: '#E3F0E8', borderRadius: 22, height: 44, justifyContent: 'center', marginRight: 13, width: 44 },
  avatarText: { color: '#276749', fontSize: 14, fontWeight: '700' },
  cardContent: { flex: 1, minWidth: 0 },
  nameRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  exerciseName: { color: '#1D2B25', flex: 1, fontSize: 16, fontWeight: '700' },
  levelBadge: { backgroundColor: '#E5F5EA', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  levelText: { color: '#25734B', fontSize: 11, fontWeight: '700' },
  translation: { color: '#6C7670', fontSize: 14, marginTop: 5 },
  details: { color: '#48544D', fontSize: 13, fontWeight: '600', marginTop: 5 },
  emptyText: { color: '#737D77', fontSize: 15, paddingTop: 28, textAlign: 'center' },
});
