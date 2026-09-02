import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  atualizarAlunoMockado,
  obterAlunoMockado,
  obterAulasDoAlunoMockadas,
  type Aluno,
  type AulaAluno,
  type StatusAluno,
} from '@/data/alunos';

const statusOpcoes: StatusAluno[] = ['Ativo', 'Inativo'];

export default function EditarAlunoScreen() {
  const router = useRouter();
  const { alunoId } = useLocalSearchParams<{ alunoId?: string }>();
  const aluno = typeof alunoId === 'string' ? obterAlunoMockado(alunoId) : undefined;
  const [formulario, setFormulario] = useState<Aluno | undefined>(aluno);
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [aulaAbertaId, setAulaAbertaId] = useState<string | null>(null);

  useEffect(() => {
    setFormulario(aluno);
    setHistoricoAberto(false);
    setAulaAbertaId(null);
  }, [alunoId]);

  if (!formulario) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.title}>Aluno não encontrado</Text>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Voltar para alunos</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const aulas = obterAulasDoAlunoMockadas(formulario.id);
  const atualizarCampo = <Campo extends keyof Aluno>(campo: Campo, valor: Aluno[Campo]) => {
    setFormulario((atual) => atual ? { ...atual, [campo]: valor } : atual);
  };
  const salvar = () => {
    atualizarAlunoMockado(formulario);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar" hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <View>
              <Text style={styles.title}>Editar aluno</Text>
              <Text style={styles.subtitle}>Atualize os dados do aluno</Text>
            </View>
          </View>

          <View style={styles.form}>
            <FormField label="Nome completo" value={formulario.nome} onChangeText={(valor) => atualizarCampo('nome', valor)} />
            <FormField label="Data de nascimento" value={formulario.dataNascimento} keyboardType="numeric" onChangeText={(valor) => atualizarCampo('dataNascimento', valor)} />
            <FormField label="Telefone" value={formulario.telefone} keyboardType="phone-pad" onChangeText={(valor) => atualizarCampo('telefone', valor)} />
            <FormField label="E-mail" value={formulario.email} autoCapitalize="none" keyboardType="email-address" onChangeText={(valor) => atualizarCampo('email', valor)} />

            <View>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusGroup}>
                {statusOpcoes.map((opcao) => {
                  const selecionado = formulario.status === opcao;
                  return (
                    <Pressable key={opcao} accessibilityRole="button" onPress={() => atualizarCampo('status', opcao)} style={[styles.statusButton, selecionado && styles.statusButtonSelected]}>
                      <View style={[styles.statusDot, opcao === 'Ativo' ? styles.activeDot : styles.inactiveDot]} />
                      <Text style={[styles.statusText, selecionado && styles.statusTextSelected]}>{opcao}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.label}>Observações</Text>
              <TextInput multiline numberOfLines={5} value={formulario.observacoes} onChangeText={(valor) => atualizarCampo('observacoes', valor)} placeholder="Adicione informações importantes sobre o aluno..." placeholderTextColor="#8B949E" style={[styles.input, styles.notesInput]} textAlignVertical="top" />
            </View>

            <HistoricoAulas
              aulas={aulas}
              aberto={historicoAberto}
              aulaAbertaId={aulaAbertaId}
              onToggle={() => setHistoricoAberto((aberto) => !aberto)}
              onToggleAula={(id) => setAulaAbertaId((atual) => atual === id ? null : id)}
            />

            <Pressable accessibilityRole="button" onPress={salvar} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Salvar alterações</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, value, onChangeText, keyboardType, autoCapitalize }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'; autoCapitalize?: 'none' }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput autoCapitalize={autoCapitalize} keyboardType={keyboardType} value={value} onChangeText={onChangeText} placeholderTextColor="#8B949E" style={styles.input} /></View>;
}

function HistoricoAulas({ aulas, aberto, aulaAbertaId, onToggle, onToggleAula }: { aulas: AulaAluno[]; aberto: boolean; aulaAbertaId: string | null; onToggle: () => void; onToggleAula: (id: string) => void }) {
  return (
    <View style={styles.history}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: aberto }} onPress={onToggle} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{aberto ? '▼' : '>'} Histórico de aulas</Text>
      </Pressable>
      {aberto && (aulas.length === 0 ? <Text style={styles.emptyHistory}>Nenhuma aula registrada para este aluno.</Text> : aulas.map((aula, indice) => <AulaAccordion key={aula.id} aula={aula} numero={aulas.length - indice} aberto={aulaAbertaId === aula.id} onToggle={() => onToggleAula(aula.id)} />))}
    </View>
  );
}

