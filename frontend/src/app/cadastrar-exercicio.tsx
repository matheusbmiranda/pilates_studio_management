import { useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'expo-router';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { criarExercicio, uploadImagemExercicio, type ExercicioRequest } from '@/services/exercicios-api';

const niveis = ['Iniciante', 'Intermediário', 'Avançado', 'Gestante'];
const aparelhos = ['Barrel', 'Chair', 'Cadillac', 'Reformer', 'Torre', 'Mat (Solo)'];
const regioesCorporais = ['Coluna cervical', 'Coluna torácica', 'Coluna Lombar', 'Membros Inferiores', 'Membros Superiores', 'Abdômen/Core', 'Pelve', 'Quadril', 'Glúteo', 'Corpo Inteiro'];
const focosMusculares = ['Alongamento', 'Mobilidade', 'Fortalecimento', 'Respiração'];

const nivelParaApi: Record<string, string> = { Iniciante: 'INICIANTE', Intermediário: 'INTERMEDIARIO', Avançado: 'AVANCADO', Gestante: 'GESTANTE' };
const aparelhoParaApi: Record<string, string> = { Barrel: 'BARREL', Chair: 'CHAIR', Cadillac: 'CADILLAC', Reformer: 'REFORMER', Torre: 'TORRE', 'Mat (Solo)': 'MAT' };
const regiaoParaApi: Record<string, string> = { 'Coluna cervical': 'COLUNA_CERVICAL', 'Coluna torácica': 'COLUNA_TORACICA', 'Coluna Lombar': 'COLUNA_LOMBAR', 'Membros Inferiores': 'MEMBROS_INFERIORES', 'Membros Superiores': 'MEMBROS_SUPERIORES', 'Abdômen/Core': 'ABDOMEN_CORE', Pelve: 'PELVE', Quadril: 'QUADRIL', Glúteo: 'GLUTEO', 'Corpo Inteiro': 'CORPO_INTEIRO' };
const focoParaApi: Record<string, string> = { Alongamento: 'ALONGAMENTO', Mobilidade: 'MOBILIDADE', Fortalecimento: 'FORTALECIMENTO', Respiração: 'RESPIRACAO' };

export default function CadastrarExercicioScreen() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [traducao, setTraducao] = useState('');
  const [niveisSelecionados, setNiveisSelecionados] = useState<string[]>([]);
  const [aparelhosSelecionados, setAparelhosSelecionados] = useState<string[]>([]);
  const [regioesSelecionadas, setRegioesSelecionadas] = useState<string[]>([]);
  const [focosSelecionados, setFocosSelecionados] = useState<string[]>([]);
  const [objetivoAtual, setObjetivoAtual] = useState('');
  const [objetivos, setObjetivos] = useState<string[]>([]);
  const [contraindicacaoAtual, setContraindicacaoAtual] = useState('');
  const [contraindicacoes, setContraindicacoes] = useState<string[]>([]);
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);
  const [imagemUrl, setImagemUrl] = useState<string | null>(null);
  const [selecionandoImagem, setSelecionandoImagem] = useState(false);
  const [processandoImagem, setProcessandoImagem] = useState(false);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroNome, setErroNome] = useState('');
  const [erroOperacao, setErroOperacao] = useState('');

  const selecionarImagem = async () => {
    try {
      setErroOperacao('');
      setSelecionandoImagem(true);
      const resultado = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: false, quality: 1 });
      if (resultado.canceled) return;

      const imagem = resultado.assets[0];
      setProcessandoImagem(true);
      const imagemProcessada = await ImageManipulator.manipulateAsync(
        imagem.uri,
        imagem.width > 1280 ? [{ resize: { width: 1280 } }] : [],
        { compress: 0.78, format: ImageManipulator.SaveFormat.JPEG },
      );

      setImagemSelecionada(imagemProcessada.uri);
      setImagemUrl(null);
    } catch (erro) {
      setErroOperacao(getErrorMessage(erro, 'Não foi possível preparar a imagem selecionada.'));
    } finally {
      setSelecionandoImagem(false);
      setProcessandoImagem(false);
    }
  };

  const salvar = async () => {
    if (!nome.trim()) {
      setErroNome('Informe o nome do exercício.');
      return;
    }

    setErroNome('');
    setErroOperacao('');
    setSalvando(true);

    try {
      let urlDaImagem = imagemUrl;
      if (imagemSelecionada && !urlDaImagem) {
        setEnviandoImagem(true);
        try {
          urlDaImagem = await uploadImagemExercicio(imagemSelecionada);
          setImagemUrl(urlDaImagem);
        } finally {
          setEnviandoImagem(false);
        }
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
        imagemUrl: urlDaImagem,
      };

      await criarExercicio(exercicio);
      Alert.alert('Exercício salvo', 'O exercício foi salvo com sucesso.', [{ text: 'Voltar para exercícios', onPress: () => router.back() }]);
    } catch (erro) {
      setErroOperacao(getErrorMessage(erro, 'Não foi possível salvar o exercício. Tente novamente.'));
    } finally {
      setSalvando(false);
      setEnviandoImagem(false);
    }
  };

  const bloqueado = salvando || selecionandoImagem || processandoImagem;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Voltar para exercícios" hitSlop={10} onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>
            <View>
              <Text style={styles.title}>Cadastrar exercício</Text>
              <Text style={styles.subtitle}>Preencha os dados do novo exercício</Text>
            </View>
          </View>

          <View style={styles.form}>
            <FormField label="Nome" value={nome} onChangeText={(valor) => { setNome(valor); setErroNome(''); }} placeholder="Nome do exercício" />
            {erroNome ? <Text style={styles.errorText}>{erroNome}</Text> : null}
            <FormField label="Tradução" value={traducao} onChangeText={setTraducao} placeholder="Tradução" />

            <MultiSelect label="Nível" options={niveis} selectedOptions={niveisSelecionados} onChange={setNiveisSelecionados} />
            <MultiSelect label="Aparelho" options={aparelhos} selectedOptions={aparelhosSelecionados} onChange={setAparelhosSelecionados} />
            <MultiSelect label="Região corporal" options={regioesCorporais} selectedOptions={regioesSelecionadas} onChange={setRegioesSelecionadas} />
            <MultiSelect label="Foco muscular" options={focosMusculares} selectedOptions={focosSelecionados} onChange={setFocosSelecionados} />

            <ListField label="Objetivos" value={objetivoAtual} onChangeText={setObjetivoAtual} items={objetivos} placeholder="Adicionar objetivo" onAdd={() => addListItem(objetivoAtual, setObjetivoAtual, setObjetivos)} onRemove={(item) => setObjetivos((atuais) => atuais.filter((atual) => atual !== item))} />
            <ListField label="Contraindicações" value={contraindicacaoAtual} onChangeText={setContraindicacaoAtual} items={contraindicacoes} placeholder="Adicionar contraindicação" onAdd={() => addListItem(contraindicacaoAtual, setContraindicacaoAtual, setContraindicacoes)} onRemove={(item) => setContraindicacoes((atuais) => atuais.filter((atual) => atual !== item))} />

            <View>
              <Text style={styles.label}>Imagem</Text>
              {imagemSelecionada ? <Image source={{ uri: imagemSelecionada }} style={styles.imagePreview} /> : null}
              <Pressable accessibilityRole="button" accessibilityLabel={imagemSelecionada ? 'Substituir imagem' : 'Adicionar imagem'} disabled={bloqueado} onPress={selecionarImagem} style={[styles.imageButton, bloqueado && styles.buttonDisabled]}>
                {selecionandoImagem || processandoImagem ? <ActivityIndicator color="#276749" /> : <Text style={styles.imageIcon}>+</Text>}
                <View style={styles.imageButtonContent}>
                  <Text style={styles.imageButtonTitle}>{imagemSelecionada ? 'Substituir imagem' : 'Adicionar imagem'}</Text>
                  <Text style={styles.imageButtonDescription}>{processandoImagem ? 'Otimizando imagem...' : imagemSelecionada ? 'Imagem pronta para envio.' : 'Selecione uma imagem do dispositivo.'}</Text>
                </View>
              </Pressable>
              {imagemUrl ? <Text style={styles.imageUploadedText}>Imagem enviada para o Cloudinary.</Text> : null}
            </View>

            {erroOperacao ? <Text style={styles.operationErrorText}>{erroOperacao}</Text> : null}
            <Pressable accessibilityRole="button" accessibilityState={{ disabled: bloqueado }} disabled={bloqueado} onPress={salvar} style={[styles.submitButton, bloqueado && styles.buttonDisabled]}>
              {salvando ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Salvar exercício</Text>}
            </Pressable>
            {enviandoImagem ? <Text style={styles.savingText}>Enviando imagem...</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FormField({ label, value, onChangeText, placeholder }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string }) {
  return <View><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#8B949E" style={styles.input} /></View>;
}

