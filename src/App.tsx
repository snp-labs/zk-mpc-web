import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import screens - these will all be broken and need fixing later
import WelcomeScreen from './screens/WelcomeScreen';
import UserAuthenticationScreen from './screens/UserAuthenticationScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import RecoverWalletScreen from './screens/RecoverWalletScreen';
import MainTabNavigator from './navigation/MainTabNavigator'; // This will become a layout component
import SendTokenScreen from './screens/SendTokenScreen';
import init from './wasm/pkg/threshold_ecdsa';
import { useEffectOnce } from './hooks/useEffectOnce';

// I will also need a global CSS file for fonts and base styles.
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/auth" element={<UserAuthenticationScreen />} />
          <Route path="/create-wallet" element={<CreateWalletScreen />} />
          <Route path="/recover-wallet" element={<RecoverWalletScreen />} />
          <Route path="/main/*" element={<MainTabNavigator />} />
          <Route path="/send" element={<SendTokenScreen />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;