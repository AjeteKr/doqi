import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) return null;

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
      Icon: CheckCircleIcon
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      Icon: XCircleIcon
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      Icon: InformationCircleIcon
    }
  };

  const style = styles[type] || styles.success;
  const Icon = style.Icon;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className={`${style.bg} ${style.border} border-l-4 rounded-lg shadow-2xl backdrop-blur-sm max-w-md overflow-hidden`}>
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className={`${style.iconBg} rounded-full p-2 flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${style.iconColor}`} />
          </div>
          
          {/* Message */}
          <div className="flex-1 pt-0.5">
            <p className={`${style.textColor} text-sm font-medium leading-relaxed`}>
              {message}
            </p>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50 p-1"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        {duration > 0 && (
          <div className="h-1 bg-white/30">
            <div 
              className={`h-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'} animate-progress`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;
