import React from 'react';

import Home from './home/Home';
import { AuthProvider } from './auth';

function App() {
  return (
    <AuthProvider>
      <Home />
    </AuthProvider>
  );
}

export default App;
