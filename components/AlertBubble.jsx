'use client';
import React, { useEffect } from 'react';

const AlertBubble = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-red-500 text-white px-6 py-3 rounded shadow-lg text-center transition-opacity duration-300 ease-in-out opacity-100">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default AlertBubble;