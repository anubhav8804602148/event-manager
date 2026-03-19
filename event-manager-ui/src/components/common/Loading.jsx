import React from 'react';
import './Loading.css';

export const Spinner = ({ size = 'medium', color = 'primary' }) => {
  return <div className={`spinner spinner-${size} spinner-${color}`}></div>;
};

export const SkeletonLoader = ({ count = 1, height = '100px', className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{ height }}
        ></div>
      ))}
    </>
  );
};

export const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading-container">
      <Spinner size="large" />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
