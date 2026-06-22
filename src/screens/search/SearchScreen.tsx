import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { Screen } from '@components/layout/Screen';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Spinner } from '@components/ui/Spinner';
import { EmptyState } from '@components/layout/EmptyState';
import { useTheme } from '@hooks/useTheme';
import { useDebounce } from '@hooks/useDebounce';
import { taskService } from '@services/task.service';
import type { Task } from '@app-types/task';
import { formatRelativeTime } from '@utils/format';

const priorityColors = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  urgent: 'error',
} as const;

export const SearchScreen: React.FC = () => {
  const { theme } = useTheme();
  const { colors } = theme;
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Task[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  React.useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsSearching(true);
      setHasSearched(true);
      taskService
        .searchTasks(debouncedQuery)
        .then(setResults)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
      if (!debouncedQuery) setHasSearched(false);
    }
  }, [debouncedQuery]);

  return (
    <Screen padded={false} style={{ backgroundColor: colors.background }}>
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks, notes..."
          placeholderTextColor={colors.placeholder}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={{ color: colors.textSecondary, fontSize: 18 }}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {isSearching ? (
        <View style={styles.center}>
          <Spinner size="large" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TasksTab', {
                  screen: 'TaskDetail',
                  params: { taskId: item.id },
                })
              }
            >
              <Card style={styles.resultCard}>
                <Text style={[styles.resultTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.resultMeta}>
                  <Badge label={item.priority} variant={priorityColors[item.priority]} size="sm" />
                  <Text style={[styles.resultTime, { color: colors.textSecondary }]}>
                    {formatRelativeTime(item.updatedAt)}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={
            hasSearched && !isSearching ? (
              <EmptyState title="No results" message={`No tasks match "${query}"`} />
            ) : !hasSearched ? (
              <View style={styles.center}>
                <Text style={{ fontSize: 48 }}>🔍</Text>
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  Type to search tasks
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  list: { padding: 16, paddingTop: 0, flexGrow: 1 },
  resultCard: { padding: 14 },
  resultTitle: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultTime: { fontSize: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  hint: { fontSize: 15, marginTop: 12 },
});
