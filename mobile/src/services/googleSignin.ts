import {NativeModules} from 'react-native';

const FALLBACK_STATUS_CODES = {
  SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
  IN_PROGRESS: 'IN_PROGRESS',
  PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
} as const;

type GoogleSigninModule = {
  GoogleSignin: {
    configure: (options: Record<string, unknown>) => void;
    hasPlayServices: (options?: {showPlayServicesUpdateDialog?: boolean}) => Promise<boolean>;
    signIn: () => Promise<{
      user: {
        name: string | null;
        email: string;
      };
    }>;
  };
  statusCodes: typeof FALLBACK_STATUS_CODES;
};

export function getGoogleSigninModule(): GoogleSigninModule | null {
  if (!NativeModules.RNGoogleSignin) {
    return null;
  }

  const googleSigninPackage = require('@react-native-google-signin/google-signin') as GoogleSigninModule;
  return {
    GoogleSignin: googleSigninPackage.GoogleSignin,
    statusCodes: googleSigninPackage.statusCodes ?? FALLBACK_STATUS_CODES,
  };
}

export {FALLBACK_STATUS_CODES};
