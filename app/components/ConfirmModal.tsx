import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getStyleParams = () => {
    switch (type) {
      case 'danger':
        return {
          iconColor: 'text-red-500',
          iconBg: 'bg-red-500/20',
          btnClass: 'bg-red-600 hover:bg-red-500 text-white',
        };
      case 'info':
        return {
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-500/20',
          btnClass: 'bg-blue-600 hover:bg-blue-500 text-white',
        };
      case 'warning':
      default:
        return {
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-500/20',
          btnClass: 'bg-yellow-600 hover:bg-yellow-500 text-white',
        };
    }
  };

  const styles = getStyleParams();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans tracking-tight">
      <div 
        className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      <div className="relative bg-[#1E293B] border border-gray-700 w-11/12 max-w-sm rounded-2xl shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-full ${styles.iconBg}`}>
            <AlertTriangle className={styles.iconColor} size={24} />
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex space-x-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-[#0F172A] hover:bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`flex-1 px-4 py-3 font-bold rounded-xl transition-colors ${styles.btnClass} shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
