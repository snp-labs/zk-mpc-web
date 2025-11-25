import React from 'react';

const HistoryIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 14" fill="none">
    <path d="M16 0V2.67H0V0H16ZM11.33 13.33H0V10.66H11.33V13.33ZM16 8H0V5.33H16V8Z" fill={color}/>
  </svg>
);

export default HistoryIcon;