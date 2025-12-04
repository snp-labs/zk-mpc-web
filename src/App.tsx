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
import './App.css';
import KeyRecoveryRequestScreen from './screens/KeyRecoveryRequestScreen';
import RecoverySuccessScreen from './screens/RecoverySuccessScreen';
import RecoveryFailureScreen from './screens/RecoveryFailureScreen';

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
          <Route path="more/key-recovery-request" element={<KeyRecoveryRequestScreen />} />
          <Route path="more/user-authentication" element={<UserAuthenticationScreen />} />
          <Route path="more/recovery-success" element={<RecoverySuccessScreen />} />
          <Route path="more/recovery-failure" element={<RecoveryFailureScreen />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;