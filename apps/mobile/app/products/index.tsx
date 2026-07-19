import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Category, Product } from '@nogoolin/validation-schemas';
import { fetchCategories, fetchProducts, formatPrice } from '@/lib/api';
import { colors } from '@/lib/theme';

// Listing screen (FR-MOB-002): category chips (single horizontal row —
// same locked rule as web), debounced multi-script search (server-side,
// FR-PUB-014), 2-column product grid, pull-to-refresh, load-more paging.
export default function ProductListScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [categorySlug, setCategorySlug] = useState('');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (pageNum: number, append: boolean) => {
      setError(null);
      if (!append) setLoading(true);
      try {
        const res = await fetchProducts({
          page: pageNum,
          category_slug: categorySlug || undefined,
          search: debounced || undefined,
        });
        setProducts((prev) => (append ? [...prev, ...res.data] : res.data));
        setPage(res.meta.page);
        setTotalPages(res.meta.total_pages);
        setTotal(res.meta.total);
      } catch {
        setError('Сервертэй холбогдож чадсангүй');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [categorySlug, debounced],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const chips = [{ slug: '', name: 'Бүгд' }, ...categories];

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Хайх… (кирилл / латин / англи)"
        placeholderTextColor={colors.muted}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        horizontal
        data={chips}
        keyExtractor={(c) => c.slug || 'all'}
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        contentContainerStyle={styles.chipRowContent}
        renderItem={({ item }) => {
          const active = categorySlug === item.slug;
          return (
            <TouchableOpacity
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setCategorySlug(item.slug)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <TouchableOpacity style={styles.retry} onPress={() => void load(1, false)}>
            <Text style={styles.retryText}>Дахин оролдох</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.act} size="large" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.mutedText}>
            Илэрц олдсонгүй. Хайлтаа өөрчлөх эсвэл өөр ангилал сонгоно уу.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          ListHeaderComponent={
            <Text style={styles.count}>{total} бүтээгдэхүүн олдлоо</Text>
          }
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(1, false);
          }}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (page < totalPages) void load(page + 1, true);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/products/${item.slug}`)}
            >
              {item.images?.[0] ? (
                <Image
                  source={{ uri: item.images[0].image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.cardImage, styles.cardImageEmpty]}>
                  <Text style={styles.halo}>◎</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                {item.category && (
                  <Text style={styles.cardTag}>{item.category.name}</Text>
                )}
                <Text style={styles.cardName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  search: {
    margin: 14,
    marginBottom: 8,
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  chipRow: { flexGrow: 0 },
  chipRowContent: { paddingHorizontal: 14, gap: 8, paddingBottom: 10 },
  chip: {
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: { borderColor: colors.act, backgroundColor: '#E7F8EE' },
  chipText: { fontSize: 13, color: colors.muted },
  chipTextActive: { color: colors.ink },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  mutedText: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  errorText: { fontSize: 13, color: colors.saffDeep, fontWeight: '600' },
  retry: {
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  retryText: { fontSize: 12, color: colors.ink, fontWeight: '600' },
  count: { fontSize: 12, color: colors.muted, marginBottom: 10 },
  gridRow: { gap: 12 },
  gridContent: { padding: 14, gap: 12 },
  card: {
    flex: 1,
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  cardImage: { aspectRatio: 4 / 3.4, width: '100%' },
  cardImageEmpty: {
    backgroundColor: colors.paperAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: { fontSize: 34, color: colors.saffDeep, opacity: 0.4 },
  cardBody: { padding: 10, gap: 4 },
  cardTag: { fontSize: 10, color: colors.actText, fontWeight: '600' },
  cardName: { fontSize: 14, color: colors.ink, lineHeight: 19 },
  cardPrice: { fontSize: 16, color: colors.saffDeep, fontWeight: '600' },
});
