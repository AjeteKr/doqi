import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getUsers, updateUserStatus, updateUserRole, deleteUser } from '../../services/adminService';
import Toast from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

const ROLES = {
  ADMIN: 1,
  STAFF: 2,
  USER: 3,
  PREMIUM: 4
};

const ROLE_NAMES = {
  1: 'Admin',
  2: 'Staff',
  3: 'User',
  4: 'Premium'
};

export default function AdminUsers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState({
    role: '',
    active: '',
    search: ''
  });

  useEffect(() => {
    // Check if user is admin (role_id = 1)
    if (!isAuthenticated || !user || user.role !== 1) {
      navigate('/');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, navigate, currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };
      
      const response = await getUsers(params);
      setUsers(response.users);
      setTotalPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || t('admin.users.errorLoad') });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentActive) => {
    const action = currentActive ? 'suspend' : 'activate';
    
    setConfirmDialog({
      title: currentActive ? t('confirmDialog.suspendUser.title') : t('confirmDialog.activateUser.title'),
      message: currentActive ? t('confirmDialog.suspendUser.message') : t('confirmDialog.activateUser.message'),
      confirmText: currentActive ? t('confirmDialog.suspendUser.confirmText') : t('confirmDialog.activateUser.confirmText'),
      cancelText: t('confirmDialog.suspendUser.cancelText'),
      type: currentActive ? 'warning' : 'danger',
      onConfirm: () => confirmStatusToggle(userId, currentActive)
    });
  };

  const confirmStatusToggle = async (userId, currentActive) => {
    try {
      await updateUserStatus(userId, currentActive ? 0 : 1);
      const successMsg = currentActive
        ? t('admin.users.successSuspend')
        : t('admin.users.successActivate');
      setToast({ type: 'success', message: successMsg });
      fetchUsers();
    } catch (error) {
      const errorMsg = currentActive
        ? t('admin.users.errorSuspend')
        : t('admin.users.errorActivate');
      setToast({ type: 'error', message: error.response?.data?.message || errorMsg });
    }
  };

  const handleRoleChange = async (userId, newRoleId) => {
    const roleName = t(`admin.users.${ROLE_NAMES[newRoleId].toLowerCase()}`, ROLE_NAMES[newRoleId]);
    
    setConfirmDialog({
      title: t('confirmDialog.changeRole.title'),
      message: t('confirmDialog.changeRole.message', { roleName }),
      confirmText: t('confirmDialog.changeRole.confirmText'),
      cancelText: t('confirmDialog.changeRole.cancelText'),
      type: 'warning',
      onConfirm: () => confirmRoleChange(userId, newRoleId)
    });
  };

  const confirmRoleChange = async (userId, newRoleId) => {
    try {
      await updateUserRole(userId, parseInt(newRoleId));
      setToast({ type: 'success', message: t('admin.users.successRoleUpdate') });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || t('admin.users.errorRoleUpdate') });
    }
  };

  const handleDeleteUser = async (userId) => {
    setConfirmDialog({
      title: t('confirmDialog.deleteUser.title'),
      message: t('confirmDialog.deleteUser.message'),
      confirmText: t('confirmDialog.deleteUser.confirmText'),
      cancelText: t('confirmDialog.deleteUser.cancelText'),
      type: 'danger',
      onConfirm: () => confirmDeleteUser(userId)
    });
  };

  const confirmDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setToast({ type: 'success', message: t('admin.users.successDelete') });
      fetchUsers();
    } catch (error) {
      setToast({ type: 'error', message: error.response?.data?.message || t('admin.users.errorDelete') });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('admin.users.title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('admin.users.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.users.search')}
            </label>
            <input
              type="text"
              placeholder={t('admin.users.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.users.filterByRole')}
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('admin.users.allRoles')}</option>
              <option value="1">{t('admin.users.admin')}</option>
              <option value="2">{t('admin.users.staff')}</option>
              <option value="3">{t('admin.users.user')}</option>
              <option value="4">{t('admin.users.premium')}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.users.filterByStatus')}
            </label>
            <select
              value={filters.active}
              onChange={(e) => handleFilterChange('active', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('admin.users.allStatuses')}</option>
              <option value="1">{t('admin.users.active')}</option>
              <option value="0">{t('admin.users.suspended')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.user')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.lastLogin')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.users.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className={u.active ? '' : 'bg-red-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{u.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role_id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      disabled={u.id === user.id}
                      className={`text-sm border rounded px-2 py-1 ${
                        u.id === user.id ? 'bg-gray-100 cursor-not-allowed' : ''
                      } ${
                        u.role_id === 1 ? 'text-red-600 border-red-300' :
                        u.role_id === 2 ? 'text-blue-600 border-blue-300' :
                        u.role_id === 4 ? 'text-purple-600 border-purple-300' :
                        'text-green-600 border-green-300'
                      }`}
                    >
                      <option value="1">{t('admin.users.admin')}</option>
                      <option value="2">{t('admin.users.staff')}</option>
                      <option value="3">{t('admin.users.user')}</option>
                      <option value="4">{t('admin.users.premium')}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {u.active ? t('admin.users.active') : t('admin.users.suspended')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {u.last_login ? new Date(u.last_login).toLocaleDateString() : t('admin.users.never')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusToggle(u.id, u.active)}
                        disabled={u.id === user.id}
                        className={`${
                          u.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        } ${u.id === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={u.active ? t('admin.users.suspend') : t('admin.users.activate')}
                      >
                        {u.active ? t('admin.users.suspend') : t('admin.users.activate')}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === user.id}
                        className={`text-red-600 hover:text-red-900 ${
                          u.id === user.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={t('admin.users.delete')}
                      >
                        {t('admin.users.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {t('admin.users.pagination.previous')}
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {t('admin.users.pagination.next')}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {t('admin.users.pagination.showing')} <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> {t('admin.users.pagination.to')}{' '}
                <span className="font-medium">{Math.min(currentPage * 10, totalUsers)}</span> {t('admin.users.pagination.of')}{' '}
                <span className="font-medium">{totalUsers}</span> {t('admin.users.pagination.results')}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t('admin.users.pagination.previous')}
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {t('admin.users.pagination.next')}
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
