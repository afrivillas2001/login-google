import React from 'react';
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
});