import React from 'react';

const Notification = ({ message, type }) => {
  const backgroundColor = type === 'success' ? '#8a2be2' : '#d8bfd8';
  const color = type === 'success' ? '#ffffff' : '#000000';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '5px',
        backgroundColor,
        color,
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
};

export default Notification;