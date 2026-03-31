#!/usr/bin/env node

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const root = path.join(process.cwd(), "login-google");

// Función para crear carpetas
function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Carpeta creada: ${dir}`);
  }
}

// Función para crear archivos
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`📄 Archivo creado: ${filePath}`);
}

// Crear estructura base
createDir(root);
createDir(path.join(root, "mobile/src/screens"));
createDir(path.join(root, "web/src/pages"));
createDir(path.join(root, "apk"));
//Crear index.html
createFile(
  path.join(root, "web/index.html"),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login Google</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/App.tsx"></script>
  </body>
</html>`
);


// Crear package.json para mobile
createFile(
  path.join(root, "mobile/package.json"),
  `{
    "name": "login-google-mobile",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "start": "react-native start",
      "android": "react-native run-android",
      "ios": "react-native run-ios"
    },
    "dependencies": {
      "react": "18.2.0",
      "react-native": "0.74.0",
      "@react-native-google-signin/google-signin": "^10.0.0"
    },
    "devDependencies": {
      "@babel/core":"^7.29.0",
      "@babel/runtime":"^7.29.2",
      "typescript": "^5.0.0",
      "@react-native/babel-preset": "^0.74.0",
      "@babel/plugin-transform-class-properties": "^7.28.6",
      "@babel/plugin-transform-optional-chaining": "^7.28.6",
      "@babel/plugin-transform-nullish-coalescing-operator": "^7.28.6",
      "@babel/plugin-transform-object-rest-spread": "^7.28.6",
      "@babel/plugin-transform-numeric-separator": "^7.28.6",
      "rimraf": "^5.0.0",
      "uglify-js": "^3.17.4"
    }
  }`
);

// Crear package.json para web
createFile(
  path.join(root, "web/package.json"),
  `{
    "name": "login-google-web",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@react-oauth/google": "^0.12.1"
    },
    "devDependencies": {
      "vite": "^5.0.0",
      "typescript": "^5.3.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0"
    }
  }`
);

// React Native App.tsx
createFile(
  path.join(root, "mobile/src/App.tsx"),
  `import React from 'react';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return <LoginScreen />;
}`
);

// React Native LoginScreen
createFile(
  path.join(root, "mobile/src/screens/LoginScreen.tsx"),
  `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nombre Empresa</Text>
      <Button title="Login con Google" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontFamily: 'Helvetica', fontSize: 24, marginBottom: 20 }
});`
);

// React Web App.tsx
createFile(
  path.join(root, "web/src/App.tsx"),
  `import React from 'react';
import LoginPage from './pages/LoginPage';

export default function App() {
  return <LoginPage />;
}`
);

// React Web LoginPage
createFile(
  path.join(root, "web/src/pages/LoginPage.tsx"),
  `import React from 'react';

export default function LoginPage() {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Helvetica', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1>Nombre Empresa</h1>
      <button style={{ padding: '10px 20px' }}>Login con Google</button>
    </div>
  );
}`
);

// README
createFile(
  path.join(root, "README.md"),
  `# Login Google Project

Este proyecto incluye:
- 📱 App móvil en React Native (Android/iOS)
- 💻 Web responsive en React + Vite + TypeScript
- 📦 APK en carpeta \`apk\`

## Cómo iniciar

### Web
\`\`\`
cd web
npm install
npm run dev
\`\`\`

### Mobile
\`\`\`
cd mobile
npm install
npm run android
\`\`\`

El APK se generará en la carpeta \`apk\` tras compilar en Android Studio.
`
);

console.log("\n🚀 Proyecto 'login-google' creado con éxito. Abre la carpeta en Visual Studio Code.");
