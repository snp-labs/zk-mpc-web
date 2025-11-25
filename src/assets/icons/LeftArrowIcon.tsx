import React from 'react';

const LeftArrowIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 17 17" fill="none">
    <path d="M16.5 8.06H0.5M0.5 8.06L8.06 0.5M0.5 8.06L8.06 15.62" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default LeftArrowIcon;