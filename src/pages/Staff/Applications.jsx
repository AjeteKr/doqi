import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllApplications, updateApplicationStatus, getApplicationStats, downloadCV } from '../../services/applicationService';
import Toast from '../../components/Toast';

function Applications() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    job_id: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [statusNotes, setStatusNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const data = await getApplicationStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') {
          activeFilters[key] = filters[key];
        }
      });
      
      const data = await getAllApplications(1, 100, activeFilters);
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showToast(t('staff.applications.error.fetchFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setStatusNotes('');
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedApplication(null);
    setStatusNotes('');
  };

  const handleDownloadCV = async (applicationId, applicantName) => {
    try {
      const blob = await downloadCV(applicationId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${applicantName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(t('staff.applications.success.cvDownloaded'), 'success');
    } catch (error) {
      console.error('Error downloading CV:', error);
      showToast(t('staff.applications.error.cvDownloadFailed'), 'error');
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedApplication) return;
    
    try {
      setUpdatingStatus(true);
      await updateApplicationStatus(selectedApplication.id, status, statusNotes);
      showToast(t('staff.applications.success.statusUpdated'), 'success');
      handleCloseModal();
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      showToast(t('staff.applications.error.statusUpdateFailed'), 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('staff.applications.title')}</h1>
        <p className="text-gray-600 mt-2">{t('staff.applications.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{t('staff.applications.stats.total')}</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{t('staff.applications.stats.pending')}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{t('staff.applications.stats.reviewed')}</p>
          <p className="text-2xl font-bold text-blue-600">{stats.reviewed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{t('staff.applications.stats.accepted')}</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">{t('staff.applications.stats.rejected')}</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('staff.applications.filter.allStatus')}</option>
            <option value="pending">{t('staff.applications.status.pending')}</option>
            <option value="reviewed">{t('staff.applications.status.reviewed')}</option>
            <option value="accepted">{t('staff.applications.status.accepted')}</option>
            <option value="rejected">{t('staff.applications.status.rejected')}</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.applicant')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.job')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.contact')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.appliedDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.applications.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('staff.applications.loading')}
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    {t('staff.applications.noApplications')}
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.job_title}</div>
                      <div className="text-xs text-gray-500">{application.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.email}</div>
                      <div className="text-xs text-gray-500">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(application.status)}`}>
                        {t(`staff.applications.status.${application.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(application)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('staff.applications.view')}
                      </button>
                      <button
                        onClick={() => handleDownloadCV(application.id, application.full_name)}
                        className="text-green-600 hover:text-green-900"
                      >
                        {t('staff.applications.downloadCV')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('staff.applications.applicationDetails')}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Applicant Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('staff.applications.applicantInfo')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('staff.applications.table.applicant')}</p>
                      <p className="font-medium">{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('careers.application.email')}</p>
                      <p className="font-medium">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('careers.application.phone')}</p>
                      <p className="font-medium">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('staff.applications.table.appliedDate')}</p>
                      <p className="font-medium">{new Date(selectedApplication.applied_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Job Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">{t('staff.applications.jobInfo')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">{t('staff.applications.table.job')}</p>
                      <p className="font-medium">{selectedApplication.job_title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{t('staff.jobs.form.department')}</p>
                      <p className="font-medium">{selectedApplication.department}</p>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                {selectedApplication.cover_letter && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('careers.application.coverLetter')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{t('staff.applications.updateStatus')}</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('staff.applications.currentStatus')}
                      </label>
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadgeColor(selectedApplication.status)}`}>
                        {t(`staff.applications.status.${selectedApplication.status}`)}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('staff.applications.notes')}
                      </label>
                      <textarea
                        value={statusNotes}
                        onChange={(e) => setStatusNotes(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={t('staff.applications.notesPlaceholder')}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusUpdate('reviewed')}
                        disabled={updatingStatus || selectedApplication.status === 'reviewed'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('staff.applications.markReviewed')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('accepted')}
                        disabled={updatingStatus || selectedApplication.status === 'accepted'}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('staff.applications.markAccepted')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('rejected')}
                        disabled={updatingStatus || selectedApplication.status === 'rejected'}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('staff.applications.markRejected')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                {selectedApplication.status_notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{t('staff.applications.statusHistory')}</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedApplication.status_notes}</p>
                      {selectedApplication.reviewed_at && (
                        <p className="text-xs text-gray-500 mt-2">
                          {t('staff.applications.reviewedAt')}: {new Date(selectedApplication.reviewed_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </div>
  );
}

export default Applications;
