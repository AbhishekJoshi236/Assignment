import React, { useEffect, useRef } from 'react';
import { ConfirmDialogProps } from '../../types/proptypes';

type DialogType = 'info' | 'danger' | 'success' | 'warning';

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Close dialog when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when dialog is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const typeStyles = {
    danger: {
      icon: (
        <svg className="w-10 h-10 text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-red-600 hover:bg-red-700',
      borderColor: 'border-red-600'
    },
    info: {
      icon: (
        <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmButton: 'bg-blue-600 hover:bg-blue-700',
      borderColor: 'border-blue-600'
    },
    success: {
      icon: (
        <svg className="w-10 h-10 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      confirmButton: 'bg-green-600 hover:bg-green-700',
      borderColor: 'border-green-600'
    },
    warning: {
      icon: (
        <svg className="w-10 h-10 text-yellow-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      confirmButton: 'bg-yellow-600 hover:bg-yellow-700',
      borderColor: 'border-yellow-600'
    }
  };

  const dialogType = type as DialogType;
  const currentTypeStyle = typeStyles[dialogType] || typeStyles.info;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className={`bg-gray-900 rounded-lg shadow-lg max-w-md w-full border-l-4 ${currentTypeStyle.borderColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            {currentTypeStyle.icon}
          </div>
          
          <h3 className="text-xl font-bold text-gray-100 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-300 mb-6">
            {message}
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="py-3 px-6 text-base font-medium rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300 min-w-[100px]"
              onClick={onClose}
            >
              {cancelText}
            </button>
            
            <button
              type="button"
              className={`py-3 px-6 text-base font-medium text-white rounded-lg min-w-[100px] ${currentTypeStyle.confirmButton}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 