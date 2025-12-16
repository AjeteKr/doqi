import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAllJobs, createJob, updateJob, deleteJob, getJobStats } from '../../services/jobService';
import Toast from '../../components/Toast';
import ConfirmDialog from '../../components/ConfirmDialog';

function Jobs() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total_jobs: 0, active_jobs: 0, total_departments: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    is_active: '',
    department: '',
    employment_type: '',
    experience_level: ''
  });
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: '',
    description: '',
    responsibilities: '',
    requirements: '',
    qualifications: '',
    benefits: '',
    salary_range: '',
    experience_level: '',
    deadline: '',
    is_active: true
  });
  
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ show: false, jobId: null });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const data = await getJobStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '') {
          activeFilters[key] = filters[key];
        }
      });
      
      if (searchTerm) {
        activeFilters.search = searchTerm;
      }
      
      const data = await getAllJobs(1, 100, activeFilters);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      showToast(t('staff.jobs.error.fetchFailed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenModal = (job = null) => {
    if (job) {
      // Edit mode
      setEditingJob(job);
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        employment_type: job.employment_type || '',
        description: job.description || '',
        responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
        qualifications: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : '',
        benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : '',
        salary_range: job.salary_range || '',
        experience_level: job.experience_level || '',
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
        is_active: job.is_active !== undefined ? job.is_active : true
      });
    } else {
      // Create mode
      setEditingJob(null);
      setFormData({
        title: '',
        department: '',
        location: '',
        employment_type: '',
        description: '',
        responsibilities: '',
        requirements: '',
        qualifications: '',
        benefits: '',
        salary_range: '',
        experience_level: '',
        deadline: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Convert textarea strings to arrays
      const jobData = {
        ...formData,
        responsibilities: formData.responsibilities.split('\n').filter(item => item.trim()),
        requirements: formData.requirements.split('\n').filter(item => item.trim()),
        qualifications: formData.qualifications.split('\n').filter(item => item.trim()),
        benefits: formData.benefits.split('\n').filter(item => item.trim())
      };
      
      if (editingJob) {
        await updateJob(editingJob.id, jobData);
        showToast(t('staff.jobs.success.updated'), 'success');
      } else {
        await createJob(jobData);
        showToast(t('staff.jobs.success.created'), 'success');
      }
      
      handleCloseModal();
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error('Error saving job:', error);
      showToast(t('staff.jobs.error.saveFailed'), 'error');
    }
  };

  const handleDeleteClick = (jobId) => {
    setConfirmDialog({ show: true, jobId });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteJob(confirmDialog.jobId);
      showToast(t('staff.jobs.success.deleted'), 'success');
      setConfirmDialog({ show: false, jobId: null });
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error('Error deleting job:', error);
      showToast(t('staff.jobs.error.deleteFailed'), 'error');
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ show: false, jobId: null });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{t('staff.jobs.title')}</h1>
        <p className="text-gray-600 mt-2">{t('staff.jobs.subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('staff.jobs.stats.total')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_jobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('staff.jobs.stats.active')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.active_jobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{t('staff.jobs.stats.departments')}</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_departments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder={t('staff.jobs.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filters.is_active}
            onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('staff.jobs.filter.allStatus')}</option>
            <option value="true">{t('staff.jobs.filter.active')}</option>
            <option value="false">{t('staff.jobs.filter.inactive')}</option>
          </select>
          
          <select
            value={filters.employment_type}
            onChange={(e) => setFilters(prev => ({ ...prev, employment_type: e.target.value }))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{t('staff.jobs.filter.allTypes')}</option>
            <option value="Full-time">{t('staff.jobs.employmentType.fullTime')}</option>
            <option value="Part-time">{t('staff.jobs.employmentType.partTime')}</option>
            <option value="Contract">{t('staff.jobs.employmentType.contract')}</option>
            <option value="Internship">{t('staff.jobs.employmentType.internship')}</option>
          </select>
          
          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {t('staff.jobs.addNew')}
          </button>
        </form>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.department')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.type')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.deadline')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('staff.jobs.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {t('staff.jobs.loading')}
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {t('staff.jobs.noJobs')}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{job.employment_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.is_active ? t('staff.jobs.status.active') : t('staff.jobs.status.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenModal(job)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {t('staff.jobs.edit')}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('staff.jobs.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingJob ? t('staff.jobs.modal.editTitle') : t('staff.jobs.modal.createTitle')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.title')} *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.department')}
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.location')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.employmentType')}
                    </label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('staff.jobs.form.selectType')}</option>
                      <option value="Full-time">{t('staff.jobs.employmentType.fullTime')}</option>
                      <option value="Part-time">{t('staff.jobs.employmentType.partTime')}</option>
                      <option value="Contract">{t('staff.jobs.employmentType.contract')}</option>
                      <option value="Internship">{t('staff.jobs.employmentType.internship')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.experienceLevel')}
                    </label>
                    <select
                      name="experience_level"
                      value={formData.experience_level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">{t('staff.jobs.form.selectLevel')}</option>
                      <option value="Entry Level">{t('staff.jobs.experienceLevel.entryLevel')}</option>
                      <option value="Mid Level">{t('staff.jobs.experienceLevel.midLevel')}</option>
                      <option value="Senior Level">{t('staff.jobs.experienceLevel.seniorLevel')}</option>
                      <option value="Lead">{t('staff.jobs.experienceLevel.lead')}</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.deadline')}
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('staff.jobs.form.salaryRange')}
                    </label>
                    <input
                      type="text"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleInputChange}
                      placeholder={t('staff.jobs.form.salaryRangePlaceholder')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      {t('staff.jobs.form.isActive')}
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff.jobs.form.description')}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff.jobs.form.responsibilities')}
                  </label>
                  <textarea
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder={t('staff.jobs.form.onePerLine')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff.jobs.form.requirements')}
                  </label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder={t('staff.jobs.form.onePerLine')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff.jobs.form.qualifications')}
                  </label>
                  <textarea
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder={t('staff.jobs.form.onePerLine')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('staff.jobs.form.benefits')}
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder={t('staff.jobs.form.onePerLine')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {t('staff.jobs.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingJob ? t('staff.jobs.update') : t('staff.jobs.create')}
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

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <ConfirmDialog
          title={t('staff.jobs.confirmDelete.title')}
          message={t('staff.jobs.confirmDelete.message')}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default Jobs;
