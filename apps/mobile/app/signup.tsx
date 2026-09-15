import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { colors } from '@/lib/theme';

// Sign-up — full_name goes into user metadata for the on_auth_user_created
// trigger; role defaults to 'customer' (UC-SYS-001).
export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit() {
    setPending(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setPending(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Бүтэн нэр"
        placeholderTextColor={colors.muted}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="И-мэйл"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Нууц үг (6+ тэмдэгт)"
        placeholderTextColor={colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, pending && styles.disabled]}
        disabled={pending}
        onPress={() => void onSubmit()}
      >
        <Text style={styles.buttonText}>
          {pending ? 'Бүртгэж байна…' : 'Бүртгүүлэх'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 14, backgroundColor: colors.paper, padding: 24 },
  input: {
    borderColor: colors.hair,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink,
  },
  button: {
    backgroundColor: colors.act,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: colors.actText, fontWeight: '600' },
  disabled: { opacity: 0.5 },
  error: { color: colors.saffDeep, fontSize: 12 },
});
