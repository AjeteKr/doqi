import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

export default function AdminSettings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'DoqiSHPK',
    siteDescription: 'Quality furniture and mattresses',
    contactEmail: 'info@doqishpk.com',
    contactPhone: '+383 44 123 456',
    
    // Business Settings
    currency: 'EUR',
    taxRate: 18,
    shippingFee: 5,
    freeShippingThreshold: 100,
    
    // Email Settings
    emailNotifications: true,
    orderNotifications: true,
    newUserNotifications: false,
    
    // Product Settings
    productsPerPage: 12,
    allowReviews: true,
    moderateReviews: true,
    maxImageSize: 5,
    
    // Security Settings
    requireEmailVerification: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'We are currently updating our system. Please check back soon.'
  });

  const [originalSettings, setOriginalSettings] = useState({ ...settings });

  useEffect(() => {
    // Check if user is admin (role_id = 1)
    if (!isAuthenticated || !user || user.role !== 1) {
      navigate('/');
      return;
    }

    // TODO: Fetch settings from backend
    // For now, we're using local state
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    setConfirmDialog({
      title: t('confirmDialog.saveSettings.title'),
      message: t('confirmDialog.saveSettings.message'),
      confirmText: t('confirmDialog.saveSettings.confirmText'),
      cancelText: t('confirmDialog.saveSettings.cancelText'),
      type: 'warning',
      onConfirm: confirmSaveSettings
    });
  };

  const confirmSaveSettings = async () => {
    try {
      setLoading(true);
      
      // TODO: Send settings to backend
      // await updateSettings(settings);
      
      setOriginalSettings({ ...settings });
      setToast({ type: 'success', message: t('admin.settings.success.saved') });
    } catch (error) {
      setToast({ type: 'error', message: t('admin.settings.errors.saveFailed') });
    } finally {
      setLoading(false);
    }
  };

  const handleResetSettings = () => {
    setConfirmDialog({
      title: t('confirmDialog.resetSettings.title'),
      message: t('confirmDialog.resetSettings.message'),
      confirmText: t('confirmDialog.resetSettings.confirmText'),
      cancelText: t('confirmDialog.resetSettings.cancelText'),
      type: 'danger',
      onConfirm: confirmResetSettings
    });
  };

  const confirmResetSettings = () => {
    setSettings({ ...originalSettings });
    setToast({ type: 'info', message: t('admin.settings.success.reset') });
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  return (
    <div className="p-8">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          isOpen={true}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          type={confirmDialog.type}
        />
      )}

      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('admin.settings.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('admin.settings.subtitle')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetSettings}
            disabled={!hasChanges}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
          >
            {t('admin.settings.reset')}
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={!hasChanges || loading}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {loading ? t('admin.settings.saving') : t('admin.settings.save')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.general.title')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.general.siteName')}
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.general.siteDescription')}
              </label>
              <textarea
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.general.contactEmail')}
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.general.contactPhone')}
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.business.title')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.business.currency')}
              </label>
              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.business.taxRate')} (%)
              </label>
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.business.shippingFee')} (€)
              </label>
              <input
                type="number"
                id="shippingFee"
                name="shippingFee"
                min="0"
                step="0.01"
                value={settings.shippingFee}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.business.freeShippingThreshold')} (€)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                name="freeShippingThreshold"
                min="0"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.email.title')}</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.email.emailNotifications')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.email.emailNotificationsDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.email.orderNotifications')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.email.orderNotificationsDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="orderNotifications"
                checked={settings.orderNotifications}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.email.newUserNotifications')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.email.newUserNotificationsDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="newUserNotifications"
                checked={settings.newUserNotifications}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Product Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.products.title')}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="productsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.products.productsPerPage')}
              </label>
              <input
                type="number"
                id="productsPerPage"
                name="productsPerPage"
                min="4"
                max="100"
                value={settings.productsPerPage}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="maxImageSize" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.products.maxImageSize')} (MB)
              </label>
              <input
                type="number"
                id="maxImageSize"
                name="maxImageSize"
                min="1"
                max="50"
                value={settings.maxImageSize}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.products.allowReviews')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.products.allowReviewsDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="allowReviews"
                checked={settings.allowReviews}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.products.moderateReviews')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.products.moderateReviewsDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="moderateReviews"
                checked={settings.moderateReviews}
                onChange={handleInputChange}
                disabled={!settings.allowReviews}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
              />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.security.title')}</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.security.requireEmailVerification')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.security.requireEmailVerificationDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={handleInputChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>

            <div>
              <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.security.sessionTimeout')} (minutes)
              </label>
              <input
                type="number"
                id="sessionTimeout"
                name="sessionTimeout"
                min="5"
                max="1440"
                value={settings.sessionTimeout}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="maxLoginAttempts" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.security.maxLoginAttempts')}
              </label>
              <input
                type="number"
                id="maxLoginAttempts"
                name="maxLoginAttempts"
                min="3"
                max="10"
                value={settings.maxLoginAttempts}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{t('admin.settings.maintenance.title')}</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{t('admin.settings.maintenance.maintenanceMode')}</p>
                <p className="text-sm text-gray-500">{t('admin.settings.maintenance.maintenanceModeDesc')}</p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
                className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
            </label>

            <div>
              <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 mb-2">
                {t('admin.settings.maintenance.maintenanceMessage')}
              </label>
              <textarea
                id="maintenanceMessage"
                name="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={handleInputChange}
                rows={3}
                disabled={!settings.maintenanceMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Banner (Sticky) */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl z-40 animate-slide-up">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-semibold">{t('admin.settings.unsavedChanges')}</p>
                <p className="text-blue-100 text-sm">{t('admin.settings.unsavedChangesDesc')}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleResetSettings}
                className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all duration-200"
              >
                {t('admin.settings.discard')}
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-all duration-200 shadow-sm"
              >
                {loading ? t('admin.settings.saving') : t('admin.settings.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
