import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import contactService from '../../services/contactService'
import Toast from '../../components/Toast'
import ConfirmDialog from '../../components/ConfirmDialog'
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const Messages = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, solved: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, solved
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })
  const [confirmDialog, setConfirmDialog] = useState({ show: false, title: '', message: '', onConfirm: null })

  useEffect(() => {
    loadMessages()
    loadStats()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, filter, searchTerm])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await contactService.getAllMessages()
      setMessages(response.data)
    } catch (error) {
      console.error('Error loading messages:', error)
      showToast(t('admin.messages.errors.loadFailed'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await contactService.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const filterMessages = () => {
    let filtered = [...messages]

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(msg => msg.status === filter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(msg =>
        msg.name.toLowerCase().includes(term) ||
        msg.email.toLowerCase().includes(term) ||
        msg.subject.toLowerCase().includes(term) ||
        msg.message.toLowerCase().includes(term) ||
        (msg.company && msg.company.toLowerCase().includes(term))
      )
    }

    setFilteredMessages(filtered)
  }

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
  }

  const handleStatusChange = async (messageId, newStatus) => {
    const message = messages.find(m => m.id === messageId)
    
    setConfirmDialog({
      show: true,
      title: newStatus === 'solved' 
        ? t('admin.messages.confirmSolve.title') 
        : t('admin.messages.confirmPending.title'),
      message: newStatus === 'solved'
        ? t('admin.messages.confirmSolve.message')
        : t('admin.messages.confirmPending.message'),
      onConfirm: async () => {
        try {
          await contactService.updateStatus(messageId, newStatus)
          await loadMessages()
          await loadStats()
          showToast(
            newStatus === 'solved' 
              ? t('admin.messages.success.markedSolved') 
              : t('admin.messages.success.markedPending'),
            'success'
          )
          if (selectedMessage?.id === messageId) {
            const updated = await contactService.getMessageById(messageId)
            setSelectedMessage(updated.data)
          }
        } catch (error) {
          console.error('Error updating status:', error)
          showToast(t('admin.messages.errors.updateFailed'), 'error')
        }
      }
    })
  }

  const handleDelete = (messageId) => {
    setConfirmDialog({
      show: true,
      title: t('admin.messages.confirmDelete.title'),
      message: t('admin.messages.confirmDelete.message'),
      onConfirm: async () => {
        try {
          await contactService.deleteMessage(messageId)
          await loadMessages()
          await loadStats()
          showToast(t('admin.messages.success.deleted'), 'success')
          if (selectedMessage?.id === messageId) {
            setSelectedMessage(null)
          }
        } catch (error) {
          console.error('Error deleting message:', error)
          showToast(t('admin.messages.errors.deleteFailed'), 'error')
        }
      }
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.show}
        onClose={() => setConfirmDialog({ ...confirmDialog, show: false })}
        onConfirm={() => {
          confirmDialog.onConfirm()
          setConfirmDialog({ ...confirmDialog, show: false })
        }}
        title={confirmDialog.title}
        message={confirmDialog.message}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('admin.messages.title')}
        </h1>
        <p className="text-gray-600">
          {t('admin.messages.subtitle')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('admin.messages.stats.total')}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <EnvelopeIcon className="w-12 h-12 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('admin.messages.stats.pending')}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <EnvelopeOpenIcon className="w-12 h-12 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {t('admin.messages.stats.solved')}
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.solved}</p>
            </div>
            <CheckCircleIcon className="w-12 h-12 text-green-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('admin.messages.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.messages.filter.all')}
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.messages.filter.pending')}
            </button>
            <button
              onClick={() => setFilter('solved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'solved'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('admin.messages.filter.solved')}
            </button>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('admin.messages.loading')}</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <EnvelopeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('admin.messages.noMessages')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.messages.table.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.messages.table.sender')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.messages.table.subject')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.messages.table.date')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.messages.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.status === 'solved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {message.status === 'solved'
                          ? t('admin.messages.status.solved')
                          : t('admin.messages.status.pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{message.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {message.status === 'pending' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(message.id, 'solved')
                            }}
                            className="text-green-600 hover:text-green-900"
                            title={t('admin.messages.actions.markSolved')}
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStatusChange(message.id, 'pending')
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                            title={t('admin.messages.actions.markPending')}
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(message.id)
                          }}
                          className="text-red-600 hover:text-red-900"
                          title={t('admin.messages.actions.delete')}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedMessage.status === 'solved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedMessage.status === 'solved'
                      ? t('admin.messages.status.solved')
                      : t('admin.messages.status.pending')}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t('admin.messages.detail.name')}
                    </p>
                    <p className="text-base text-gray-900">{selectedMessage.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t('admin.messages.detail.email')}
                    </p>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-base text-red-600 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('admin.messages.detail.phone')}
                      </p>
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-base text-red-600 hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedMessage.company && (
                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t('admin.messages.detail.company')}
                      </p>
                      <p className="text-base text-gray-900">{selectedMessage.company}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t('admin.messages.detail.date')}
                    </p>
                    <p className="text-base text-gray-900">
                      {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t('admin.messages.detail.message')}
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Solved Info */}
              {selectedMessage.status === 'solved' && selectedMessage.solved_by_name && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    {t('admin.messages.detail.solvedBy')}
                  </p>
                  <p className="text-sm text-green-700">
                    {selectedMessage.solved_by_name} ({selectedMessage.solved_by_email})
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatDate(selectedMessage.solved_at)}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedMessage.status === 'pending' ? (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'solved')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    {t('admin.messages.actions.markSolved')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, 'pending')}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    {t('admin.messages.actions.markPending')}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  {t('admin.messages.actions.delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Messages
