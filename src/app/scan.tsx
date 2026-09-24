import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LOGO_ICON = require('../../assets/images/icon.png');

const COLORS = {
  background: '#DCEDFC',
  navy: '#1A1A8C',
  white: '#FFFFFF',
  scanTint: 'rgba(26, 26, 140, 0.22)',
  scanLine: '#7FE0FF',
};

// TODO: replace with your real waste-identification call (API / ML model).
// Receives the captured photo URI and should resolve with the result.
async function analyzeWaste(photoUri?: string) {
  console.log('Scanning photo:', photoUri);
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 2500));
  return { label: 'Unknown item' };
}

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [facing, setFacing] = useState<CameraType>('back');
  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [camHeight, setCamHeight] = useState(0);

  const scanAnim = useRef(new Animated.Value(0)).current;

  // Moving scan line while scanning
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1100,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    if (scanning) {
      loop.start();
    } else {
      scanAnim.setValue(0);
    }

    return () => loop.stop();
  }, [scanning, scanAnim]);

  const onCameraLayout = (e: LayoutChangeEvent) => {
    setCamHeight(e.nativeEvent.layout.height);
  };

  const toggleFacing = () => {
    if (scanning) return;
    if (facing === 'back') setFlashOn(false); // front camera has no flash
    setFacing(facing === 'back' ? 'front' : 'back');
  };

  const toggleFlash = () => {
    if (scanning || facing === 'front') return;
    setFlashOn((on) => !on);
  };

  const handleCapture = async () => {
    if (scanning || !cameraRef.current) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const result = await analyzeWaste(photo?.uri);
      Alert.alert('Scan complete', `Detected: ${result.label}`);
    } catch {
      Alert.alert('Scan failed', 'Something went wrong. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  // ---- Permission states ----
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.permissionText}>Maxica needs camera access to scan waste items.</Text>
        <Pressable style={styles.permissionButton} onPress={() => requestPermission()}>
          <Text style={styles.permissionButtonText}>Allow camera</Text>
        </Pressable>
      </View>
    );
  }

  const lineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(camHeight - 4, 0)],
  });

  const flashDisabled = scanning || facing === 'front';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backButton}
            accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={26} color={COLORS.navy} />
          </Pressable>
          <View style={styles.logoBadge}>
            <Image source={LOGO_ICON} style={styles.logoImage} resizeMode="cover" />
          </View>
        </View>

        {/* Centered camera + controls */}
        <View style={styles.content}>
          <View style={styles.cameraWrapper} onLayout={onCameraLayout}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              enableTorch={flashOn && facing === 'back'}
            />

            {scanning && (
              <View style={styles.scanOverlay} pointerEvents="none">
                <Animated.View
                  style={[styles.scanLine, { transform: [{ translateY: lineTranslateY }] }]}
                />
                <View style={styles.scanPill}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.scanPillText}>Scanning...</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.controls}>
            <Pressable
              onPress={toggleFacing}
              disabled={scanning}
              style={[styles.sideButton, scanning && styles.disabled]}
              accessibilityLabel="Flip camera">
              <Ionicons name="camera-reverse-outline" size={26} color={COLORS.navy} />
            </Pressable>

            <Pressable
              onPress={handleCapture}
              disabled={scanning}
              style={({ pressed }) => [styles.captureRing, pressed && styles.capturePressed]}
              accessibilityLabel="Capture and scan">
              <View style={styles.captureInner}>
                {scanning && <ActivityIndicator size="small" color={COLORS.navy} />}
              </View>
            </Pressable>

            <Pressable
              onPress={toggleFlash}
              disabled={flashDisabled}
              style={[
                styles.sideButton,
                flashOn && styles.sideButtonActive,
                flashDisabled && styles.disabled,
              ]}
              accessibilityLabel="Toggle flash">
              <Ionicons
                name={flashOn ? 'flash' : 'flash-off-outline'}
                size={26}
                color={flashOn ? COLORS.white : COLORS.navy}
              />
            </Pressable>
          </View>
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
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  logoImage: {
    width: 44,
    height: 44,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 48,
  },
  cameraWrapper: {
    width: '100%',
    aspectRatio: 0.85, // width / height. 1 = square, lower = taller
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.scanTint,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: COLORS.scanLine,
    shadowColor: COLORS.scanLine,
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  scanPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.navy,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  scanPillText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 8,
  },
  captureRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 8,
    borderColor: COLORS.navy,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capturePressed: {
    transform: [{ scale: 0.94 }],
  },
  sideButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButtonActive: {
    backgroundColor: COLORS.navy,
  },
  disabled: {
    opacity: 0.4,
  },
  permissionText: {
    color: COLORS.navy,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
  },
  permissionButton: {
    backgroundColor: COLORS.navy,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  permissionButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
