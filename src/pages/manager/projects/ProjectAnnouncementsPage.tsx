import { useState, useRef } from 'react'
import {
  Megaphone, Send, Clock, FileText, Paperclip, Users, User,
  Search, Plus, X, ChevronDown, Calendar, Trash2, Eye,
  CheckCircle, Download, Bell, Image as ImageIcon, ArrowLeft,
  AlertTriangle, Info, Tag,
} from 'lucide-react'

/* ── Types ── */
type AudienceType = 'all' | 'project' | 'individual'
type Priority     = 'Normal' | 'Important' | 'Urgent'
type AnnStatus    = 'sent' | 'scheduled' | 'draft'

interface AnnFile { name: string; type: 'image' | 'pdf' | 'doc'; size: string }
interface Announcement {
  id: number; title: string; subject: string; message: string
  audience: AudienceType; audienceLabel: string; priority: Priority
  status: AnnStatus; timeLabel: string; recipients: number; attachments: AnnFile[]
}

/* ── Mock data ── */
const ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Q2 Sprint Planning — Mandatory Attendance', subject: 'Sprint Planning Session for All Project Teams', message: 'This is to inform all team members that the Q2 Sprint Planning session is scheduled for May 28, 2026. Attendance is mandatory for all project managers and lead developers. Please block your calendars and ensure all open tickets are updated before the session begins.', audience: 'all', audienceLabel: 'All Employees', priority: 'Important', status: 'sent', timeLabel: 'May 22, 2026 · 9:30 AM', recipients: 24, attachments: [{ name: 'Sprint_Plan_Q2.pdf', type: 'pdf', size: '1.2 MB' }] },
  { id: 2, title: 'Pulse.AI v2 — Production Deployment Notice', subject: 'Scheduled Downtime on May 25, 2026', message: 'The Pulse.AI v2 platform will undergo a scheduled maintenance window on May 25 between 11 PM and 2 AM IST. All team members working on this project should ensure their code is pushed and PRs reviewed before this window.', audience: 'project', audienceLabel: 'Pulse.AI v2 Team', priority: 'Urgent', status: 'sent', timeLabel: 'May 21, 2026 · 4:00 PM', recipients: 8, attachments: [] },
  { id: 3, title: 'New Leave Policy Update — Effective June 1', subject: 'Updated HR Leave Policy FY 2026-27', message: 'Please review the updated leave policy document attached below. Key changes include revised carry-forward limits and new WFH guidelines. Questions can be directed to the HR team via the Tickets module.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'scheduled', timeLabel: 'Scheduled: May 30, 2026 · 10:00 AM', recipients: 24, attachments: [{ name: 'Leave_Policy_FY2627.pdf', type: 'pdf', size: '890 KB' }, { name: 'Policy_Summary.docx', type: 'doc', size: '220 KB' }] },
  { id: 4, title: 'HDFC Portal — Milestone 3 Review Meeting', subject: 'Client Call Preparation', message: 'The client review call for HDFC Portal Milestone 3 is on May 27. All QA and frontend members are requested to prepare the demo environment and test scenarios in advance.', audience: 'project', audienceLabel: 'HDFC Portal Team', priority: 'Important', status: 'draft', timeLabel: 'Draft saved: May 20, 2026', recipients: 0, attachments: [{ name: 'Demo_Checklist.pdf', type: 'pdf', size: '340 KB' }] },
  { id: 5, title: 'Welcome — May 2026 New Joiners', subject: 'Onboarding Announcement', message: 'We are delighted to welcome three new members joining Concert IDC this month. Please extend a warm welcome and assist in their onboarding as needed.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'sent', timeLabel: 'May 19, 2026 · 11:00 AM', recipients: 24, attachments: [] },
]

const PROJECTS  = ['Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP']
const EMPLOYEES = ['Sarah Johnson','Mike Chen','Emma Wilson','David Brown','Lisa Garcia','Tom Davis','Priya Sharma','James Wilson','Anjali Singh','Karthik Nair']

const PRIORITY_CFG: Record<Priority, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Normal:    { color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.22)',  icon: Info          },
  Important: { color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)',  icon: AlertTriangle },
  Urgent:    { color: '#E84855', bg: 'rgba(232,72,85,0.09)',   border: 'rgba(232,72,85,0.20)',   icon: Tag           },
}
const STATUS_CFG: Record<AnnStatus, { label: string; color: string; bg: string }> = {
  sent:      { label: 'Sent',      color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
  scheduled: { label: 'Scheduled', color: '#6366F1', bg: 'rgba(99,102,241,0.10)'  },
  draft:     { label: 'Draft',     color: '#8B90A7', bg: 'rgba(139,144,167,0.12)' },
}
const FILE_ICON: Record<string, { color: string; bg: string }> = {
  pdf:   { color: '#E84855', bg: 'rgba(232,72,85,0.10)'  },
  doc:   { color: '#6366F1', bg: 'rgba(99,102,241,0.10)' },
  image: { color: '#0891B2', bg: 'rgba(8,145,178,0.10)'  },
}
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }
const ANN_TABS: { id: AnnStatus; label: string }[] = [
  { id: 'sent', label: 'Sent' }, { id: 'scheduled', label: 'Scheduled' }, { id: 'draft', label: 'Drafts' },
]

