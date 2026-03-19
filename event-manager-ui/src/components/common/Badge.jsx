import React from 'react';
import './Badge.css';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
};

export const StatusBadge = ({ status }) => {
  const statusVariants = {
    'PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger',
    'CANCELLED': 'secondary',
    'REGISTERED': 'success',
    'ATTENDED': 'success',
    'REMOVED': 'danger',
    'DELETED': 'danger'
  };

  const variant = statusVariants[status] || 'primary';
  const label = status.replace('_', ' ').toLowerCase();

  return (
    <Badge variant={variant}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Badge>
  );
};

export default Badge;
