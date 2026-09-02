import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type StatusAluno = 'Ativo' | 'Inativo';

export default function CadastrarAlunoScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusAluno>('Ativo');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={10}
              onPress={() => router.back()}
              style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <View>
              <Text style={styles.title}>Cadastrar aluno</Text>
              <Text style={styles.subtitle}>Preencha os dados do novo aluno</Text>
            </View>
          </View>

          <View style={styles.form}>
            <FormField label="Nome completo" placeholder="Digite o nome completo" />
            <FormField label="Data de nascimento" placeholder="DD/MM/AAAA" keyboardType="numeric" />
            <FormField label="Telefone" placeholder="(00) 00000-0000" keyboardType="phone-pad" />
            <FormField label="E-mail" placeholder="nome@email.com" keyboardType="email-address" autoCapitalize="none" />

            <View>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusGroup}>
                {(['Ativo', 'Inativo'] as StatusAluno[]).map((opcao) => {
                  const selecionado = status === opcao;
                  return (
                    <Pressable
                      key={opcao}
                      accessibilityRole="button"
                      onPress={() => setStatus(opcao)}
                      style={[styles.statusButton, selecionado && styles.statusButtonSelected]}>
                      <View style={[styles.statusDot, opcao === 'Ativo' ? styles.activeDot : styles.inactiveDot]} />
                      <Text style={[styles.statusText, selecionado && styles.statusTextSelected]}>{opcao}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                multiline
                numberOfLines={5}
                placeholder="Adicione informações importantes sobre o aluno..."
                placeholderTextColor="#8B949E"
                style={[styles.input, styles.notesInput]}
                textAlignVertical="top"
              />
            </View>

            <Pressable accessibilityRole="button" style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Cadastrar</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none';
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#8B949E"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F7' },
  keyboardAvoidingView: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 30 },
  backButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 14, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  backIcon: { color: '#276749', fontSize: 34, fontWeight: '300', lineHeight: 37, marginTop: -3 },
  title: { color: '#1D2B25', fontSize: 25, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: '#6C7670', fontSize: 14, marginTop: 3 },
  form: { gap: 20 },
  label: { color: '#344139', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 13, borderWidth: 1, color: '#1D2B25', fontSize: 16, height: 52, paddingHorizontal: 15 },
  notesInput: { height: 120, paddingTop: 14 },
  statusGroup: { backgroundColor: '#E9EEEA', borderRadius: 13, flexDirection: 'row', padding: 4 },
  statusButton: { alignItems: 'center', borderRadius: 10, flex: 1, flexDirection: 'row', justifyContent: 'center', minHeight: 46 },
  statusButtonSelected: { backgroundColor: '#FFFFFF', shadowColor: '#1D2B25', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  statusDot: { borderRadius: 4, height: 8, marginRight: 7, width: 8 },
  activeDot: { backgroundColor: '#2F855A' },
  inactiveDot: { backgroundColor: '#8A8D8B' },
  statusText: { color: '#66716A', fontSize: 14, fontWeight: '600' },
  statusTextSelected: { color: '#276749', fontWeight: '700' },
  submitButton: { alignItems: 'center', backgroundColor: '#276749', borderRadius: 14, justifyContent: 'center', marginTop: 8, minHeight: 54 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
