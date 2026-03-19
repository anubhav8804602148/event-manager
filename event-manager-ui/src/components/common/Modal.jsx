import React from 'react';
import './Modal.css';

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  footer,
  size = 'medium',
  closable = true
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          {closable && (
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false
}) => {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="btn btn-secondary">
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`btn btn-${isDangerous ? 'danger' : 'primary'}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default Modal;
