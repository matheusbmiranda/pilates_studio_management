import { Tabs, TabList, TabSlot, TabTrigger, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs style={styles.container}>
      <TabSlot style={styles.content} />
      <TabList asChild>
        <View style={styles.tabList}>
          <TabTrigger name="index" href="/(tabs)" asChild>
            <TabButton>Alunos</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton>Aulas</TabButton>
          </TabTrigger>
        </View>
      </TabList>
    </Tabs>
  );
}

function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [styles.tabButton, isFocused && styles.tabButtonFocused, pressed && styles.tabButtonPressed]}>
      <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8F7' },
  content: { flex: 1 },
  tabList: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E9E6',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
  },
  tabButton: { alignItems: 'center', borderRadius: 10, justifyContent: 'center', minHeight: 42, paddingHorizontal: 24 },
  tabButtonFocused: { backgroundColor: '#E3F0E8' },
  tabButtonPressed: { opacity: 0.75 },
  tabLabel: { color: '#66716A', fontSize: 14, fontWeight: '600' },
  tabLabelFocused: { color: '#276749', fontWeight: '700' },
});
