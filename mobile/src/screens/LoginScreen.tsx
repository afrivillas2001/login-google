import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {APP_CONFIG} from '../config/appConfig';
import {FALLBACK_STATUS_CODES, getGoogleSigninModule} from '../services/googleSignin';

type UserSummary = {
  name: string;
  email: string;
};

const FONT_FAMILY = Platform.select({
  ios: 'Helvetica',
  android: 'sans-serif',
  default: 'sans-serif',
});

const GOOGLE_CLIENT_ID_PLACEHOLDER =
  'REEMPLAZA_CON_TU_WEB_CLIENT_ID.apps.googleusercontent.com';

function formatGoogleError(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
      typeof error.code === 'string'
  ) {
    switch (error.code) {
      case FALLBACK_STATUS_CODES.SIGN_IN_CANCELLED:
        return 'El inicio de sesion se cancelo.';
      case FALLBACK_STATUS_CODES.IN_PROGRESS:
        return 'Ya hay un inicio de sesion en progreso.';
      case FALLBACK_STATUS_CODES.PLAY_SERVICES_NOT_AVAILABLE:
        return 'Google Play Services no esta disponible en este dispositivo.';
      default:
        break;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'No fue posible completar el login con Google.';
}

export default function LoginScreen() {
  const {width} = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<UserSummary | null>(null);
  const [feedback, setFeedback] = useState(
    'Inicia sesion con Google para continuar.',
  );

  useEffect(() => {
    const googleModule = getGoogleSigninModule();
    if (!googleModule) {
      setFeedback(
        'El modulo nativo de Google Sign-In no esta disponible. La app seguira abierta, pero el login no podra usarse hasta corregir la configuracion Android.',
      );
      return;
    }

    googleModule.GoogleSignin.configure({
      scopes: ['email', 'profile'],
      ...(APP_CONFIG.googleWebClientId !== GOOGLE_CLIENT_ID_PLACEHOLDER
        ? {webClientId: APP_CONFIG.googleWebClientId}
        : {}),
    });
  }, []);

  const handleGoogleLogin = async () => {
    const googleModule = getGoogleSigninModule();
    if (!googleModule) {
      const message =
        'Google Sign-In no esta enlazado correctamente en Android. Reinstala la app con el APK nuevo.';
      setFeedback(message);
      Alert.alert('Login no disponible', message);
      return;
    }

    if (APP_CONFIG.googleWebClientId === GOOGLE_CLIENT_ID_PLACEHOLDER) {
      setUser(null);
      setFeedback(
        'Configura tu Web Client ID de Google en src/config/appConfig.ts antes de probar el login.',
      );
      return;
    }

    try {
      setIsLoading(true);
      setFeedback('Abriendo autenticacion de Google...');

      await googleModule.GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result = await googleModule.GoogleSignin.signIn();
      setUser({
        name: result.user.name ?? 'Usuario Google',
        email: result.user.email,
      });
      setFeedback('Sesion iniciada correctamente.');
    } catch (error) {
      setUser(null);
      setFeedback(formatGoogleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const contentWidth = Math.min(width - 32, 420);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.screen}>
        <View style={[styles.card, {width: contentWidth}]}>
          <View style={styles.logoWrap}>
            <View style={styles.logoOuterRing}>
              <View style={styles.logoInnerRing}>
                <Text style={styles.logoText}>{APP_CONFIG.companyShortName}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.kicker}>Acceso Seguro</Text>
          <Text style={styles.title}>{APP_CONFIG.companyName}</Text>
          <Text style={styles.subtitle}>
            Login corporativo con Google desde una pantalla responsive para
            Android.
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={isLoading}
            onPress={handleGoogleLogin}
            style={({pressed}) => [
              styles.googleButton,
              pressed && !isLoading ? styles.googleButtonPressed : null,
              isLoading ? styles.googleButtonDisabled : null,
            ]}>
            {isLoading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <>
                <View style={styles.googleBadge}>
                  <Text style={styles.googleBadgeText}>G</Text>
                </View>
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </>
            )}
          </Pressable>

          <View style={styles.feedbackPanel}>
            <Text style={styles.feedbackLabel}>Estado</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
            {user ? (
              <View style={styles.userBox}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screen: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#050505',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoOuterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#2e2e2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInnerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#000000',
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    fontWeight: '700',
  },
  kicker: {
    color: '#9c9c9c',
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#c9c9c9',
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  googleButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButtonPressed: {
    opacity: 0.92,
    transform: [{scale: 0.99}],
  },
  googleButtonDisabled: {
    opacity: 0.75,
  },
  googleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadgeText: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
  },
  googleButtonText: {
    color: '#000000',
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackPanel: {
    marginTop: 22,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1f1f1f',
    backgroundColor: '#0b0b0b',
  },
  feedbackLabel: {
    color: '#9c9c9c',
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  feedbackText: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 20,
  },
  userBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f',
  },
  userName: {
    color: '#ffffff',
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: '#c9c9c9',
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    marginTop: 4,
  },
});
