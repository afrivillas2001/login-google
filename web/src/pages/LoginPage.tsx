import React, { useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';

const companyName = 'Nombre Empresa';

function CompanyLogo() {
  return (
    <div className="company-logo" aria-hidden="true">
      <span className="company-logo__ring" />
      <span className="company-logo__core">N</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="google-icon"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023H12v3.955h5.617c-.242 1.272-.967 2.35-2.058 3.073v2.553h3.33c1.95-1.796 3.079-4.443 3.079-7.604 0-.662-.059-1.297-.163-1.977Z"
        fill="#fff"
      />
      <path
        d="M12 22c2.79 0 5.13-.925 6.84-2.498l-3.33-2.553c-.925.62-2.109.985-3.51.985-2.698 0-4.985-1.821-5.802-4.272H2.756v2.633A10 10 0 0 0 12 22Z"
        fill="#fff"
        fillOpacity="0.88"
      />
      <path
        d="M6.198 13.662A5.99 5.99 0 0 1 5.874 12c0-.577.117-1.133.324-1.662V7.705H2.756A9.994 9.994 0 0 0 2 12c0 1.612.385 3.136 1.066 4.295l3.132-2.633Z"
        fill="#fff"
        fillOpacity="0.72"
      />
      <path
        d="M12 6.067c1.518 0 2.881.522 3.955 1.547l2.966-2.966C17.125 2.971 14.787 2 12 2a10 10 0 0 0-8.934 5.705l3.442 2.633C7.015 7.888 9.302 6.067 12 6.067Z"
        fill="#fff"
        fillOpacity="0.56"
      />
    </svg>
  );
}

function formatFirebaseError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No fue posible iniciar sesion con Google.';
}

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const provider = useMemo(() => {
    const nextProvider = new GoogleAuthProvider();
    nextProvider.setCustomParameters({ prompt: 'select_account' });
    return nextProvider;
  }, []);

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured || !auth) {
      setErrorMessage('Firebase no esta configurado correctamente para habilitar Google.');
      setStatus('');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setStatus('');

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setStatus(`Sesion iniciada como ${result.user.displayName || result.user.email || 'usuario'}.`);
    } catch (error) {
      setUser(null);
      setErrorMessage(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signOut(auth);
      setUser(null);
      setStatus('Sesion cerrada correctamente.');
    } catch (error) {
      setErrorMessage(formatFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="landing-shell">
      <section className="hero-card">
        <CompanyLogo />
        <div className="hero-copy">
          <p className="eyebrow">Acceso seguro</p>
          <h1>{companyName}</h1>
          <p className="hero-description">
            Inicia sesion con tu cuenta de Google usando Firebase Authentication.
          </p>
        </div>

        <div className="login-fallback">
          <button
            className="google-login-button"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <GoogleIcon />
            <span>{isSubmitting ? 'Conectando...' : 'Login con Google'}</span>
          </button>

          {user ? (
            <button
              className="secondary-button"
              type="button"
              onClick={handleLogout}
              disabled={isSubmitting}
            >
              Cerrar sesion
            </button>
          ) : null}

          {status ? <p className="status-message">{status}</p> : null}
          {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
        </div>
      </section>
    </main>
  );
}
