import React from 'react';

export default function LoginPage() {
  return (
    <div style={{ backgroundColor: '#000', color: '#fff', fontFamily: 'Helvetica', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1>Nombre Empresa</h1>
      <button style={{ padding: '10px 20px' }}>Login con Google</button>
    </div>
  );
}