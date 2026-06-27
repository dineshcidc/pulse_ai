import { useState } from 'react'
import { Upload, FileText, Eye, Trash2, RotateCcw, FolderOpen, ChevronDown, Plus, X, File, Folder } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

type UploadStep = 'initial' | 'upload'
type OrganizationType = 'tagged' | 'individual' | null

interface Policy {
  id: string
  name: string
  category: string
  uploadDate: string
  fileSize: string
  isFolder?: boolean
  policies?: Policy[]
  status?: 'published' | 'draft'
}

const POLICY_DATA: Policy[] = [
  { id: 'p1', name: 'CC_NDA', category: 'General', uploadDate: '2026-02-15', fileSize: '2.4 MB', isFolder: false, status: 'published' },
  { id: 'p2', name: 'Employee Agreement', category: 'General', uploadDate: '2026-01-20', fileSize: '1.8 MB', isFolder: false, status: 'published' },
  {
    id: 'p3',
    name: 'CIDC Policy Documents',
    category: 'Folder',
    uploadDate: '2026-03-10',
    fileSize: '—',
    isFolder: true,
    status: 'published',
    policies: [
      { id: 'p3-1', name: 'CIDC Employee Handbook', category: 'CIDC', uploadDate: '2026-03-10', fileSize: '5.2 MB', isFolder: false, status: 'published' },
      { id: 'p3-2', name: 'CIDC IT Policy', category: 'CIDC', uploadDate: '2026-03-08', fileSize: '3.1 MB', isFolder: false, status: 'published' },
      { id: 'p3-3', name: 'CIDC Leave Policy', category: 'CIDC', uploadDate: '2026-02-28', fileSize: '2.8 MB', isFolder: false, status: 'published' },
      { id: 'p3-4', name: 'CIDC POSH Policy', category: 'CIDC', uploadDate: '2026-02-15', fileSize: '4.5 MB', isFolder: false, status: 'published' },
      { id: 'p3-5', name: 'CIDC General Policies & Guidelines', category: 'CIDC', uploadDate: '2026-02-01', fileSize: '6.3 MB', isFolder: false, status: 'published' },
    ]
  },
  { id: 'p4', name: 'Remote Work Policy', category: 'General', uploadDate: '2026-06-25', fileSize: '1.5 MB', isFolder: false, status: 'draft' },
  { id: 'p5', name: 'Data Security Guidelines', category: 'General', uploadDate: '2026-06-26', fileSize: '3.2 MB', isFolder: false, status: 'draft' },
]

