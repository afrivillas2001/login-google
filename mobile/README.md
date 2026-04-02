# Login Google Mobile

Aplicacion React Native para Android con pantalla de inicio en negro, texto blanco y login con Google.

## Configurar login Google

1. Abre [src/config/appConfig.ts](c:\Users\LENOVO\programacion\login-google\mobile\src\config\appConfig.ts) y reemplaza `googleWebClientId` por tu Web Client ID real.
2. Registra el paquete Android `com.logingooglemobile` en Google Cloud o Firebase.
3. Genera las huellas SHA-1 y SHA-256 del keystore que vayas a usar y agregalas al cliente Android.

## Ejecutar en Android

1. Inicia Metro con `npm run start`.
2. En otra terminal ejecuta `npm run android`.

Nota: el `app-debug.apk` es para desarrollo y depende de Metro. Si instalas un APK manualmente en el telefono, usa el APK de release.

## Generar APK segura

1. Crea un keystore propio, por ejemplo:

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore android\keystores\release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

2. Guarda estas variables en `%USERPROFILE%\.gradle\gradle.properties`:

```properties
MYAPP_UPLOAD_STORE_FILE=../keystores/release.keystore
MYAPP_UPLOAD_KEY_ALIAS=upload
MYAPP_UPLOAD_STORE_PASSWORD=tu_password
MYAPP_UPLOAD_KEY_PASSWORD=tu_password
```

3. Compila release:

```powershell
npm run build:android:apk
```

4. El APK queda en `android\app\build\outputs\apk\release\app-release.apk`.

Si no configuras el keystore de release, Gradle hara fallback al keystore debug para no bloquear el build, pero eso no es adecuado para distribucion real.
