import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Platform, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Maxica logo icon (file lives at <project root>/assets/images/icon.png)
const LOGO_ICON = require('../../assets/images/icon.png');

const COLORS = {
  background: '#6AA9DC',
  iconCard: '#FFF9F5',
  white: '#FFFFFF',
  buttonBg: '#DBE6F1',
  buttonText: '#1A1A8C',
};

// Maxica uses a decorative display serif. Replace with your custom font
// (via expo-font) once you have the font file, e.g. 'Maxica-Regular'.
const LOGO_FONT = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/scan');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Logo section */}
        <View style={styles.heroSection}>
          <View style={styles.iconCard}>
            <Image source={LOGO_ICON} style={styles.iconImage} resizeMode="cover" />
          </View>
          <Text style={styles.logoText}>Maxica</Text>
        </View>

        {/* Description + CTA */}
        <View style={styles.bottomSection}>
          <Text style={styles.description}>
            Discover smarter waste management with Maxica. Identify waste materials, learn their
            environmental impact, and discover proper disposal methods for a cleaner and greener
            future.
          </Text>

          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="Get Started">
            <Text style={styles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={26} color={COLORS.buttonText} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 64,
    paddingBottom: 64,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconCard: {
    width: 108,
    height: 108,
    borderRadius: 24,
    backgroundColor: COLORS.iconCard,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconImage: {
    width: 108,
    height: 108,
  },
  logoText: {
    fontFamily: LOGO_FONT,
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  bottomSection: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  description: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.buttonBg,
    paddingVertical: 10,
    paddingHorizontal: 34,
    borderRadius: 999,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 15,
    fontWeight: '700',
  },
});
