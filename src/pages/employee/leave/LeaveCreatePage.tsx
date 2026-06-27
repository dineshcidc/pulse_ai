import { useState, useRef } from 'react'
import { CalendarDays, Copy, Check, Paperclip, X, ChevronDown } from 'lucide-react'

const LEAVE_TYPES = [
  { value: 'BH',  label: 'Bereavement Holiday',  consumed: 0,  available: 3  },
  { value: 'BL',  label: 'Birthday Leave',        consumed: 0,  available: 1  },
  { value: 'EDL', label: 'Election Day Leave',    consumed: 0,  available: 1  },
  { value: 'FH',  label: 'Floating Holiday',      consumed: 1,  available: 2  },
  { value: 'LWP', label: 'LWP',                   consumed: 0,  available: 0  },
  { value: 'PAT', label: 'Paternity Leave',        consumed: 0,  available: 15 },
  { value: 'PL',  label: 'Planned Leave',          consumed: 5,  available: 10 },
  { value: 'UPL', label: 'Unplanned Leave',        consumed: 2,  available: 6  },
]

const REASON_TEMPLATES = [
  { id: 1, text: 'I am taking leave due to personal reasons.' },
  { id: 2, text: 'I am not feeling well and need rest to recover.' },
  { id: 3, text: 'I have a family function to attend on these dates.' },
  { id: 4, text: 'I need to attend a medical appointment.' },
  { id: 5, text: 'I am travelling for an urgent personal matter.' },
  { id: 6, text: 'I need to take care of a family member who is unwell.' },
  { id: 7, text: 'I have a prior commitment that requires my presence.' },
]

