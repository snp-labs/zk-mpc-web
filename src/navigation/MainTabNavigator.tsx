import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import CustomTabBar from './CustomTabBar';

import TokensScreen from '../screens/TokensScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MoreScreen from '../screens/MoreScreen';

const MainLayout = () => {
  return (
    <div>
      <main style={{ paddingBottom: '100px' }}> {/* Add padding to prevent content from being hidden by the fixed tab bar */}
        <Outlet />
      </main>
      <footer>
        <CustomTabBar />
      </footer>
    </div>
  );
};

const MainTabNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="tokens" replace />} />
        <Route path="tokens" element={<TokensScreen />} />
        <Route path="history" element={<HistoryScreen />} />
        <Route path="more" element={<MoreScreen />} />
      </Route>
    </Routes>
  );
};

export default MainTabNavigator;