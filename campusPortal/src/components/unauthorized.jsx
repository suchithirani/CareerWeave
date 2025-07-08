// src/components/Unauthorized.jsx
import React from 'react';

const unauthorized = () => {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>403 - Unauthorized</h2>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default unauthorized;
