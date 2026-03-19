import React from 'react';
import './Toast.css';

export const Toast = ({ notification, onClose }) => {
  React.useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className={`toast toast-${notification.type}`}>
      <span className="toast-message">{notification.message}</span>
      <button className="toast-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export const ToastContainer = ({ notifications, onClose }) => {
  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => onClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
