import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Product } from '@nogoolin/validation-schemas';
import { fetchProductBySlug, formatPrice } from '@/lib/api';
import { colors } from '@/lib/theme';

const WIDTH = Dimensions.get('window').width;

const STOCK_LABELS: Record<string, { label: string; inStock: boolean }> = {
  in_stock: { label: 'Бэлэн байгаа', inStock: true },
  pre_order: { label: 'Захиалгаар', inStock: true },
  out_of_stock: { label: 'Түр байхгүй', inStock: false },
};

function parseSteps(markdown: string): string[] {
  return markdown
    .split('\n')
    .map((line) => /^\s*\d+[.)]\s+(.*)$/.exec(line)?.[1] ?? '')
    .filter(Boolean);
}

// Detail screen (FR-MOB-003): swipeable image gallery (paged FlatList),
// price, description, usage instructions as numbered steps. The 360° viewer
// joins in Phase 3 (expo-gl / model-viewer POC, FR-MOB-010).
export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetchProductBySlug(slug)
      .then(setProduct)
      .catch(() => setError('Сервертэй холбогдож чадсангүй'));
  }, [slug]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠ {error}</Text>
      </View>
    );
  }
  if (product === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.act} size="large" />
      </View>
    );
  }
  if (product === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.halo}>◎</Text>
        <Text style={styles.mutedText}>
          Бүтээгдэхүүн олдсонгүй эсвэл нийтлэгдээгүй байна.
        </Text>
      </View>
    );
  }

  const stock = STOCK_LABELS[product.stock_status] ?? STOCK_LABELS['in_stock']!;
  const images = product.images ?? [];
  const steps = product.usage_instruction ? parseSteps(product.usage_instruction) : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* swipeable gallery */}
      {images.length > 0 ? (
        <View>
          <FlatList
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            data={images}
            keyExtractor={(img) => img.id}
            onMomentumScrollEnd={(e) =>
              setActiveImage(Math.round(e.nativeEvent.contentOffset.x / WIDTH))
            }
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image_url }}
                style={styles.galleryImage}
                resizeMode="cover"
              />
            )}
          />
          {images.length > 1 && (
            <View style={styles.dots}>
              {images.map((img, i) => (
                <View
                  key={img.id}
                  style={[styles.dot, i === activeImage && styles.dotActive]}
                />
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.galleryImage, styles.galleryEmpty]}>
          <Text style={styles.halo}>◎</Text>
        </View>
      )}

      <View style={styles.body}>
        {product.category && <Text style={styles.tag}>{product.category.name}</Text>}
        <Text style={styles.name}>{product.name}</Text>
        {product.name_en && <Text style={styles.nameEn}>{product.name_en}</Text>}
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <View style={styles.stockRow}>
          <View
            style={[
              styles.stockDot,
              { backgroundColor: stock.inStock ? colors.act : colors.hair },
            ]}
          />
          <Text style={stock.inStock ? styles.stockIn : styles.mutedText}>
            {stock.label}
          </Text>
        </View>

        {product.short_description && (
          <Text style={styles.shortDescription}>{product.short_description}</Text>
        )}

        {product.full_description && (
          <>
            <Text style={styles.sectionTitle}>Дэлгэрэнгүй тайлбар</Text>
            <Text style={styles.paragraph}>{product.full_description}</Text>
          </>
        )}

        {steps.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Хэрэглэх заавар</Text>
            {steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  content: { paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.paper,
    padding: 24,
  },
  errorText: { fontSize: 13, color: colors.saffDeep, fontWeight: '600' },
  mutedText: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  halo: { fontSize: 44, color: colors.saffDeep, opacity: 0.4 },
  galleryImage: { width: WIDTH, aspectRatio: 4 / 3.2 },
  galleryEmpty: {
    backgroundColor: colors.paperAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { height: 6, width: 6, borderRadius: 3, backgroundColor: colors.hair },
  dotActive: { backgroundColor: colors.act },
  body: { padding: 18, gap: 8 },
  tag: { fontSize: 11, color: colors.actText, fontWeight: '600' },
  name: { fontSize: 24, color: colors.ink, lineHeight: 30 },
  nameEn: { fontSize: 13, color: colors.muted },
  price: { fontSize: 26, color: colors.saffDeep, fontWeight: '600' },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  stockDot: { height: 8, width: 8, borderRadius: 4 },
  stockIn: { fontSize: 13, color: colors.ink },
  shortDescription: { fontSize: 14, lineHeight: 24, color: colors.muted },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 14,
    marginBottom: 4,
  },
  paragraph: { fontSize: 14, lineHeight: 26, color: colors.ink },
  stepRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  stepNumber: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderColor: colors.act,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 13, color: colors.act },
  stepText: { flex: 1, fontSize: 14, lineHeight: 24, color: colors.ink },
});
