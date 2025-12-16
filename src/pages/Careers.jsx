import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicJobs } from '../services/jobService';
import { applyForJob, checkIfApplied } from '../services/applicationService';
import Toast from '../components/Toast';

function Careers() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    cv_file: null
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [submitting, setSubmitting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      setApplicationData(prev => ({
        ...prev,
        full_name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && jobs.length > 0) {
      checkAppliedJobs();
    }
  }, [isAuthenticated, jobs]);

  const checkAppliedJobs = async () => {
    const appliedStatus = {};
    for (const job of jobs) {
      const result = await checkIfApplied(job.id);
      appliedStatus[job.id] = result.hasApplied;
    }
    setAppliedJobs(appliedStatus);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getPublicJobs(1, 50, { is_active: 'true' });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showToast(t('careers.error.fetchFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      showToast(t('careers.error.loginRequired'), 'error');
      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        navigate('/login', { state: { from: '/careers' } });
      }, 1500);
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleCloseModal = () => {
    setShowApplicationModal(false);
    setSelectedJob(null);
    setApplicationData({
      full_name: user?.name || '',
      email: user?.email || '',
      phone: '',
      cover_letter: '',
      cv_file: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showToast(t('careers.error.pdfOnly'), 'error');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast(t('careers.error.fileTooLarge'), 'error');
        e.target.value = '';
        return;
      }
      setApplicationData(prev => ({
        ...prev,
        cv_file: file
      }));
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!applicationData.cv_file) {
      showToast(t('careers.error.cvRequired'), 'error');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('job_id', selectedJob.id);
      formData.append('full_name', applicationData.full_name);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('cover_letter', applicationData.cover_letter);
      formData.append('cv', applicationData.cv_file);

      await applyForJob(formData);
      showToast(t('careers.success.applied'), 'success');
      
      // Update applied status for this job
      setAppliedJobs(prev => ({ ...prev, [selectedJob.id]: true }));
      
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting application:', error);
      const backendMessage = error.response?.data?.message;
      
      // Map backend messages to translation keys
      if (backendMessage === 'You have already applied for this position') {
        showToast(t('careers.error.alreadyApplied'), 'error');
      } else if (backendMessage === 'CV file is required') {
        showToast(t('careers.error.cvRequired'), 'error');
      } else if (backendMessage) {
        showToast(backendMessage, 'error');
      } else {
        showToast(t('careers.error.submitFailed'), 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('careers.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 leading-relaxed">
              {t('careers.hero.subtitle')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-lg">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <span className="font-medium">{t('careers.hero.feature1')}</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">{t('careers.hero.feature2')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Open Positions Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('careers.openPositions.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('careers.openPositions.subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-600 border-t-transparent"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12 shadow-sm border border-gray-100">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('careers.openPositions.noJobs')}
              </h3>
              <p className="text-lg text-gray-600">
                {t('careers.openPositions.checkBack')}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {jobs.map((job) => (
              <div key={job.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-200 hover:-translate-y-1">
                <div className="p-8">
                  {/* Job Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">{job.department || t('careers.job.noDepartment')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{job.location || 'Prishtina'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-3 mb-6 bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">{t('careers.job.type')}</span>
                      <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                        {job.employment_type}
                      </span>
                    </div>
                    {job.experience_level && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{t('careers.job.experience')}</span>
                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{job.experience_level}</span>
                      </div>
                    )}
                    {job.salary_range && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{t('careers.job.salary')}</span>
                        <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">{job.salary_range}</span>
                      </div>
                    )}
                    {job.deadline && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{t('careers.job.deadline')}</span>
                        <span className="font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                          {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description Preview */}
                  {job.description && (
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  {/* Apply Button */}
                  {appliedJobs[job.id] ? (
                    <div className="w-full bg-green-50 border-2 border-green-500 text-green-700 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('careers.job.alreadyApplied') || 'Already Applied'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3.5 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{t('careers.job.applyNow')}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('careers.application.title')}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedJob.title}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('careers.application.fullName')} *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={applicationData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('careers.application.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('careers.application.phone')} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={applicationData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('careers.application.cv')} * (PDF, max 5MB)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  {applicationData.cv_file && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {applicationData.cv_file.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('careers.application.coverLetter')}
                  </label>
                  <textarea
                    name="cover_letter"
                    value={applicationData.cover_letter}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder={t('careers.application.coverLetterPlaceholder')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={submitting}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {t('careers.application.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>{t('careers.application.submitting')}</span>
                      </>
                    ) : (
                      <span>{t('careers.application.submit')}</span>
                    )}
                  </button>
                </div>
              </form>
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

export default Careers;
