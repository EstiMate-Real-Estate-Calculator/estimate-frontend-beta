'use client';
import React, { useEffect } from 'react';

const AlertBubble = ({ message, onClose, onClick }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <button
        onClick={onClick}
        className="cursor-pointer bg-red-500 text-white px-6 py-4 rounded shadow-lg text-center transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 max-w-lg w-full"
        title="Click to view full error details"
      >
        <p className="text-base font-medium whitespace-pre-wrap">{message}</p>
        <p className="text-sm mt-1 opacity-80">(Click to view more details)</p>
      </button>
    </div>
  );
};

export default AlertBubble;