function calcWorkingDays(start: string, end: string): number {
  if (!start || !end) return 0
  const s = new Date(start)
  const e = new Date(end)
  if (e < s) return 0
  let count = 0
  const cur = new Date(s)
  while (cur <= e) {
    const dow = cur.getDay()
    if (dow !== 0 && dow !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

const inputBase: React.CSSProperties = {
  width: '100%',
  height: 44,
  borderRadius: 10,
  padding: '0 14px',
  fontSize: 13.5,
  fontWeight: 500,
  color: '#1C2035',
  outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
}

export default function LeaveCreatePage({ onNavigate }: { onNavigate?: (id: string) => void } = {}) {
  const [leaveType,    setLeaveType]    = useState('')
  const [startDate,    setStartDate]    = useState('')
  const [endDate,      setEndDate]      = useState('')
  const [remarks,      setRemarks]      = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [copiedId,     setCopiedId]     = useState<number | null>(null)
  const [dragOver,       setDragOver]       = useState(false)
  const [showConfirm,    setShowConfirm]    = useState(false)
  const [showSuccess,    setShowSuccess]    = useState(false)
  const [submitLoading,  setSubmitLoading]  = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const selectedLeave = LEAVE_TYPES.find(t => t.value === leaveType)
  const days = calcWorkingDays(startDate, endDate)

  function copyTemplate(id: number, text: string) {
    navigator.clipboard.writeText(text).catch(() => {})
    setRemarks(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function fmtDate(d: string) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  async function handleFinalSubmit() {
    setSubmitLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitLoading(false)
    setShowConfirm(false)
    setShowSuccess(true)
  }

  function handleFile(file: File | null) {
    if (!file) return
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    if (!['.doc', '.docx', '.pdf', '.txt'].includes(ext)) return
    if (file.size > 2 * 1024 * 1024) return
    setUploadedFile(file)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }`}</style>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Create Leave Request
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Fill in the details below to submit your leave application
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84, height: 84,
            backgroundColor: 'rgba(99,102,241,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(99,102,241,0.14)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <CalendarDays size={34} strokeWidth={1.5} style={{ color: '#5B5FDE' }} />
          </div>
        </div>
      </div>

      {/* ── 8 / 4 grid ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

        {/* ════ LEFT — Form ════ */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

          {/* Card header */}
          <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}
            >
              <CalendarDays size={15} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Leave Request Details</span>
          </div>

          <div style={{ padding: '26px 24px' }}>

            {/* ── Employee (read-only) ── */}
            <div className="mb-6">
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Employee
              </label>
              <div
                className="flex items-center gap-3"
                style={{ height: 44, borderRadius: 10, border: `1px solid ${C.border}`, background: '#F7F8FC', padding: '0 14px' }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(99,102,241,0.13)', color: '#5B5FDE' }}
                >J</div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>John Doe</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>(EMP-001)</span>
                <span
                  className="ml-auto text-xs font-semibold rounded-full px-2.5 py-0.5"
                  style={{ background: 'rgba(14,168,106,0.10)', color: '#0A8A58' }}
                >Employee</span>
              </div>
            </div>

            {/* ── Leave Type / Consumed / Available ── */}
            <div className="grid grid-cols-3 gap-5 mb-6">

              {/* Leave Type */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Leave Type <span style={{ color: '#E84855' }}>*</span>
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value)}
                    style={{
                      ...inputBase,
                      paddingRight: 36,
                      border: `1px solid ${C.border}`,
                      background: leaveType ? '#F5F6FF' : '#fff',
                      appearance: 'none',
                      cursor: 'pointer',
                      color: leaveType ? C.navy : C.muted,
                    }}
                  >
                    <option value="">— Select Leave Type —</option>
                    {LEAVE_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label} ({t.value})</option>
                    ))}
                  </select>
                  <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Consumed */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Consumed
                </label>
                <div
                  className="flex items-center gap-2"
                  style={{ height: 44, borderRadius: 10, border: `1px solid ${C.border}`, background: '#F7F8FC', padding: '0 14px' }}
                >
                  {selectedLeave ? (
                    <>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#E84855', lineHeight: 1, letterSpacing: '-0.5px' }}>
                        {selectedLeave.consumed}
                      </span>
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>days used</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: '#C8CCE0' }}>—</span>
                  )}
                </div>
              </div>

              {/* Available */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Available
                </label>
                <div
                  className="flex items-center gap-2"
                  style={{ height: 44, borderRadius: 10, border: `1px solid ${C.border}`, background: '#F7F8FC', padding: '0 14px' }}
                >
                  {selectedLeave ? (
                    <>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#0EA86A', lineHeight: 1, letterSpacing: '-0.5px' }}>
                        {selectedLeave.available}
                      </span>
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>days left</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: '#C8CCE0' }}>—</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Start / End Date / Working Days ── */}
            <div className="grid grid-cols-3 gap-5 mb-6">

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Start Date <span style={{ color: '#E84855' }}>*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => { setStartDate(e.target.value); if (endDate && e.target.value > endDate) setEndDate('') }}
                  style={{ ...inputBase, border: `1px solid ${C.border}`, background: startDate ? '#F5F6FF' : '#fff', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  End Date <span style={{ color: '#E84855' }}>*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ ...inputBase, border: `1px solid ${C.border}`, background: endDate ? '#F5F6FF' : '#fff', cursor: 'pointer' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Working Days
                </label>
                <div
                  className="flex items-center gap-2"
                  style={{ height: 44, borderRadius: 10, border: `1px solid ${days > 0 ? 'rgba(99,102,241,0.3)' : C.border}`, background: days > 0 ? 'rgba(99,102,241,0.04)' : '#F7F8FC', padding: '0 14px' }}
                >
                  {days > 0 ? (
                    <>
                      <span style={{ fontSize: 20, fontWeight: 800, color: '#6366F1', lineHeight: 1, letterSpacing: '-0.5px' }}>{days}</span>
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>day{days !== 1 ? 's' : ''}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 13, color: '#C8CCE0' }}>—</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Remarks ── */}
            <div className="mb-6">
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Remarks <span style={{ color: '#E84855' }}>*</span>
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Describe your reason for taking this leave..."
                rows={4}
                style={{
                  width: '100%', borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: remarks ? '#F5F6FF' : '#fff', padding: '12px 14px',
                  fontSize: 13.5, fontWeight: 400, color: C.navy,
                  resize: 'vertical', outline: 'none',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  lineHeight: 1.65, boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>

            {/* ── Upload Document ── */}
            <div className="mb-7">
              <label style={{ fontSize: 11.5, fontWeight: 700, color: '#8B90A7', display: 'block', marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Supporting Document{' '}
                <span style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".doc,.docx,.pdf,.txt"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files?.[0] ?? null)}
              />

              {uploadedFile ? (
                <div
                  className="flex items-center gap-3"
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    border: '1px solid rgba(14,168,106,0.3)',
                    background: 'rgba(14,168,106,0.05)',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{ width: 36, height: 36, background: 'rgba(14,168,106,0.12)', color: '#0EA86A' }}
                  >
                    <Paperclip size={16} strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate" style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{uploadedFile.name}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{(uploadedFile.size / 1024).toFixed(1)} KB · Ready to submit</div>
                  </div>
                  <button
                    onClick={() => { setUploadedFile(null); if (fileRef.current) fileRef.current.value = '' }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, lineHeight: 0 }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0] ?? null) }}
                  style={{
                    padding: '24px 20px', borderRadius: 10, textAlign: 'center',
                    border: `2px dashed ${dragOver ? '#6366F1' : '#D8DCF0'}`,
                    background: dragOver ? 'rgba(99,102,241,0.04)' : '#FAFBFE',
                    cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#B0B4D0' }}
                  onMouseLeave={e => { if (!dragOver) e.currentTarget.style.borderColor = '#D8DCF0' }}
                >
                  <div
                    className="flex items-center justify-center mx-auto mb-3 rounded-xl"
                    style={{ width: 42, height: 42, background: 'rgba(99,102,241,0.09)', color: '#5B5FDE' }}
                  >
                    <Paperclip size={18} strokeWidth={1.8} />
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 5 }}>
                    Click to upload or drag &amp; drop
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    .doc, .docx, .pdf, .txt &nbsp;·&nbsp; Max size 2 MB
                  </div>
                </div>
              )}
            </div>

            {/* ── Action buttons ── */}
            <div
              className="flex items-center gap-3"
              style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}
            >
              <button
                onClick={() => onNavigate?.('dashboard')}
                style={{
                  height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                  border: `1px solid ${C.border}`, background: '#fff', color: C.muted,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>

              <button
                style={{
                  height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                  border: `1px solid #D8DCF0`, background: '#F7F8FC', color: '#5A6080',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ECEEF5'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.color = '#5A6080' }}
              >
                Save as Draft
              </button>

              <button
                onClick={() => setShowConfirm(true)}
                style={{
                  height: 44, padding: '0 32px', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                  border: 'none', marginLeft: 'auto',
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: '#fff', cursor: 'pointer',
                  transition: 'opacity 0.15s',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                Submit Request
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* ════ RIGHT — Reason helper ════ */}
        <div className="flex flex-col gap-4">

          {/* ── Quick Templates ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}
              >
                <Copy size={13} strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, flex: 1 }}>Quick Templates</span>
              <span
                className="text-xs font-semibold rounded-full px-2 py-0.5"
                style={{ background: '#F0F2F8', color: C.muted }}
              >
                fills remarks
              </span>
            </div>
            <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {REASON_TEMPLATES.map(t => {
                const isCopied = copiedId === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => copyTemplate(t.id, t.text)}
                    className="w-full text-left flex items-start gap-2.5 rounded-xl border-none cursor-pointer transition-all duration-150"
                    style={{
                      padding: '10px 12px',
                      background: isCopied ? 'rgba(14,168,106,0.07)' : '#F7F8FC',
                      border: `1px solid ${isCopied ? 'rgba(14,168,106,0.22)' : '#ECEEF5'}`,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!isCopied) { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.borderColor = '#D8DCF0' } }}
                    onMouseLeave={e => { if (!isCopied) { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#ECEEF5' } }}
                  >
                    <span style={{ fontSize: 12.5, color: '#3D4266', lineHeight: 1.55, flex: 1, fontWeight: 400 }}>
                      {t.text}
                    </span>
                    <span
                      className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{
                        width: 26, height: 26, marginTop: 1,
                        background: isCopied ? 'rgba(14,168,106,0.14)' : 'rgba(99,102,241,0.10)',
                        color: isCopied ? '#0EA86A' : '#5B5FDE',
                        transition: 'all 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      {isCopied
                        ? <Check size={12} strokeWidth={2.5} />
                        : <Copy size={11} strokeWidth={2.2} />
                      }
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── Confirmation modal ── */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false) }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 22,
              width: 440, boxShadow: '0 24px 64px rgba(10,12,28,0.18)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}
                >
                  <CalendarDays size={19} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Confirm Leave Request</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>
                    Please review your details before submitting
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Employee */}
              <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>John Doe (EMP-001)</span>
              </div>

              {/* Leave Type */}
              <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leave Type</span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
                  {selectedLeave ? `${selectedLeave.label} (${selectedLeave.value})` : '—'}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</span>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{fmtDate(startDate)}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>→</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{fmtDate(endDate)}</span>
                  {days > 0 && (
                    <span
                      className="rounded-full text-xs font-bold px-2 py-0.5"
                      style={{ background: 'rgba(99,102,241,0.12)', color: '#5B5FDE', marginLeft: 4 }}
                    >
                      {days}d
                    </span>
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Remarks</div>
                <div style={{ fontSize: 13, color: remarks ? C.navy : '#C0C4D6', lineHeight: 1.6, fontStyle: remarks ? 'normal' : 'italic' }}>
                  {remarks || 'No remarks provided'}
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
                  border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
              >
                Go Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitLoading}
                style={{
                  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700,
                  border: 'none',
                  background: submitLoading ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: '#fff', cursor: submitLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { if (!submitLoading) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {submitLoading ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'leaveSpин 0.8s linear infinite', flexShrink: 0 }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Submitting...
                  </>
                ) : 'Yes, Submit'}
              </button>
            </div>
          </div>
          <style>{`@keyframes leaveSpин { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
      )}

      {/* ── Success modal ── */}
      {showSuccess && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              background: '#fff', borderRadius: 22,
              width: 400, padding: '40px 36px 32px',
              boxShadow: '0 24px 64px rgba(10,12,28,0.18)',
              textAlign: 'center',
            }}
          >
            {/* Animated check */}
            <div
              className="flex items-center justify-center mx-auto mb-5 rounded-2xl"
              style={{ width: 68, height: 68, background: 'rgba(14,168,106,0.10)' }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0EA86A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, letterSpacing: '-0.3px' }}>
              Request Submitted!
            </div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>
              Your leave request has been successfully submitted.
            </p>
            <p style={{ fontSize: 13, color: '#5A6080', lineHeight: 1.65, marginBottom: 28 }}>
              <strong style={{ color: C.navy }}>John Doe</strong> — {selectedLeave?.label ?? 'Leave'} from{' '}
              <strong style={{ color: C.navy }}>{fmtDate(startDate)}</strong> to{' '}
              <strong style={{ color: C.navy }}>{fmtDate(endDate)}</strong>
              {days > 0 && <> ({days} working day{days !== 1 ? 's' : ''})</>}
              . Your manager will be notified for approval.
            </p>

            {/* Reference badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7"
              style={{ background: '#F0F2F8', fontSize: 12, fontWeight: 600, color: C.muted }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0EA86A', display: 'inline-block' }} />
              Reference: LVR-{String(Math.floor(Math.random() * 9000) + 1000)}
            </div>

            <button
              onClick={() => { setShowSuccess(false); setLeaveType(''); setStartDate(''); setEndDate(''); setRemarks(''); setUploadedFile(null) }}
              style={{
                width: '100%', height: 46, borderRadius: 12, fontSize: 14, fontWeight: 700,
                border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#fff', cursor: 'pointer', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
