import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'danger' // 'danger' or 'warning'
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-red-50 to-orange-50 px-6 pt-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white/50 p-1"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <div className="flex items-start gap-4">
              <div className={`${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'} rounded-full p-3 flex-shrink-0`}>
                <ExclamationTriangleIcon className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {title}
                </h3>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                type === 'danger' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
