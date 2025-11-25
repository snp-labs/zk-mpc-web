import React from 'react';

const MoreIcon = ({ color, size }: { color: string, size: number }) => (
  <svg width={size} height={size} viewBox="0 0 17 5" fill="none">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.76 2.12C12.76 0.95 13.71 0 14.88 0C16.05 0 17 0.95 17 2.12C17 3.29 16.05 4.24 14.88 4.24C13.71 4.24 12.76 3.29 12.76 2.12ZM6.38 2.12C6.38 0.95 7.33 0 8.5 0C9.67 0 10.62 0.95 10.62 2.12C10.62 3.29 9.67 4.24 8.5 4.24C7.33 4.24 6.38 3.29 6.38 2.12ZM0 2.12C0 0.95 0.95 0 2.12 0C3.29 0 4.24 0.95 4.24 2.12C4.24 3.29 3.29 4.24 2.12 4.24C0.95 4.24 0 3.29 0 2.12Z" fill={color}/>
  </svg>
);

export default MoreIcon;