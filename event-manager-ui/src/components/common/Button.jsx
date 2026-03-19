import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
