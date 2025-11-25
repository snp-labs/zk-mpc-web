import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './CustomTabBar.module.css';

import HistoryIcon from '../assets/icons/HistoryIcon';
import WalletIcon from '../assets/icons/WalletIcon';
import MoreIcon from '../assets/icons/MoreIcon';

const tabs = [
  { path: '/main/history', label: 'History', Icon: HistoryIcon },
  { path: '/main/tokens', label: 'Tokens', Icon: WalletIcon },
  { path: '/main/more', label: 'More', Icon: MoreIcon },
];

const CustomTabBar = () => {
  const primaryColor = '#0055FF';
  const inactiveColor = '#A9A9A9'; // A placeholder for inactive color

  return (
    <div className={styles.tabBarContainer}>
      {tabs.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${styles.tabLink} ${isActive ? styles.tabLinkActive : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <Icon color={isActive ? primaryColor : inactiveColor} size={24} />
              <p className={styles.tabLabel} style={{ color: isActive ? primaryColor : inactiveColor }}>
                {label}
              </p>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default CustomTabBar;