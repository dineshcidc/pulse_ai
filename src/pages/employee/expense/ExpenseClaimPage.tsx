import { useState } from 'react'
import { ArrowLeft, FileText, Download, CheckCircle2, DollarSign, Calendar, Paperclip, ChevronDown, Upload, X, Trash2, Edit2 } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

const EMPLOYEE = {
  empId: 'EMP-2024-0042',
  name: 'John Doe',
  avatar: 32,
  department: 'Engineering',
  role: 'Senior Engineer',
  email: 'john.doe@concertidc.com',
}

const APPROVER = {
  name: 'Rohan Mehta',
  role: 'Engineering Manager',
  avatar: 12,
}

export default function ExpenseClaimPage({ onBack }: { onBack: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    category: 'outstation',
    claimHead: 'air',
    fromDate: '',
    toDate: '',
    details: '',
    amount: '',
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [savedExpenses, setSavedExpenses] = useState<Array<{
    id: string
    category: string
    claimHead: string
    fromDate: string
    toDate: string
    details: string
    amount: string
    files: File[]
  }>>([])
  const [remarks, setRemarks] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false)

  function handleCloseModal() {
    setShowModal(false)
    setFormData({ category: 'outstation', claimHead: 'air', fromDate: '', toDate: '', details: '', amount: '' })
    setUploadedFiles([])
  }

  async function handleSaveExpense() {
    if (!formData.fromDate || !formData.toDate || !formData.amount || !formData.details) return

    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    setSavedExpenses([...savedExpenses, {
      id: Date.now().toString(),
      ...formData,
      files: uploadedFiles,
    }])

    setIsLoading(false)
    handleCloseModal()
  }

  function handleDeleteExpense(id: string) {
    setSavedExpenses(savedExpenses.filter(e => e.id !== id))
  }

  const totalAmount = savedExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const categoryOptions: Record<string, string> = {
    outstation: 'Outstation Travel',
    local: 'Local Conveyance',
    miscellaneous: 'Miscellaneous',
    periodic: 'Periodic Official',
  }
  const claimHeadOptions: Record<string, string> = {
    air: 'Air Travel',
    bus: 'Bus Travel',
    foreign: 'Foreign Exchange',
    hotel: 'Hotel Stay',
    meals: 'Lunch/Dinner',
    medical: 'Medical Insurance',
    perdiem: 'Per-diem',
    train: 'TrainTravel',
    travelins: 'Travel Insurance',
    visa: 'Visa Charges',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`,
            background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0', fontWeight: 400 }}>/</span>
        <button
          onClick={onBack}
          style={{
            fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none',
            cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
        >
          Expense
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0', fontWeight: 400 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>New Claim</span>
      </div>

      {/* 300px / 1fr split */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

            {/* Employee profile block */}
            <div style={{
              padding: '20px 20px 20px', borderBottom: `1px solid ${C.border}`,
              background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)',
            }}>
              <div style={{
                fontSize: 10.5, fontWeight: 700, color: '#6366F1',
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 14,
              }}>
                My Profile
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={`https://randomuser.me/api/portraits/men/32.jpg`}
                    alt={EMPLOYEE.name}
                    style={{
                      width: 50, height: 50, borderRadius: '50%', objectFit: 'cover',
                      display: 'block', border: '2.5px solid #fff',
                      boxShadow: '0 2px 10px rgba(99,102,241,0.18)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
                    borderRadius: '50%', background: '#0EA86A', border: '2px solid #fff',
                  }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 14.5, fontWeight: 800, color: C.navy,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {EMPLOYEE.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>
                    {EMPLOYEE.empId}
                  </div>
                  <div style={{ marginTop: 7 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 99,
                      background: 'rgba(255,255,255,0.70)', color: C.navy, border: `1px solid ${C.border}`,
                    }}>
                      {EMPLOYEE.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Approver Section */}
              <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 18 }}>
                <label style={{
                  fontSize: 11, fontWeight: 700, color: C.muted, display: 'block',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
                }}>
                  Approver
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={`https://i.pravatar.cc/150?img=${((APPROVER.avatar - 1) % 70) + 1}`}
                    alt={APPROVER.name}
                    style={{
                      width: 40, height: 40, borderRadius: '50%', objectFit: 'cover',
                      flexShrink: 0, border: `2px solid ${C.border}`,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: C.navy,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {APPROVER.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                      {APPROVER.role}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidelines Section */}
              <div>
                <label style={{
                  fontSize: 11, fontWeight: 700, color: C.muted, display: 'block',
                  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12,
                }}>
                  Submission Guidelines
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { Icon: Paperclip, label: 'Receipt/Invoice', desc: 'Attach proof' },
                    { Icon: DollarSign, label: 'Amount & Date', desc: 'Specify details' },
                    { Icon: CheckCircle2, label: 'Category', desc: 'Select type' },
                  ].map(({ Icon, label, desc }, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 12px', borderRadius: 10,
                        background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.12)`,
                      }}
                    >
                      <Icon size={14} style={{ color: '#6366F1', flexShrink: 0, marginTop: 2 }} strokeWidth={2} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>
                          {label}
                        </div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Expense Button */}
              <button
                onClick={() => setShowModal(true)}
                style={{
                  width: '100%', height: 44, borderRadius: 12, border: 'none',
                  background: C.navy, fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2A3050'}
                onMouseLeave={e => e.currentTarget.style.background = C.navy}
              >
                <FileText size={16} strokeWidth={2} /> Add New Expense
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>
          {savedExpenses.length === 0 ? (
            // Empty State
            <div style={{
              background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18,
              minHeight: 420, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16, padding: 48,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 22, background: 'rgba(99,102,241,0.10)',
                border: `1px solid rgba(99,102,241,0.20)`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={32} strokeWidth={1.2} style={{ color: '#6366F1' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: C.navy, margin: '0 0 8px' }}>
                  No Expense Claims Yet
                </p>
                <p style={{
                  fontSize: 13.5, color: C.muted, margin: 0, maxWidth: 320, lineHeight: 1.6,
                }}>
                  Click the <strong>"Add New Expense"</strong> button on the left to create and submit your first expense claim.
                </p>
              </div>
            </div>
          ) : (
            // Saved Expenses View
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Expense Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {savedExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    style={{
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden',
                    }}
                  >
                    {/* Card Header - Category with Icons */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', background: 'rgba(99,102,241,0.04)',
                      borderBottom: `1px solid ${C.border}`,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>
                        {categoryOptions[expense.category]}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                          title="Edit"
                        >
                          <Edit2 size={16} style={{ color: '#6366F1' }} strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: 'rgba(232,72,85,0.10)', border: '1px solid rgba(232,72,85,0.20)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.15)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                          title="Delete"
                        >
                          <Trash2 size={16} style={{ color: '#E84855' }} strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    {/* Card Details - Same Row */}
                    <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                      {/* Date Range */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                          Date Range
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                          {expense.fromDate} to {expense.toDate}
                        </div>
                      </div>

                      {/* Claim Head */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                          Claim Head
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                          {claimHeadOptions[expense.claimHead]}
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                          Amount
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0EA86A' }}>
                          ₹{parseFloat(expense.amount).toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Details */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                          Details
                        </div>
                        <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
                          {expense.details}
                        </div>
                      </div>
                    </div>

                    {/* Supporting Documents - Full Width */}
                    {expense.files.length > 0 && (
                      <div style={{
                        padding: '16px 20px', borderTop: `1px solid ${C.border}`,
                        background: 'rgba(99,102,241,0.02)',
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 10 }}>
                          Supporting Documents ({expense.files.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {expense.files.map((file, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                background: '#fff', borderRadius: 8, border: `1px solid ${C.border}`,
                              }}
                            >
                              <div style={{
                                width: 28, height: 28, borderRadius: 6,
                                background: 'rgba(99,102,241,0.10)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}>
                                <FileText size={12} style={{ color: '#6366F1' }} strokeWidth={2} />
                              </div>
                              <div style={{
                                fontSize: 12, fontWeight: 500, color: C.navy,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                flex: 1,
                              }}>
                                {file.name}
                              </div>
                              <div style={{ fontSize: 11, color: C.muted, flexShrink: 0 }}>
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px', overflow: 'hidden' }}>

                {/* Summary Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                      Total Expense Claimed
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                      Net Amount To Be Paid
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#0EA86A', letterSpacing: '-0.3px' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Remarks Section */}
                <div style={{ marginBottom: 0 }}>
                  <label style={{
                    fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                  }}>
                    Remarks (Optional)
                  </label>
                  <textarea
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Add any additional remarks..."
                    style={{
                      width: '100%', minHeight: 80, paddingLeft: 14, paddingTop: 10, paddingRight: 14, paddingBottom: 10,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 400, color: C.navy, fontFamily: 'inherit',
                      outline: 'none', resize: 'vertical',
                      transition: 'border 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                paddingTop: 12, paddingBottom: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    style={{
                      height: 42, paddingLeft: 22, paddingRight: 24,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 600, color: C.muted, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#C8CCE0'
                      e.currentTarget.style.color = C.navy
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = C.border
                      e.currentTarget.style.color = C.muted
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      height: 42, paddingLeft: 20, paddingRight: 22,
                      background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)',
                      borderRadius: 10, fontSize: 13.5, fontWeight: 600, color: '#D97706',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.15)'
                      e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.10)'
                      e.currentTarget.style.borderColor = 'rgba(245,158,11,0.22)'
                    }}
                  >
                    Save as Draft
                  </button>
                </div>
                <button
                  onClick={async () => {
                    setIsSubmittingExpense(true)
                    await new Promise(r => setTimeout(r, 1500))
                    setIsSubmittingExpense(false)
                    setShowSuccessModal(true)
                  }}
                  disabled={isSubmittingExpense}
                  style={{
                    height: 42, paddingLeft: 28, paddingRight: 30,
                    background: isSubmittingExpense ? '#A5B4FC' : '#6366F1',
                    border: 'none', borderRadius: 10,
                    fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: isSubmittingExpense ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit', transition: 'background 0.15s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (!isSubmittingExpense) e.currentTarget.style.background = '#4F46E5' }}
                  onMouseLeave={e => { if (!isSubmittingExpense) e.currentTarget.style.background = '#6366F1' }}
                >
                  {isSubmittingExpense ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Expense'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL BACKDROP ── */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(28, 32, 53, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) handleCloseModal() }}
        >
          {/* ── MODAL CARD ── */}
          <div style={{
            background: '#fff', borderRadius: 20, width: '90%', maxWidth: 900,
            maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(28, 32, 53, 0.22)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '24px 32px', borderBottom: `1px solid ${C.border}`,
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: '-0.3px' }}>
                  Create Expense Claim
                </h2>
                <p style={{ fontSize: 12.5, color: C.muted, margin: '4px 0 0', fontWeight: 500 }}>
                  Fill in the details below to submit a new expense claim
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
                  background: '#fff', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                <X size={16} style={{ color: C.muted }} strokeWidth={2.2} />
              </button>
            </div>

            {/* Modal Form Content */}
            <div style={{ padding: '28px 32px' }}>

              {/* Category & Claim Head */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {/* Category */}
                <div>
                  <label style={{
                    fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                  }}>
                    Category
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%', height: 42, paddingLeft: 14, paddingRight: 38,
                        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                        fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'pointer',
                        outline: 'none', fontFamily: 'inherit', appearance: 'none',
                        transition: 'border 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#6366F1'}
                      onBlur={e => e.target.style.borderColor = C.border}
                    >
                      <option value="outstation">Outstation Travel Expenses</option>
                      <option value="local">Local Conveyance</option>
                      <option value="miscellaneous">Miscellaneous Expenses</option>
                      <option value="periodic">Periodic Official Expenses</option>
                    </select>
                    <ChevronDown
                      size={16} style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        color: C.muted, pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Claim Head */}
                <div>
                  <label style={{
                    fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                  }}>
                    Claim Head
                  </label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={formData.claimHead}
                      onChange={e => setFormData({ ...formData, claimHead: e.target.value })}
                      style={{
                        width: '100%', height: 42, paddingLeft: 14, paddingRight: 38,
                        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                        fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'pointer',
                        outline: 'none', fontFamily: 'inherit', appearance: 'none',
                        transition: 'border 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#6366F1'}
                      onBlur={e => e.target.style.borderColor = C.border}
                    >
                      <option value="air">Air Travel</option>
                      <option value="bus">Bus Travel</option>
                      <option value="foreign">Foreign Exchange</option>
                      <option value="hotel">Hotel Stay</option>
                      <option value="meals">Lunch/Dinner</option>
                      <option value="medical">Medical Insurance</option>
                      <option value="perdiem">Per-diem (per day expenses)</option>
                      <option value="train">TrainTravel</option>
                      <option value="travelins">Travel Insurance</option>
                      <option value="visa">Visa Charges</option>
                    </select>
                    <ChevronDown
                      size={16} style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        color: C.muted, pointerEvents: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* From Date & To Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={{
                    fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                  }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={e => setFormData({ ...formData, fromDate: e.target.value })}
                    style={{
                      width: '100%', height: 42, paddingLeft: 14, paddingRight: 14,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'pointer',
                      outline: 'none', fontFamily: 'inherit',
                      transition: 'border 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div>
                  <label style={{
                    fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                  }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={e => setFormData({ ...formData, toDate: e.target.value })}
                    style={{
                      width: '100%', height: 42, paddingLeft: 14, paddingRight: 14,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'pointer',
                      outline: 'none', fontFamily: 'inherit',
                      transition: 'border 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* Details */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                }}>
                  Details
                </label>
                <textarea
                  value={formData.details}
                  onChange={e => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Describe your expense..."
                  style={{
                    width: '100%', minHeight: 100, paddingLeft: 14, paddingTop: 10, paddingRight: 14, paddingBottom: 10,
                    background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                    fontSize: 13.5, fontWeight: 400, color: C.navy, fontFamily: 'inherit',
                    outline: 'none', resize: 'vertical',
                    transition: 'border 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#6366F1'}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>

              {/* Amount */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                }}>
                  Amount
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                    fontSize: 15, fontWeight: 600, color: C.muted,
                  }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    style={{
                      width: '100%', height: 42, paddingLeft: 34, paddingRight: 14,
                      background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                      fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'text',
                      outline: 'none', fontFamily: 'inherit',
                      transition: 'border 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366F1'}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div style={{ marginBottom: 0 }}>
                <label style={{
                  fontSize: 13, fontWeight: 700, color: C.navy, display: 'block', marginBottom: 8,
                }}>
                  Attach Supporting Documents
                </label>

                {/* Clickable Upload Area */}
                <label
                  htmlFor="file-upload-input"
                  style={{
                    display: 'block',
                    background: C.surface, border: `2px dashed ${C.border}`, borderRadius: 10,
                    padding: 20, textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.15s', marginBottom: 12,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.05)'
                    e.currentTarget.style.borderColor = '#6366F1'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = C.surface
                    e.currentTarget.style.borderColor = C.border
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Upload size={22} style={{ color: '#6366F1' }} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: C.navy, margin: '0 0 3px' }}>
                        Click to upload documents
                      </p>
                      <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
                        .doc, .docx, .pdf, .txt (Max 4 MB)
                      </p>
                    </div>
                  </div>

                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    onChange={e => {
                      if (e.target.files) {
                        setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)])
                      }
                    }}
                    style={{ display: 'none' }}
                    accept=".doc,.docx,.pdf,.txt"
                  />
                </label>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div style={{ marginBottom: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase',
                      letterSpacing: '0.05em', marginBottom: 10,
                    }}>
                      Uploaded Documents ({uploadedFiles.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 14px', background: '#fff', borderRadius: 10,
                            border: `1px solid ${C.border}`, transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: 'rgba(99,102,241,0.10)', display: 'flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              <FileText size={14} style={{ color: '#6366F1' }} strokeWidth={2} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{
                                fontSize: 12, fontWeight: 600, color: C.navy,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                                {file.name}
                              </div>
                              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                                {(file.size / 1024).toFixed(1)} KB
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx))}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#E84855', flexShrink: 0, borderRadius: 6,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(232,72,85,0.10)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            title="Delete file"
                          >
                            <X size={16} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12,
              padding: '20px 32px', borderTop: `1px solid ${C.border}`, background: C.surface,
            }}>
              <button
                onClick={handleCloseModal}
                style={{
                  height: 42, paddingLeft: 24, paddingRight: 26,
                  background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
                  fontSize: 13.5, fontWeight: 600, color: C.muted, cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C8CCE0'
                  e.currentTarget.style.color = C.navy
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.muted
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExpense}
                disabled={isLoading || !formData.fromDate || !formData.toDate || !formData.amount || !formData.details}
                style={{
                  height: 42, paddingLeft: 28, paddingRight: 30,
                  background: isLoading || !formData.fromDate || !formData.toDate || !formData.amount || !formData.details ? '#C5EBE8' : '#0EA86A',
                  border: 'none', borderRadius: 10,
                  fontSize: 13.5, fontWeight: 600, color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = '#0b8560' }}
                onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = '#0EA86A' }}
              >
                {isLoading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Saving...
                  </>
                ) : 'Save Claim'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS CONFIRMATION MODAL ── */}
      {showSuccessModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(28, 32, 53, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowSuccessModal(false) }}
        >
          <div style={{
            background: '#fff', borderRadius: 20, width: '90%', maxWidth: 480,
            boxShadow: '0 20px 60px rgba(28, 32, 53, 0.22)', overflow: 'hidden',
          }}>
            {/* Success Content */}
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              {/* Success Icon - Full Circle */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(14,168,106,0.12)', border: '2.5px solid #0EA86A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0EA86A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 20, fontWeight: 800, color: C.navy, margin: '0 0 12px',
                letterSpacing: '-0.3px',
              }}>
                Expense Claim Submitted
              </h2>

              {/* Message */}
              <p style={{
                fontSize: 14, color: C.muted, margin: '0 0 28px', lineHeight: 1.6,
              }}>
                Your expense claim has been successfully submitted for approval. You can track the status in your dashboard.
              </p>

              {/* Summary Details */}
              <div style={{
                background: 'rgba(99,102,241,0.04)', border: `1px solid rgba(99,102,241,0.12)`,
                borderRadius: 12, padding: '18px 16px', marginBottom: 28, textAlign: 'left',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                      Total Claimed
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0EA86A' }}>
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                      Expenses
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>
                      {savedExpenses.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Done Button */}
              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  onBack()
                }}
                style={{
                  width: '100%', height: 44, borderRadius: 12, border: 'none',
                  background: '#6366F1', fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
                onMouseLeave={e => e.currentTarget.style.background = '#6366F1'}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
