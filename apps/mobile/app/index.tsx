import { Link } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '@/lib/auth-store';
import { colors } from '@/lib/theme';

// Placeholder home — product listing arrives in Phase 2 (FR-MOB-002).
export default function HomeScreen() {
  const { session, initialized, signOut } = useAuthStore();

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>Ачаалж байна…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>НОГООЛИН</Text>
      <Text style={styles.muted}>
        Сүсэг бишрэлийн бүтээгдэхүүний цахим лавлах
      </Text>

      <Link href="/products" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Каталог үзэх</Text>
        </TouchableOpacity>
      </Link>

      {session ? (
        <>
          <Text style={styles.muted}>Нэвтэрсэн: {session.user.email}</Text>
          <TouchableOpacity style={styles.ghostButton} onPress={() => void signOut()}>
            <Text style={styles.ghostButtonText}>Гарах</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Нэвтрэх</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/signup" asChild>
            <TouchableOpacity style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>Бүртгүүлэх</Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    backgroundColor: colors.paper,
    padding: 24,
  },
  title: { fontSize: 32, letterSpacing: 4, color: colors.ink },
  muted: { fontSize: 13, color: colors.muted },
  button: {
    backgroundColor: colors.act,
    borderRadius: 999,
    paddingHorizontal: 34,
    paddingVertical: 14,
  },
  buttonText: { color: colors.actText, fontWeight: '600' },
  ghostButton: {
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 34,
    paddingVertical: 14,
  },
  ghostButtonText: { color: colors.ink, fontWeight: '600' },
});
