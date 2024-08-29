import React, { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  const backgroundColor = type === 'success' ? '#8a2be2' : '#d8bfd8';
  const color = type === 'success' ? '#ffffff' : '#000000';

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose(); // Call onClose if provided
    }, 5000); // Notification will disappear after 5 seconds

    return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, [message, type, onClose]);

  if (!visible) return null;

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
