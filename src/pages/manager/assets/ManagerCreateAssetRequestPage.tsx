import { useState } from 'react'
import { ArrowLeft, Search, ChevronDown } from 'lucide-react'

interface ManagerCreateAssetRequestPageProps {
  onRequestCreated?: (request: any, selectedEmployee: string) => void
  onNavigate?: (page: string) => void
}

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

const CATEGORIES = [
  { id: 'laptop', label: 'Laptop' },
  { id: 'tablet', label: 'Tablet' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'mouse', label: 'Mouse' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'phone', label: 'Phone' },
  { id: 'printer', label: 'Printer' },
]

const EMPLOYEES = [
  { id: 'myself', name: 'Myself', role: 'Project Manager', code: 'CC001' },
  { id: 'emp-001', name: 'Sarah Johnson', role: 'Developer', code: 'CC002' },
  { id: 'emp-002', name: 'Rajesh Kumar', role: 'Designer', code: 'CC003' },
  { id: 'emp-003', name: 'Priya Sharma', role: 'QA Engineer', code: 'CC004' },
  { id: 'emp-004', name: 'Arjun Menon', role: 'Developer', code: 'CC005' },
]

export default function ManagerCreateAssetRequestPage({ onRequestCreated, onNavigate }: ManagerCreateAssetRequestPageProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('myself')
  const [employeeSearch, setEmployeeSearch] = useState<string>('')
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState<boolean>(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [remark, setRemark] = useState<string>('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const employee = EMPLOYEES.find(e => e.id === selectedEmployee)
  const filteredEmployees = EMPLOYEES.filter(emp =>
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.code.toLowerCase().includes(employeeSearch.toLowerCase())
  )

  const handleContinue = () => {
    if (!selectedCategory || !remark.trim()) {
      alert('Please fill in all required fields')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowConfirmation(true)
    }, 800)
  }

  const handleSubmit = () => {
    const requestId = `AR-2026-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

    const newRequest = {
      id: `ar-new-${Date.now()}`,
      requestId,
      assetName: remark,
      assetCode: '—',
      category: CATEGORIES.find(c => c.id === selectedCategory)?.label || '',
      status: 'Pending',
      employeeName: employee?.name || 'John Doe',
      employeeCode: employee?.code || 'CC001',
      requestedDate: today,
      pendingWith: 'System Admin',
    }

    onRequestCreated?.(newRequest, selectedEmployee)

    // Navigate based on employee selection
    if (selectedEmployee === 'myself') {
      onNavigate?.('my-assets')
    } else {
      onNavigate?.('team-asset-requests')
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <button
          onClick={() => onNavigate?.('team-asset-requests')}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={() => onNavigate?.('team-asset-requests')}
          style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={(e) => { e.currentTarget.style.color = C.muted }}
        >
          Team Asset Requests
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Create Request</span>
      </div>

      {/* ── Form Card ────────────────────────────────────────────────────── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 28 }}>Create Asset Request</h2>

        {/* Employee & Category Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          {/* Employee Selection - Searchable */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              For Employee *
            </label>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 13,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  color: C.navy,
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.14s',
                }}
                onMouseEnter={(e) => { if (!showEmployeeDropdown) e.currentTarget.style.borderColor = '#5B5FDE' }}
                onMouseLeave={(e) => { if (!showEmployeeDropdown) e.currentTarget.style.borderColor = C.border }}
              >
                <span>{employee?.name || 'Select Employee'}</span>
                <ChevronDown size={16} style={{ color: C.muted, transform: showEmployeeDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              {showEmployeeDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: '#fff',
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    zIndex: 10,
                    overflow: 'hidden',
                  }}
                >
                  {/* Search Box */}
                  <div style={{ padding: 12, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Search size={16} style={{ color: C.muted, flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Search by name or code..."
                      value={employeeSearch}
                      onChange={(e) => setEmployeeSearch(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1,
                        fontSize: 12,
                        border: 'none',
                        background: 'none',
                        outline: 'none',
                        color: C.navy,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                      }}
                    />
                  </div>

                  {/* Employee List */}
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map(emp => (
                        <button
                          key={emp.id}
                          onClick={() => {
                            setSelectedEmployee(emp.id)
                            setShowEmployeeDropdown(false)
                            setEmployeeSearch('')
                          }}
                          style={{
                            width: '100%',
                            padding: '12px',
                            textAlign: 'left',
                            background: selectedEmployee === emp.id ? 'rgba(91,95,222,0.08)' : '#fff',
                            border: 'none',
                            borderBottom: `1px solid ${C.border}`,
                            cursor: 'pointer',
                            transition: 'all 0.14s',
                            display: 'flex',
                            gap: 10,
                            alignItems: 'center',
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(91,95,222,0.05)' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = selectedEmployee === emp.id ? 'rgba(91,95,222,0.08)' : '#fff' }}
                        >
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(91,95,222,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#5B5FDE',
                            fontWeight: 700,
                            fontSize: 12,
                            flexShrink: 0,
                          }}>
                            {emp.name.split(' ').slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('')}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{emp.name}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{emp.role} • {emp.code}</div>
                          </div>
                          {selectedEmployee === emp.id && (
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B5FDE', flexShrink: 0 }} />
                          )}
                        </button>
                      ))
                    ) : (
                      <div style={{ padding: 16, textAlign: 'center', color: C.muted, fontSize: 12 }}>
                        No employees found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {employee && (
              <div style={{ marginTop: 12, padding: 12, background: 'rgba(91,95,222,0.08)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(91,95,222,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5B5FDE',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}>
                  {employee.name.split(' ').slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{employee.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#5B5FDE', background: 'rgba(91,95,222,0.12)', padding: '3px 8px', borderRadius: 4 }}>{employee.role}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#5B5FDE', background: 'rgba(91,95,222,0.10)', padding: '3px 8px', borderRadius: 4 }}>{employee.code}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              Asset Category *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: 13,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                color: C.navy,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Remark/Description */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
            Remarks *
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Enter asset name, specifications, and any special requirements..."
            style={{
              width: '100%',
              padding: '12px',
              fontSize: 13,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              background: '#fff',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              color: C.navy,
              minHeight: 100,
              resize: 'vertical',
            }}
          />
        </div>



        {/* Buttons - Cancel & Continue */}
        <div style={{ display: 'flex', gap: 12, marginTop: 32, justifyContent: 'flex-end' }}>
          <button
            onClick={() => onNavigate?.('team-asset-requests')}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              background: C.bg,
              color: C.navy,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E4E6EF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = C.bg
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedCategory || !remark.trim() || isLoading}
            style={{
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              background: selectedCategory && remark.trim() && !isLoading
                ? 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.5) 0%, rgba(79, 70, 229, 0.5) 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: selectedCategory && remark.trim() && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              opacity: selectedCategory && remark.trim() && !isLoading ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (selectedCategory && remark.trim() && !isLoading) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>

      {/* ── Confirmation Popup ─────────────────────────────────────────────── */}
      {showConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,12,28,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowConfirmation(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: '28px',
              maxWidth: 480,
              width: '90%',
              boxShadow: '0 24px 64px rgba(10,12,28,0.22)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 16 }}>Confirm Request</h3>

            <div style={{ marginBottom: 24 }}>
              {/* Employee Card */}
              <div style={{ marginBottom: 16, padding: 12, background: 'rgba(91,95,222,0.08)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(91,95,222,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5B5FDE',
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}>
                  {employee?.name.split(' ').slice(0, 2).map(n => n.charAt(0).toUpperCase()).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{employee?.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#5B5FDE', background: 'rgba(91,95,222,0.12)', padding: '3px 8px', borderRadius: 4 }}>{employee?.role}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#5B5FDE', background: 'rgba(91,95,222,0.10)', padding: '3px 8px', borderRadius: 4 }}>{employee?.code}</span>
                  </div>
                </div>
              </div>

              {/* Category & Description */}
              <div style={{ padding: 12, background: C.bg, borderRadius: 10 }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase' }}>Category</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 4 }}>{CATEGORIES.find(c => c.id === selectedCategory)?.label}</div>
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase' }}>Description</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 4 }}>{remark}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowConfirmation(false)}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  background: C.bg,
                  color: C.navy,
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