function MultiSelect({ label, options, selectedOptions, onChange }: { label: string; options: string[]; selectedOptions: string[]; onChange: (options: string[]) => void }) {
  const toggle = (option: string) => onChange(selectedOptions.includes(option) ? selectedOptions.filter((item) => item !== option) : [...selectedOptions, option]);
  return <View><Text style={styles.label}>{label}</Text><View style={styles.optionsGroup}>{options.map((option) => { const selected = selectedOptions.includes(option); return <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected }} onPress={() => toggle(option)} style={[styles.option, selected && styles.optionSelected]}><Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text></Pressable>; })}</View></View>;
}

function ListField({ label, value, onChangeText, items, placeholder, onAdd, onRemove }: { label: string; value: string; onChangeText: (value: string) => void; items: string[]; placeholder: string; onAdd: () => void; onRemove: (item: string) => void }) {
  return <View><Text style={styles.label}>{label}</Text><View style={styles.addItemRow}><TextInput value={value} onChangeText={onChangeText} onSubmitEditing={onAdd} placeholder={placeholder} placeholderTextColor="#8B949E" style={styles.addItemInput} returnKeyType="done" /><Pressable accessibilityRole="button" accessibilityLabel={`Adicionar ${label.toLowerCase()}`} onPress={onAdd} style={styles.addItemButton}><Text style={styles.addItemButtonText}>+</Text></Pressable></View>{items.length > 0 && <View style={styles.tags}>{items.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Remover ${item}`} onPress={() => onRemove(item)} style={styles.tag}><Text style={styles.tagText}>{item}</Text><Text style={styles.tagRemove}>×</Text></Pressable>)}</View>}</View>;
}

function addListItem(value: string, clearValue: (value: string) => void, setItems: Dispatch<SetStateAction<string[]>>) {
  const item = value.trim();
  if (!item) return;
  setItems((items) => items.includes(item) ? items : [...items, item]);
  clearValue('');
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F7' }, keyboardAvoidingView: { flex: 1 }, content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 30 }, backButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#E5E9E6', borderRadius: 14, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 }, backIcon: { color: '#276749', fontSize: 34, fontWeight: '300', lineHeight: 37, marginTop: -3 }, title: { color: '#1D2B25', fontSize: 25, fontWeight: '700', letterSpacing: -0.5 }, subtitle: { color: '#6C7670', fontSize: 14, marginTop: 3 },
  form: { gap: 20 }, label: { color: '#344139', fontSize: 14, fontWeight: '700', marginBottom: 8 }, input: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 13, borderWidth: 1, color: '#1D2B25', fontSize: 16, height: 52, paddingHorizontal: 15 }, errorText: { color: '#B42318', fontSize: 13, marginTop: -14 }, operationErrorText: { backgroundColor: '#FCEBE9', borderRadius: 10, color: '#B42318', fontSize: 14, padding: 12 },
  optionsGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, option: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 10, borderWidth: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: 12 }, optionSelected: { backgroundColor: '#E3F0E8', borderColor: '#276749' }, optionText: { color: '#66716A', fontSize: 14, fontWeight: '600' }, optionTextSelected: { color: '#276749', fontWeight: '700' },
  addItemRow: { flexDirection: 'row', gap: 8 }, addItemInput: { backgroundColor: '#FFFFFF', borderColor: '#E1E6E2', borderRadius: 13, borderWidth: 1, color: '#1D2B25', flex: 1, fontSize: 16, height: 52, paddingHorizontal: 15 }, addItemButton: { alignItems: 'center', backgroundColor: '#276749', borderRadius: 13, height: 52, justifyContent: 'center', width: 52 }, addItemButtonText: { color: '#FFFFFF', fontSize: 27, fontWeight: '400', lineHeight: 30 }, tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }, tag: { alignItems: 'center', backgroundColor: '#E3F0E8', borderRadius: 18, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 7 }, tagText: { color: '#276749', fontSize: 13, fontWeight: '700' }, tagRemove: { color: '#276749', fontSize: 17, fontWeight: '400', lineHeight: 16, marginLeft: 7 },
  imagePreview: { borderRadius: 13, height: 180, marginBottom: 10, width: '100%' }, imageButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#CFE0D4', borderRadius: 13, borderStyle: 'dashed', borderWidth: 1, flexDirection: 'row', minHeight: 82, paddingHorizontal: 15 }, imageIcon: { backgroundColor: '#E3F0E8', borderRadius: 18, color: '#276749', fontSize: 23, height: 36, lineHeight: 34, marginRight: 12, textAlign: 'center', width: 36 }, imageButtonContent: { flex: 1 }, imageButtonTitle: { color: '#276749', fontSize: 15, fontWeight: '700' }, imageButtonDescription: { color: '#6C7670', fontSize: 12, marginTop: 3 }, imageUploadedText: { color: '#25734B', fontSize: 13, fontWeight: '600', marginTop: 8 },
  submitButton: { alignItems: 'center', backgroundColor: '#276749', borderRadius: 14, justifyContent: 'center', marginTop: 8, minHeight: 54 }, submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' }, buttonDisabled: { opacity: 0.65 }, savingText: { color: '#6C7670', fontSize: 13, textAlign: 'center' },
});