/* ══════════════════════════════════════════
   Compose Page
══════════════════════════════════════════ */
function ComposePage({ onBack, onPublish }: { onBack: () => void; onPublish: (a: Announcement) => void }) {
  const [title, setTitle]         = useState('')
  const [subject, setSubject]     = useState('')
  const [message, setMessage]     = useState('')
  const [audience, setAudience]   = useState<AudienceType>('all')
  const [project, setProject]     = useState(PROJECTS[0])
  const [empSearch, setEmpSearch] = useState('')
  const [selEmps, setSelEmps]     = useState<string[]>([])
  const [priority, setPriority]   = useState<Priority>('Normal')
  const [scheduled, setScheduled] = useState(false)
  const [schedAt, setSchedAt]     = useState('')
  const [files, setFiles]         = useState<{ name: string; size: string; ftype: 'image'|'pdf'|'doc' }[]>([])
  const [sending, setSending]     = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const empList = EMPLOYEES.filter(e => e.toLowerCase().includes(empSearch.toLowerCase()) && !selEmps.includes(e))
  const canSend = title.trim().length > 0

  const audienceLabel =
    audience === 'all'     ? 'All Employees' :
    audience === 'project' ? `${project} Team` :
    selEmps.length > 0     ? selEmps.slice(0,2).join(', ') + (selEmps.length > 2 ? ` +${selEmps.length-2}` : '') :
    'No members selected'

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    setFiles(prev => [...prev, ...picked.map(f => ({
      name: f.name,
      size: f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
      ftype: (f.type.startsWith('image') ? 'image' : f.name.endsWith('.pdf') ? 'pdf' : 'doc') as 'image'|'pdf'|'doc',
    }))])
    e.target.value = ''
  }

  async function handleSend(asDraft = false) {
    setSending(true)
    await new Promise(r => setTimeout(r, 1100))
    onPublish({
      id: Date.now(),
      title: title || 'Untitled Announcement',
      subject: subject || '(no subject)',
      message, audience, audienceLabel, priority,
      status: asDraft ? 'draft' : scheduled ? 'scheduled' : 'sent',
      timeLabel: asDraft
        ? `Draft saved: ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`
        : scheduled && schedAt
        ? `Scheduled: ${new Date(schedAt).toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})}`
        : `${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`,
      recipients: asDraft ? 0 : audience === 'all' ? 24 : audience === 'project' ? 8 : selEmps.length,
      attachments: files.map(f => ({ name: f.name, type: f.ftype, size: f.size })),
    })
    setSending(false)
    onBack()
  }

  const pc = PRIORITY_CFG[priority]
  const PIcon = pc.icon

  const sectionLabel = (text: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>{text}</div>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={16} strokeWidth={2} style={{ color: C.navy }} />
          </button>
          <div>
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginBottom: 2 }}>Project Announcements</div>
            <h1 style={{ fontSize: 19, fontWeight: 800, color: C.navy, margin: 0 }}>New Announcement</h1>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleSend(true)}
            disabled={sending || !canSend}
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: canSend ? C.navy : C.muted, fontSize: 13.5, fontWeight: 600, cursor: canSend ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s' }}
            onMouseEnter={e => { if (canSend && !sending) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <FileText size={14} strokeWidth={1.8} /> Save Draft
          </button>
          <button
            onClick={() => handleSend(false)}
            disabled={sending || !canSend}
            style={{ height: 40, padding: '0 22px', borderRadius: 10, border: 'none', background: canSend && !sending ? '#6366F1' : 'rgba(99,102,241,0.35)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: canSend && !sending ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
            onMouseEnter={e => { if (canSend && !sending) e.currentTarget.style.background = '#4F52C8' }}
            onMouseLeave={e => { if (canSend && !sending) e.currentTarget.style.background = '#6366F1' }}
          >
            {sending ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Sending...
              </>
            ) : (
              <>{scheduled ? <Calendar size={14} strokeWidth={1.8} /> : <Send size={14} strokeWidth={1.8} />} {scheduled ? 'Schedule Send' : 'Send Now'}</>
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT — Compose ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

            {/* Priority accent stripe */}
            <div style={{ height: 3, background: priority === 'Urgent' ? '#E84855' : priority === 'Important' ? '#F59E0B' : '#6366F1', transition: 'background 0.2s' }} />

            <div style={{ padding: '28px 32px' }}>
              {/* Title */}
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Announcement title..."
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 24, fontWeight: 800, color: C.navy, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 14, boxSizing: 'border-box', caretColor: '#6366F1' }}
              />

              {/* Subject */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Subject</span>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief subject line for this announcement..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: '#5A6080', background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                />
              </div>

              {/* Message */}
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your announcement message here...&#10;&#10;You can include any updates, reminders, or communications for your selected audience."
                rows={14}
                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14.5, color: '#3D4266', lineHeight: 1.8, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', caretColor: '#6366F1' }}
              />
            </div>

            {/* Attachment upload zone */}
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '16px 32px' }}>
              <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={handleFiles} accept="image/*,.pdf,.doc,.docx" />

              {files.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {files.map((f, i) => {
                    const fc = FILE_ICON[f.ftype]
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 8px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.surface }}>
                        <div style={{ width: 26, height: 26, borderRadius: 7, background: fc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {f.ftype === 'image' ? <ImageIcon size={13} style={{ color: fc.color }} /> : <FileText size={13} style={{ color: fc.color }} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                          <div style={{ fontSize: 10.5, color: C.muted }}>{f.size}</div>
                        </div>
                        <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} style={{ width: 18, height: 18, borderRadius: 5, border: 'none', background: 'rgba(232,72,85,0.10)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              <button
                onClick={() => fileRef.current?.click()}
                style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, transition: 'color 0.14s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#6366F1' }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
              >
                <Paperclip size={14} strokeWidth={1.8} /> Attach files — Image, PDF or Document
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Settings panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Send To */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            {sectionLabel('Send To')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: audience !== 'all' ? 14 : 0 }}>
              {([
                { id: 'all',        label: 'All Employees',    icon: Users },
                { id: 'project',    label: 'Project Team',     icon: Megaphone },
                { id: 'individual', label: 'Individual Members', icon: User },
              ] as { id: AudienceType; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAudience(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', borderRadius: 10,
                    border: `1px solid ${audience === id ? '#6366F1' : C.border}`,
                    background: audience === id ? 'rgba(99,102,241,0.06)' : '#fff',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s',
                  }}
                  onMouseEnter={e => { if (audience !== id) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
                  onMouseLeave={e => { if (audience !== id) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border } }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: audience === id ? 'rgba(99,102,241,0.12)' : C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.14s' }}>
                    <Icon size={14} strokeWidth={1.8} style={{ color: audience === id ? '#6366F1' : C.muted }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: audience === id ? '#6366F1' : C.navy }}>{label}</span>
                  {audience === id && <CheckCircle size={14} strokeWidth={2} style={{ color: '#6366F1', marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>

            {/* Project select */}
            {audience === 'project' && (
              <div style={{ position: 'relative', marginTop: 10 }}>
                <select value={project} onChange={e => setProject(e.target.value)}
                  style={{ width: '100%', height: 40, padding: '0 32px 0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, fontWeight: 500, color: C.navy, background: C.surface, outline: 'none', cursor: 'pointer', appearance: 'none', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                >
                  {PROJECTS.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              </div>
            )}

            {/* Individual select */}
            {audience === 'individual' && (
              <div style={{ marginTop: 10 }}>
                {selEmps.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                    {selEmps.map(e => (
                      <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.10)', color: '#6366F1' }}>
                        {e.split(' ')[0]}
                        <button onClick={() => setSelEmps(p => p.filter(x => x !== e))} style={{ width: 13, height: 13, borderRadius: '50%', border: 'none', background: 'rgba(99,102,241,0.25)', color: '#6366F1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                          <X size={8} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ position: 'relative' }}>
                  <Search size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  <input value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="Search members..."
                    style={{ width: '100%', height: 38, paddingLeft: 30, paddingRight: 10, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
                {empSearch && empList.length > 0 && (
                  <div style={{ marginTop: 4, border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(10,12,28,0.10)' }}>
                    {empList.slice(0,5).map(e => (
                      <button key={e} onClick={() => { setSelEmps(p => [...p, e]); setEmpSearch('') }}
                        style={{ width: '100%', padding: '9px 12px', border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12.5, color: C.navy, cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={el => { el.currentTarget.style.background = C.hover }}
                        onMouseLeave={el => { el.currentTarget.style.background = 'transparent' }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Priority */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            {sectionLabel('Priority')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(['Normal','Important','Urgent'] as Priority[]).map(p => {
                const cfg = PRIORITY_CFG[p]
                const PIco = cfg.icon
                const active = priority === p
                return (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${active ? cfg.color : C.border}`, background: active ? cfg.bg : '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s' }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border } }}
                  >
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: active ? cfg.bg : C.hover, border: active ? `1px solid ${cfg.border}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <PIco size={14} strokeWidth={1.8} style={{ color: active ? cfg.color : C.muted }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: active ? cfg.color : C.navy, flex: 1, textAlign: 'left' }}>{p}</span>
                    {active && <CheckCircle size={14} strokeWidth={2} style={{ color: cfg.color }} />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            {sectionLabel('Schedule')}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: scheduled ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Schedule Send</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Send at a specific time</div>
              </div>
              <button onClick={() => setScheduled(p => !p)} style={{ width: 42, height: 23, borderRadius: 12, border: 'none', background: scheduled ? '#6366F1' : '#D0D3E4', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: scheduled ? 22 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
              </button>
            </div>
            {scheduled && (
              <input type="datetime-local" value={schedAt} onChange={e => setSchedAt(e.target.value)}
                style={{ width: '100%', height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
              />
            )}
          </div>

          {/* Preview summary */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px' }}>
            {sectionLabel('Summary')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { label: 'Audience', value: audienceLabel },
                { label: 'Priority', value: priority },
                { label: 'Delivery', value: scheduled && schedAt ? 'Scheduled' : 'Send Now' },
                { label: 'Attachments', value: files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'None' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

/* ══════════════════════════════════════════
   View Modal
══════════════════════════════════════════ */
function ViewModal({ ann, onClose }: { ann: Announcement; onClose: () => void }) {
  const pc = PRIORITY_CFG[ann.priority]
  const sc = STATUS_CFG[ann.status]
  const StatusIcon = ann.status === 'sent' ? CheckCircle : ann.status === 'scheduled' ? Clock : FileText

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 580, maxHeight: '88vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(10,12,28,0.22)', overflow: 'hidden' }}>
        <div style={{ height: 2, background: ann.priority === 'Urgent' ? '#E84855' : ann.priority === 'Important' ? '#F59E0B' : '#6366F1', flexShrink: 0 }} />
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>{ann.priority}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: sc.bg, color: sc.color, display: 'inline-flex', alignItems: 'center', gap: 4 }}><StatusIcon size={10} strokeWidth={2} />{sc.label}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, lineHeight: 1.35 }}>{ann.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{ann.subject}</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF' }} onMouseLeave={e => { e.currentTarget.style.background = C.hover }}>
            <X size={14} style={{ color: C.muted }} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '20px 24px', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Audience',   value: ann.audienceLabel },
              { label: ann.status === 'draft' ? 'Status' : ann.status === 'scheduled' ? 'Scheduled' : 'Sent', value: ann.timeLabel.replace('Scheduled: ','').replace('Draft saved: ','') },
              { label: 'Recipients', value: ann.recipients > 0 ? `${ann.recipients} members` : '—' },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 14px', borderRadius: 11, background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{m.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{m.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Message</div>
            <p style={{ fontSize: 14, color: '#3D4266', lineHeight: 1.8, margin: 0, background: C.surface, borderRadius: 12, padding: '16px 18px', border: `1px solid ${C.border}` }}>{ann.message}</p>
          </div>
          {ann.attachments.length > 0 && (
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Attachments ({ann.attachments.length})</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ann.attachments.map((f, i) => {
                  const fc = FILE_ICON[f.type]
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff' }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: fc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {f.type === 'image' ? <ImageIcon size={16} style={{ color: fc.color }} /> : <FileText size={16} style={{ color: fc.color }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{f.size}</div>
                      </div>
                      <button style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: C.surface, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Download">
                        <Download size={13} strokeWidth={1.8} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
          <button onClick={onClose} style={{ width: '100%', height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = C.surface }} onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Main Page
══════════════════════════════════════════ */
export default function ProjectAnnouncementsPage() {
  const [view, setView]               = useState<'list' | 'compose'>('list')
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS)
  const [tab, setTab]                 = useState<AnnStatus>('sent')
  const [search, setSearch]           = useState('')
  const [viewAnn, setViewAnn]         = useState<Announcement | null>(null)
  const [deleteId, setDeleteId]       = useState<number | null>(null)

  if (view === 'compose') {
    return (
      <ComposePage
        onBack={() => setView('list')}
        onPublish={ann => { setAnnouncements(p => [ann, ...p]); setView('list') }}
      />
    )
  }

  const filtered = announcements.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.audienceLabel.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)
    return matchSearch && a.status === tab
  })

  const sentCount      = announcements.filter(a => a.status === 'sent').length
  const scheduledCount = announcements.filter(a => a.status === 'scheduled').length
  const draftCount     = announcements.filter(a => a.status === 'draft').length

  function handleDelete(id: number) { setAnnouncements(p => p.filter(a => a.id !== id)); setDeleteId(null) }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Project Announcements</h1>
            {scheduledCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.10)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.20)' }}>
                <Bell size={11} /> {scheduledCount} scheduled
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>Send announcements and updates to your team or organization</p>
        </div>
        <button onClick={() => setView('compose')}
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4F52C8' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6366F1' }}>
          <Plus size={16} strokeWidth={2.5} /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Sent', value: sentCount,      color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',   hoverBg: 'rgba(14,168,106,0.14)',  icon: Send     },
          { label: 'Scheduled',  value: scheduledCount, color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  hoverBg: 'rgba(99,102,241,0.14)',  icon: Clock    },
          { label: 'Drafts',     value: draftCount,     color: '#8B90A7', bg: 'rgba(139,144,167,0.10)', hoverBg: 'rgba(139,144,167,0.18)', icon: FileText },
        ].map(({ label, value, color, bg, hoverBg, icon: Icon }) => (
          <div key={label}
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '22px 22px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'default', transition: 'box-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '0 4px 18px rgba(28,32,53,0.09)'; el.style.borderColor = '#D4D6E8'; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = hoverBg }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.borderColor = C.border; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = bg }}
          >
            <div className="stat-ico" style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
              <Icon size={20} strokeWidth={1.8} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3">
          <div style={{ position: 'relative', flexShrink: 0, width: 340 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
            />
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            {ANN_TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? C.navy : C.hover, color: tab === t.id ? '#fff' : C.muted, transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Megaphone size={32} strokeWidth={1.2} style={{ color: '#D0D3E4', marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No announcements found</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try a different filter or create a new announcement</div>
          </div>
        ) : filtered.map(ann => {
          const pc = PRIORITY_CFG[ann.priority]
          const sc = STATUS_CFG[ann.status]
          const StatusIcon = ann.status === 'sent' ? CheckCircle : ann.status === 'scheduled' ? Clock : FileText
          return (
            <div key={ann.id}
              style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,32,53,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#D8DAEC' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
            >
              <div style={{ height: 1, background: ann.priority === 'Urgent' ? '#E84855' : ann.priority === 'Important' ? '#F59E0B' : '#6366F1' }} />
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: pc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Megaphone size={18} strokeWidth={1.8} style={{ color: pc.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 800, color: C.navy, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.title}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.subject}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>{ann.priority}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: 4 }}><StatusIcon size={10} strokeWidth={2} />{sc.label}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 12.5, color: '#5A6080', margin: '0 0 10px', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.message}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
                      {ann.audience === 'all' ? <Users size={12} strokeWidth={1.8} /> : ann.audience === 'project' ? <Megaphone size={12} strokeWidth={1.8} /> : <User size={12} strokeWidth={1.8} />}
                      <span style={{ fontWeight: 600, color: '#3D4266' }}>{ann.audienceLabel}</span>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}><Clock size={11} strokeWidth={1.8} />{ann.timeLabel}</span>
                    {ann.recipients > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}><Users size={11} strokeWidth={1.8} />{ann.recipients} recipients</span>}
                    {ann.attachments.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}><Paperclip size={11} strokeWidth={1.8} />{ann.attachments.length} file{ann.attachments.length > 1 ? 's' : ''}</span>}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewAnn(ann)} title="View" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#6366F1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}><Eye size={14} strokeWidth={1.8} /></button>
                      <button onClick={() => setDeleteId(ann.id)} title="Delete" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}><Trash2 size={14} strokeWidth={1.8} /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {viewAnn && <ViewModal ann={viewAnn} onClose={() => setViewAnn(null)} />}

      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px 24px', width: 380, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete Announcement</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>Are you sure you want to delete this announcement?<br />This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: '#E84855', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.background = '#D43F4B' }} onMouseLeave={e => { e.currentTarget.style.background = '#E84855' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
