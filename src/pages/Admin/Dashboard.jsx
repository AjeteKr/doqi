import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getUserStats, getRecentActivity } from '../../services/adminService';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    suspended_users: 0,
    admin_count: 0,
    staff_count: 0,
    user_count: 0,
    new_today: 0,
    active_today: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin (role_id = 1)
    if (!isAuthenticated || !user || user.role !== 1) {
      navigate('/');
      return;
    }

    // Fetch admin statistics and activity
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch stats and activity in parallel
        const [userStats, recentActivity] = await Promise.all([
          getUserStats(),
          getRecentActivity(10).catch(() => []) // Fallback to empty array if activity fails
        ]);
        
        setStats({
          ...userStats,
          totalOrders: 0, // TODO: Implement orders API
          totalProducts: 0, // TODO: Implement products API
          revenue: 0 // TODO: Implement revenue API
        });
        setActivities(Array.isArray(recentActivity) ? recentActivity : []);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('admin.dashboard.welcome')}, {user?.name || user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('admin.dashboard.totalUsers')}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_users}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.new_today} {t('admin.dashboard.today')}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('admin.dashboard.activeUsers')}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active_users}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.suspended_users} {t('admin.dashboard.suspended')}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Admin Count */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('admin.dashboard.admins')}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.admin_count}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.staff_count} {t('admin.dashboard.staff')}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Today */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {t('admin.dashboard.activeToday')}
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active_today}</p>
              <p className="text-xs text-gray-500 mt-1">{t('admin.dashboard.loggedInToday')}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('admin.dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/products')}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{t('admin.dashboard.addProduct')}</span>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{t('admin.dashboard.manageUsers')}</span>
            </button>
          </div>
        </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('admin.dashboard.recentActivity')}
        </h2>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('admin.dashboard.noActivity')}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const getActivityIcon = () => {
                if (activity.type === 'user') {
                  return (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  );
                } else if (activity.type === 'contact') {
                  return (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  );
                } else {
                  return (
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  );
                }
              };

              const getActivityText = () => {
                if (activity.type === 'user') {
                  return t('admin.dashboard.activityUserRegistered', { name: activity.name || activity.email });
                } else if (activity.type === 'contact') {
                  return t('admin.dashboard.activityContactMessage', { name: activity.name });
                } else {
                  return t('admin.dashboard.activityJobApplication', { name: activity.name });
                }
              };

              const timeAgo = new Date(activity.created_at).toLocaleString();

              return (
                <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  {getActivityIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityText()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
