import React from 'react';

const WalletIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill={color}/>
  </svg>
);

export default WalletIcon;