function AulaAccordion({ aula, numero, aberto, onToggle }: { aula: AulaAluno; numero: number; aberto: boolean; onToggle: () => void }) {
  return (
    <View style={styles.lesson}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: aberto }} onPress={onToggle} style={styles.lessonHeader}>
        <Text style={styles.lessonTitle}>{aberto ? '▼' : '>'} Aula {numero} — {aula.data}</Text>
      </Pressable>
      {aberto && <View style={styles.lessonDetails}>
        <Detail label="Data" value={aula.data} />
        <Detail label="Nível" value={aula.nivel} />
        <Detail label="Objetivo principal" value={aula.objetivoPrincipal} />
        <Text style={styles.detailLabel}>Objetivos secundários</Text>
        {aula.objetivosSecundarios.map((objetivo) => <Text key={objetivo} style={styles.listItem}>• {objetivo}</Text>)}
        <Text style={[styles.detailLabel, styles.activitiesLabel]}>Atividades</Text>
        {aula.atividades.map((atividade) => <View key={atividade.equipamento} style={styles.activity}><Text style={styles.equipment}>{atividade.equipamento}</Text>{atividade.exercicios.map((exercicio) => <Text key={exercicio} style={styles.listItem}>• {exercicio}</Text>)}</View>)}
      </View>}
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) { return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F7' }, keyboardAvoidingView: { flex: 1 }, content: { padding: 20, paddingBottom: 40 }, notFound: { flex: 1, gap: 24, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 30 }, backButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 14, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 }, backIcon: { color: '#276749', fontSize: 34, fontWeight: '300', lineHeight: 37, marginTop: -3 }, title: { color: '#1D2B25', fontSize: 25, fontWeight: '700', letterSpacing: -0.5 }, subtitle: { color: '#6C7670', fontSize: 14, marginTop: 3 },
  form: { gap: 20 }, label: { color: '#344139', fontSize: 14, fontWeight: '700', marginBottom: 8 }, input: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 13, borderWidth: 1, color: '#1D2B25', fontSize: 16, height: 52, paddingHorizontal: 15 }, notesInput: { height: 120, paddingTop: 14 },
  statusGroup: { backgroundColor: '#E9EEEA', borderRadius: 13, flexDirection: 'row', padding: 4 }, statusButton: { alignItems: 'center', borderRadius: 10, flex: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 46 }, statusButtonSelected: { backgroundColor: '#FFFFFF', elevation: 1, shadowColor: '#1D2B25', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2 }, statusDot: { borderRadius: 4, height: 8, marginRight: 7, width: 8 }, activeDot: { backgroundColor: '#2F855A' }, inactiveDot: { backgroundColor: '#8A8D8B' }, statusText: { color: '#66716A', fontSize: 14, fontWeight: '600' }, statusTextSelected: { color: '#276749', fontWeight: '700' },
  history: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 13, borderWidth: 1, overflow: 'hidden' }, accordionHeader: { minHeight: 54, justifyContent: 'center', paddingHorizontal: 15 }, accordionTitle: { color: '#276749', fontSize: 16, fontWeight: '700' }, emptyHistory: { color: '#6C7670', padding: 15, paddingTop: 0 }, lesson: { borderTopColor: '#E9ECEA', borderTopWidth: 1 }, lessonHeader: { minHeight: 50, justifyContent: 'center', paddingHorizontal: 15 }, lessonTitle: { color: '#344139', fontSize: 15, fontWeight: '700' }, lessonDetails: { backgroundColor: '#F8FAF8', borderTopColor: '#E9ECEA', borderTopWidth: 1, padding: 15 }, detail: { marginBottom: 14 }, detailLabel: { color: '#56625B', fontSize: 13, fontWeight: '700', marginBottom: 4 }, detailValue: { color: '#1D2B25', fontSize: 15 }, listItem: { color: '#344139', fontSize: 15, lineHeight: 22 }, activitiesLabel: { marginTop: 14 }, activity: { marginTop: 10 }, equipment: { color: '#276749', fontSize: 15, fontWeight: '700', marginBottom: 3 }, submitButton: { alignItems: 'center', backgroundColor: '#276749', borderRadius: 14, justifyContent: 'center', marginTop: 8, minHeight: 54 }, submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