export default function PolicySetupPage() {
  const [policies, setPolicies] = useState<Policy[]>(POLICY_DATA)
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['p3'])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadStep, setUploadStep] = useState<UploadStep>('initial')
  const [organizationType, setOrganizationType] = useState<OrganizationType>(null)
  const [policyTagName, setPolicyTagName] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState<'published' | 'draft'>('published')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  const filteredPolicies = policies.filter(p => p.status === activeTab)
  const publishedCount = policies.filter(p => p.status === 'published').length
  const draftCount = policies.filter(p => p.status === 'draft').length

  const handleDelete = (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id))
    setExpandedFolders(prev => prev.filter(f => f !== id))
    setDeleteConfirm(null)
  }

  const handlePublishDraft = (id: string) => {
    setPolicies(policies.map(p => p.id === id ? { ...p, status: 'published' } : p))
  }

  const renderPolicyItem = (policy: Policy, level: number = 0) => (
    <div key={policy.id}>
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: policy.isFolder ? 'rgba(99,102,241,0.04)' : '#fff',
        marginLeft: level > 0 ? 40 : 0,
      }}>
        {policy.isFolder && (
          <button
            onClick={() => toggleFolder(policy.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', color: C.navy, flexShrink: 0,
            }}
          >
            <ChevronDown size={18} style={{
              transform: expandedFolders.includes(policy.id) ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }} />
          </button>
        )}
        {!policy.isFolder && level > 0 && <div style={{ width: 18, flexShrink: 0 }} />}

        {policy.isFolder ? (
          <FolderOpen size={18} style={{ color: '#B8860B', flexShrink: 0 }} />
        ) : (
          <FileText size={18} style={{ color: '#5B5FDE', flexShrink: 0 }} />
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: policy.isFolder ? 14 : 13.5,
            fontWeight: policy.isFolder ? 700 : 600,
            color: policy.isFolder ? '#B8860B' : C.navy,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {policy.name}
          </div>
          {!policy.isFolder && (
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
              {policy.uploadDate}
            </div>
          )}
        </div>

        {policy.isFolder && (
          <button
            title="Add policy to folder"
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EAF2',
              background: '#fff', color: '#8B90A7', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8EAF2' }}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        )}

        {activeTab === 'draft' && !policy.isFolder && (
          <button
            onClick={() => handlePublishDraft(policy.id)}
            title="Publish draft"
            style={{
              height: 36, padding: '0 16px', borderRadius: 8, border: 'none',
              background: 'rgba(99,102,241,0.10)', color: '#6366F1', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              transition: 'all 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.10)'}
          >
            Publish
          </button>
        )}

        {!policy.isFolder && (
          <>
            <button
              title="View policy"
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EAF2',
                background: '#fff', color: '#8B90A7', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#C8CCE0' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8EAF2' }}
            >
              <Eye size={14} strokeWidth={2} />
            </button>

            <button
              title="Replace policy"
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EAF2',
                background: '#fff', color: '#8B90A7', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#C8CCE0' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8EAF2' }}
            >
              <RotateCcw size={14} strokeWidth={2} />
            </button>

            <button
              onClick={() => handleDelete(policy.id)}
              title="Delete policy"
              style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EAF2',
                background: '#fff', color: '#E84855', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8EAF2' }}
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </>
        )}
      </div>

      {policy.isFolder && expandedFolders.includes(policy.id) && policy.policies && (
        <>{policy.policies.map(p => renderPolicyItem(p, level + 1))}</>
      )}
    </div>
  )

  const handleCloseModal = () => {
    setShowUploadModal(false)
    setUploadStep('initial')
    setOrganizationType(null)
    setPolicyTagName('')
    setUploadedFiles([])
  }

  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      handleCloseModal()
      setIsPublishing(false)
    }, 1200)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 20,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 4, letterSpacing: '-0.3px' }}>
            Policy Setup
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Manage company policies and documents
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            height: 42, padding: '0 18px', borderRadius: 11, border: 'none',
            background: '#1C2035', color: '#fff', fontSize: 13.5, fontWeight: 700,
            cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#2A3050'}
          onMouseLeave={e => e.currentTarget.style.background = '#1C2035'}
        >
          <Upload size={16} strokeWidth={2} /> Upload Policy
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {(['published', 'draft'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
              color: activeTab === tab ? '#6366F1' : C.muted,
              borderBottom: activeTab === tab ? '2px solid #6366F1' : 'none',
              marginBottom: -1, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (activeTab !== tab) (e.currentTarget as HTMLElement).style.color = C.navy }}
            onMouseLeave={e => { if (activeTab !== tab) (e.currentTarget as HTMLElement).style.color = C.muted }}
          >
            {tab === 'published' ? `Published (${publishedCount})` : `Draft (${draftCount})`}
          </button>
        ))}
      </div>

      {/* Policy List */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
        overflow: 'hidden',
      }}>
        {policies.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 60, minHeight: 300,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: C.hover,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <FileText size={24} style={{ color: '#B0B4C8' }} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
              No policies yet
            </div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
              Start by uploading your first company policy document
            </div>
            <button
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                height: 40, padding: '0 16px', borderRadius: 10, border: 'none',
                background: '#1C2035', color: '#fff', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2A3050'}
              onMouseLeave={e => e.currentTarget.style.background = '#1C2035'}
            >
              <Upload size={14} strokeWidth={2.5} /> Upload First Policy
            </button>
          </div>
        ) : (
          <div>
            {filteredPolicies.map(policy => renderPolicyItem(policy))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400,
            padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: 'rgba(232,72,85,0.10)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              flexShrink: 0,
            }}>
              <Trash2 size={28} style={{ color: '#E84855' }} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8, margin: '0 0 8px 0' }}>
              Delete Policy?
            </h3>

            <p style={{ fontSize: 13.5, color: C.muted, marginBottom: 24, lineHeight: 1.5, margin: '0 0 24px 0' }}>
              This action cannot be undone. The policy document will be permanently deleted from the system.
            </p>

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, height: 40, borderRadius: 10, border: `1px solid ${C.border}`,
                  background: '#fff', color: C.navy, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.hover }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirm)}
                style={{
                  flex: 1, height: 40, borderRadius: 10, border: 'none',
                  background: '#E84855', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#C0202E'}
                onMouseLeave={e => e.currentTarget.style.background = '#E84855'}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Policy Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            background: '#fff', borderRadius: 20, maxWidth: 500, width: '100%',
            maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 28px', borderBottom: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>
                Upload Policy Document
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  width: 36, height: 36, borderRadius: 8, background: C.hover, border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8EAF2'}
                onMouseLeave={e => e.currentTarget.style.background = C.hover}
              >
                <X size={18} style={{ color: C.muted }} />
              </button>
            </div>

            {/* Step 1: Choose Organization Type */}
            {uploadStep === 'initial' && (
              <div style={{ padding: '28px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 20 }}>
                  How would you like to organize this policy?
                </div>

                {/* Tagged Option */}
                <div
                  onClick={() => { setOrganizationType('tagged'); setUploadStep('upload') }}
                  style={{
                    padding: 16, marginBottom: 12, borderRadius: 12, border: `1px solid ${C.border}`,
                    cursor: 'pointer', transition: 'all 0.15s', background: '#fff',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#F5F6FF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Folder size={20} style={{ color: '#B8860B' }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                      Create a Policy Group
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginLeft: 32 }}>
                    Organize related documents under a tag (e.g., CIDC Policy Documents, HR Policies)
                  </div>
                </div>

                {/* Individual Option */}
                <div
                  onClick={() => { setOrganizationType('individual'); setUploadStep('upload') }}
                  style={{
                    padding: 16, borderRadius: 12, border: `1px solid ${C.border}`,
                    cursor: 'pointer', transition: 'all 0.15s', background: '#fff',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#F5F6FF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <File size={20} style={{ color: '#5B5FDE' }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                      Upload Individual Documents
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginLeft: 32 }}>
                    Upload standalone policy documents without grouping
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Upload Files */}
            {uploadStep === 'upload' && (
              <div style={{ padding: '28px' }}>
                {/* Back Button */}
                <button
                  onClick={() => { setUploadStep('initial'); setOrganizationType(null) }}
                  style={{
                    fontSize: 13, color: '#6366F1', background: 'rgba(99,102,241,0.08)', border: 'none',
                    cursor: 'pointer', marginBottom: 20, padding: '8px 12px', fontFamily: 'inherit', fontWeight: 600,
                    borderRadius: 8, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
                >
                  ← Back
                </button>

                {/* Tag Name Input */}
                {organizationType === 'tagged' && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
                      Policy Group Name *
                    </label>
                    <input
                      value={policyTagName}
                      onChange={e => setPolicyTagName(e.target.value)}
                      placeholder="e.g., CIDC Policy Documents, HR Policies"
                      style={{
                        width: '100%', height: 40, padding: '0 12px', borderRadius: 10,
                        border: `1px solid ${C.border}`, fontSize: 13, color: C.navy,
                        fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#6366F1'}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                )}

                {/* File Upload Area */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>
                    Select Documents *
                  </label>
                  <div
                    style={{
                      border: `2px dashed ${C.border}`, borderRadius: 12, padding: 24,
                      textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s',
                      background: '#FAFBFE',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#F5F6FF' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#FAFBFE' }}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload size={32} style={{ color: '#6366F1', margin: '0 auto 12px' }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                      Click to upload or drag and drop
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>
                      PDF, DOC, DOCX (Max 10 MB each)
                    </div>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={e => {
                        const files = Array.from(e.target.files || []).map(f => f.name)
                        setUploadedFiles([...uploadedFiles, ...files])
                      }}
                    />
                  </div>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: 'uppercase' }}>
                      Files to Upload ({uploadedFiles.length})
                    </div>
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px', marginBottom: 8, borderRadius: 8, background: C.hover,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <FileText size={14} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, color: C.navy, fontWeight: 600 }}>{file}</span>
                        </div>
                        <button
                          onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <X size={14} style={{ color: C.muted }} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => handlePublish()}
                    disabled={organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0}
                    style={{
                      flex: 1, height: 40, borderRadius: 10, border: `1px solid ${C.border}`,
                      background: '#fff', color: C.navy, fontSize: 13, fontWeight: 700,
                      cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                      opacity: (organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0) ? 0.5 : 1,
                    }}
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handlePublish()}
                    disabled={organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0 || isPublishing}
                    style={{
                      flex: 1, height: 40, borderRadius: 10, border: 'none',
                      background: (organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0) ? '#C8CCE0' : '#6366F1',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                      cursor: (organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s', fontFamily: 'inherit',
                      opacity: isPublishing ? 0.8 : 1,
                    }}
                    onMouseEnter={e => {
                      if (!((organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0) || isPublishing)) {
                        (e.currentTarget.style as any).background = '#5B5FDE'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!((organizationType === 'tagged' ? !policyTagName || uploadedFiles.length === 0 : uploadedFiles.length === 0) || isPublishing)) {
                        (e.currentTarget.style as any).background = '#6366F1'
                      }
                    }}
                  >
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
