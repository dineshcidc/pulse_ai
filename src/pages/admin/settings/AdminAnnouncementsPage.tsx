import React, { useState, useRef } from 'react'
import {
  Megaphone, Send, Clock, FileText, Paperclip, User,
  Search, Plus, X, ChevronDown, Calendar, Trash2,
  CheckCircle, Download, Bell, Image as ImageIcon, ArrowLeft,
  AlertTriangle, Info, Tag, Building2, Trophy, Layers, Users, Link2, Eye,
} from 'lucide-react'
import ImageUploadCard from '../../../components/ImageUploadCard'
import ImageCarouselModal from '../../../components/ImageCarouselModal'

/* ── Types ── */
type AudienceType = 'all' | 'project' | 'individual'
type Priority     = 'Normal' | 'Important' | 'Urgent'
type AnnStatus    = 'sent' | 'scheduled' | 'draft'
type ContentType  = 'announcement' | 'reward' | 'poster'

interface AnnFile { name: string; type: 'image' | 'pdf' | 'doc' | 'link'; size: string; url?: string }
interface Announcement {
  id: number; title: string; subject: string; message: string
  audience: AudienceType; audienceLabel: string; priority: Priority
  status: AnnStatus; timeLabel: string; recipients: number; attachments: AnnFile[]
  contentType: ContentType; images?: string[]; duration?: string
}

/* ── Mock data ── */
const ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Company-Wide Holiday — June 19, 2026', subject: 'Public Holiday Notification for All Employees', message: 'This is to notify all employees that June 19, 2026 is a declared public holiday. All offices will remain closed. Employees on active project deadlines are requested to plan accordingly and inform their respective managers in advance.', audience: 'all', audienceLabel: 'All Employees', priority: 'Important', status: 'sent', timeLabel: 'Jun 1, 2026 · 9:00 AM', recipients: 42, attachments: [{ name: 'Holiday_Notice.jpg', type: 'image', size: '2.8 MB' }], contentType: 'announcement' },
  { id: 2, title: 'New HR Policy — Remote Work Guidelines', subject: 'Updated Work-From-Home Policy Effective July 1', message: 'The management has approved an updated remote work policy effective July 1, 2026. All employees are requested to review the attached policy document. Key changes include updated attendance tracking for WFH days and revised approval workflows.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'sent', timeLabel: 'May 28, 2026 · 11:00 AM', recipients: 42, attachments: [{ name: 'WFH_Policy_2026.pdf', type: 'pdf', size: '1.4 MB' }], contentType: 'announcement' },
  { id: 3, title: 'Office Relocation — Bengaluru Team', subject: 'New Office Address Effective June 10', message: 'The Bengaluru office will relocate to a new address effective June 10, 2026. All Bengaluru-based employees are requested to update their emergency contact records and inform their clients/vendors of the new address. Transportation support will be provided for the first week.', audience: 'all', audienceLabel: 'All Employees', priority: 'Urgent', status: 'sent', timeLabel: 'May 25, 2026 · 3:00 PM', recipients: 42, attachments: [{ name: 'Office Details & Map', type: 'link', size: 'External', url: 'https://maps.example.com/bengaluru-office' }], contentType: 'announcement' },
  { id: 4, title: 'June Month Winners', subject: 'Recognition for Outstanding Performance', message: 'Recognition for outstanding performance in June 2026. Celebrating employees who exceeded expectations.', audience: 'all', audienceLabel: 'All Employees', priority: 'Important', status: 'sent', timeLabel: 'Jun 15, 2026 · 10:30 AM', recipients: 42, attachments: [], contentType: 'reward', images: ['reward-image-1.jpg', 'reward-image-2.jpg'], duration: '20 days' },
  { id: 4.5, title: 'Q2 Excellence Award', subject: 'Team Performance Recognition', message: 'Recognizing exceptional contributions and team excellence in Q2 2026. Outstanding work across all departments.', audience: 'all', audienceLabel: 'All Employees', priority: 'Important', status: 'sent', timeLabel: 'Jun 10, 2026 · 2:15 PM', recipients: 42, attachments: [], contentType: 'reward', images: ['award-image-1.jpg', 'award-image-2.jpg', 'award-image-3.jpg'], duration: '15 days' },
  { id: 4.6, title: 'Employee of the Month - May', subject: 'Special Recognition', message: 'Celebrating our Employee of the Month for May 2026. Exceptional dedication and outstanding performance throughout the month.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'sent', timeLabel: 'Jun 1, 2026 · 9:45 AM', recipients: 42, attachments: [], contentType: 'reward', images: ['employee-month-1.jpg'], duration: '10 days' },
  { id: 5, title: 'Mother\'s Day Celebration 2026', subject: 'Special Event Poster', message: 'Join us for a special Mother\'s Day celebration. We\'re honoring all mothers in our organization with special gifts and recognition.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'sent', timeLabel: 'May 20, 2026 · 2:00 PM', recipients: 42, attachments: [], contentType: 'poster', images: ['mothers-day-poster-1.jpg', 'mothers-day-poster-2.jpg', 'mothers-day-poster-3.jpg'], duration: '18 days' },
  { id: 6, title: 'Annual Performance Reviews — July 2026', subject: 'Self-Assessment Forms Now Open', message: 'Annual performance review forms are now open on the HR portal. All employees must complete their self-assessment by June 30, 2026. Managers will schedule one-on-one review sessions in the first two weeks of July.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'draft', timeLabel: 'Draft saved: May 30, 2026', recipients: 0, attachments: [{ name: 'Self_Assessment_Form.pdf', type: 'pdf', size: '560 KB' }], contentType: 'announcement' },
  { id: 7, title: 'Pulse.AI v2 — Q3 Roadmap Kickoff', subject: 'Project Kickoff Meeting — June 5, 2026', message: 'The Q3 roadmap for Pulse.AI v2 has been finalized. All team members assigned to this project are required to attend the kickoff meeting. Check the external documentation link for the full agenda and resources.', audience: 'project', audienceLabel: 'Pulse.AI v2 Team', priority: 'Important', status: 'scheduled', timeLabel: 'Scheduled: Jun 5, 2026 · 10:00 AM', recipients: 0, attachments: [{ name: 'Project Documentation', type: 'link', size: 'External', url: 'https://docs.example.com/pulse-ai-v2' }], contentType: 'announcement' },
  { id: 8, title: 'Yoga Day Event 2026', subject: 'International Yoga Day Poster', message: 'Celebrating International Yoga Day with free yoga classes and wellness sessions. Register now to join us.', audience: 'all', audienceLabel: 'All Employees', priority: 'Normal', status: 'scheduled', timeLabel: 'Scheduled: Jun 21, 2026 · 8:00 AM', recipients: 0, attachments: [], contentType: 'poster', images: [] },
]

const PROJECTS  = ['Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP', 'SwiftPay App', 'RetailEdge Platform']
const EMPLOYEES = ['Sarah Johnson','Mike Chen','Emma Wilson','David Brown','Lisa Garcia','Tom Davis','Priya Sharma','James Wilson','Anjali Singh','Karthik Nair','Ravi Kumar','Nisha Patel','Arjun Mehta','Divya Rao','Sanjay Gupta']

const PRIORITY_CFG: Record<Priority, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Normal:    { color: '#0A8A58', bg: 'rgba(14,168,106,0.10)',  border: 'rgba(14,168,106,0.22)',  icon: Info          },
  Important: { color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)',  icon: AlertTriangle },
  Urgent:    { color: '#E84855', bg: 'rgba(232,72,85,0.09)',   border: 'rgba(232,72,85,0.20)',   icon: Tag           },
}
const STATUS_CFG: Record<AnnStatus, { label: string; color: string; bg: string; border?: string }> = {
  sent:      { label: 'Sent',      color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.22)' },
  scheduled: { label: 'Scheduled', color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.22)' },
  draft:     { label: 'Draft',     color: '#8B90A7', bg: 'rgba(139,144,167,0.12)', border: 'rgba(139,144,167,0.22)' },
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
  const [activeTab, setActiveTab] = useState<ContentType>('announcement')

  // Announcement form state
  const [title, setTitle]         = useState('')
  const [subject, setSubject]     = useState('')
  const [message, setMessage]     = useState('')
  const [audience, setAudience]   = useState<AudienceType>('all')
  const [project, setProject]     = useState(PROJECTS[0])
  const [empSearch, setEmpSearch] = useState('')
  const [selEmps, setSelEmps]     = useState<string[]>([])
  const [priority, setPriority]   = useState<Priority>('Normal')
  const [scheduled, setScheduled] = useState(false)
  const [schedDate, setSchedDate] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [files, setFiles]         = useState<{ name: string; size: string; ftype: 'image'|'pdf'|'doc'; preview?: string }[]>([])

  // Reward/Poster form state
  const [rewardData, setRewardData] = useState({
    tagName: '',
    description: '',
    images: [] as { name: string; size: string; preview: string }[],
    visibilityDays: '7',
    scheduled: false,
    scheduleDate: '',
    scheduleTime: '',
  })

  const [sending, setSending]     = useState(false)
  const [viewingImages, setViewingImages] = useState<string[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const empList = EMPLOYEES.filter(e => e.toLowerCase().includes(empSearch.toLowerCase()) && !selEmps.includes(e))

  const audienceLabel =
    audience === 'all'     ? 'All Employees' :
    audience === 'project' ? `${project} Team` :
    selEmps.length > 0     ? selEmps.slice(0,2).join(', ') + (selEmps.length > 2 ? ` +${selEmps.length-2}` : '') :
    'No members selected'

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    picked.forEach(f => {
      const ftype = (f.type.startsWith('image') ? 'image' : f.name.endsWith('.pdf') ? 'pdf' : 'doc') as 'image'|'pdf'|'doc'
      if (ftype === 'image') {
        const reader = new FileReader()
        reader.onload = (event) => {
          setFiles(prev => [...prev, {
            name: f.name,
            size: f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
            ftype: 'image',
            preview: event.target?.result as string,
          }])
        }
        reader.readAsDataURL(f)
      } else {
        setFiles(prev => [...prev, {
          name: f.name,
          size: f.size > 1024*1024 ? `${(f.size/1024/1024).toFixed(1)} MB` : `${Math.round(f.size/1024)} KB`,
          ftype,
        }])
      }
    })
    e.target.value = ''
  }

  function handleRewardImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setRewardData(p => ({
          ...p,
          images: [...p.images, {
            name: file.name,
            size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
            preview: event.target?.result as string,
          }]
        }))
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }


  async function handleSend(asDraft = false) {
    setSending(true)
    await new Promise(r => setTimeout(r, 1100))

    if (activeTab === 'announcement') {
      onPublish({
        id: Date.now(),
        title: title || 'Untitled Announcement',
        subject: subject || '(no subject)',
        message, audience, audienceLabel, priority,
        status: asDraft ? 'draft' : scheduled ? 'scheduled' : 'sent',
        timeLabel: asDraft
          ? `Draft saved: ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`
          : scheduled && schedDate && schedTime
          ? `Scheduled: ${new Date(schedDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${schedTime}`
          : `${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`,
        recipients: asDraft ? 0 : audience === 'all' ? 42 : audience === 'project' ? 8 : selEmps.length,
        attachments: files.map(f => ({ name: f.name, type: f.ftype, size: f.size })),
        contentType: 'announcement',
        images: [],
      })
    } else {
      onPublish({
        id: Date.now(),
        title: rewardData.tagName || 'Untitled',
        subject: '',
        message: rewardData.description,
        audience: 'all',
        audienceLabel: 'All Employees',
        priority: 'Normal',
        status: asDraft ? 'draft' : rewardData.scheduled ? 'scheduled' : 'sent',
        timeLabel: asDraft
          ? `Draft saved: ${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`
          : rewardData.scheduled && rewardData.scheduleDate && rewardData.scheduleTime
          ? `Scheduled: ${new Date(rewardData.scheduleDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${rewardData.scheduleTime}`
          : `${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} · ${new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})}`,
        recipients: asDraft ? 0 : 42,
        attachments: [],
        contentType: activeTab,
        images: rewardData.images.map(img => img.preview),
        duration: `${rewardData.visibilityDays} days`,
      })
    }
    setSending(false)
    onBack()
  }

  const sectionLabel = (text: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>{text}</div>
  )

  const canSend = activeTab === 'announcement'
    ? title.trim().length > 0
    : rewardData.tagName.trim().length > 0 && rewardData.images.length > 0

  const tabConfig = [
    { id: 'announcement' as ContentType, label: 'Announcement' },
    { id: 'reward' as ContentType, label: 'Rewards & Recognition' },
    { id: 'poster' as ContentType, label: 'Poster' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>

      {/* ── Breadcrumb ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.14s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={16} strokeWidth={2} style={{ color: C.navy }} />
        </button>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/</span>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>Announcements</span>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/</span>
        <span style={{ fontSize: 13, color: C.navy, fontWeight: 600 }}>New Announcement</span>
      </div>

      {/* ── Tabs Section with White Card ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 20, width: '100%' }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '0 16px', display: 'flex', gap: 0, width: 'fit-content' }}>
          {tabConfig.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #6366F1' : 'none',
                color: activeTab === tab.id ? '#6366F1' : C.muted,
                fontSize: 13.5,
                fontWeight: activeTab === tab.id ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = C.navy }}
              onMouseLeave={e => { if (activeTab !== tab.id) (e.currentTarget as HTMLElement).style.color = C.muted }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleSend(true)}
            disabled={sending || !canSend}
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: canSend ? C.navy : C.muted, fontSize: 13.5, fontWeight: 600, cursor: canSend ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { if (canSend && !sending) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <FileText size={14} strokeWidth={1.8} /> Save Draft
          </button>
          <button
            onClick={() => handleSend(false)}
            disabled={sending || !canSend}
            style={{ height: 40, padding: '0 22px', borderRadius: 10, border: 'none', background: canSend && !sending ? '#6366F1' : 'rgba(99,102,241,0.35)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: canSend && !sending ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s', flexShrink: 0 }}
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
              <>
                {scheduled ? <Calendar size={14} strokeWidth={1.8} /> : <Send size={14} strokeWidth={1.8} />}
                {scheduled ? 'Schedule Send' : 'Send Now'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Announcement Form ── */}
      {activeTab === 'announcement' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT — Compose ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

            <div style={{ height: 3, background: priority === 'Urgent' ? '#E84855' : priority === 'Important' ? '#F59E0B' : '#6366F1', transition: 'background 0.2s' }} />

            <div style={{ padding: '28px 32px' }}>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Announcement title..."
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 24, fontWeight: 800, color: C.navy, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 14, boxSizing: 'border-box', caretColor: '#6366F1' }}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0 }}>Subject</span>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief subject line for this announcement..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13.5, color: '#5A6080', background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                />
              </div>

              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your announcement message here...&#10;&#10;You can include any updates, reminders, or company-wide communications for your selected audience."
                rows={9}
                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14.5, color: '#3D4266', lineHeight: 1.8, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', caretColor: '#6366F1' }}
              />
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 32px' }}>
              <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={handleFiles} accept="image/*,.pdf,.doc,.docx" />

              {files.length === 0 ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed #D0D3E4`,
                    borderRadius: 12,
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#F8F9FB',
                    transition: 'all 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#6366F1'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#F8F9FB'
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#D0D3E4'
                  }}
                >
                  <Paperclip size={32} style={{ color: '#8B90A7', marginBottom: 10 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Drop files here or click to browse</p>
                  <p style={{ fontSize: 11.5, color: C.muted, margin: 0 }}>Images, PDF or Documents up to 10MB each</p>
                </div>
              ) : (
                <div>
                  {/* Images Section */}
                  {files.filter(f => f.ftype === 'image').length > 0 && (
                    <div style={{ marginBottom: files.filter(f => f.ftype !== 'image').length > 0 ? 20 : 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: 12 }}>Images ({files.filter(f => f.ftype === 'image').length})</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {files.filter(f => f.ftype === 'image').map((f) => (
                          <ImageUploadCard
                            key={`${f.name}-${f.preview}`}
                            name={f.name}
                            size={f.size}
                            preview={f.preview || ''}
                            onDelete={() => setFiles(p => p.filter(file => file.preview !== f.preview || file.name !== f.name || file.ftype !== 'image'))}
                            onView={() => setViewingImages(files.filter(x => x.ftype === 'image' && x.preview).map(x => x.preview!))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Files Section */}
                  {files.filter(f => f.ftype !== 'image').length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: 12 }}>Other Files ({files.filter(f => f.ftype !== 'image').length})</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
                        {files.filter(f => f.ftype !== 'image').map((f) => {
                          const fc = FILE_ICON[f.ftype]
                          const actualIdx = files.indexOf(f)
                          return (
                            <div key={actualIdx} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff' }}>
                              <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: fc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                  <FileText size={48} style={{ color: fc.color }} />
                                </div>
                              </div>

                              <div style={{ padding: '10px' }}>
                                <p style={{ fontSize: 10, fontWeight: 600, color: C.navy, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</p>
                                <p style={{ fontSize: 9, color: C.muted, margin: 0 }}>{f.size}</p>
                              </div>

                              <button
                                onClick={() => setFiles(p => p.filter((_, i) => i !== actualIdx))}
                                style={{ position: 'absolute', top: 6, right: 6, width: 28, height: 28, borderRadius: 6, border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s', fontSize: 14, zIndex: 10 }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.85)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.6)' }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ marginTop: 12, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                  >
                    + Add More Files
                  </button>
                </div>
              )}
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
                { id: 'all',        label: 'All Employees',    desc: 'Entire organization', icon: Building2 },
                { id: 'project',    label: 'Project Team',     desc: 'Specific project team', icon: Megaphone },
                { id: 'individual', label: 'Individual Employee', desc: 'One or more people', icon: User },
              ] as { id: AudienceType; label: string; desc: string; icon: React.ElementType }[]).map(({ id, label, desc, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setAudience(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', borderRadius: 10,
                    border: `1px solid ${audience === id ? '#6366F1' : C.border}`,
                    background: audience === id ? 'rgba(99,102,241,0.06)' : '#fff',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s', textAlign: 'left',
                  }}
                  onMouseEnter={e => { if (audience !== id) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
                  onMouseLeave={e => { if (audience !== id) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border } }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: audience === id ? 'rgba(99,102,241,0.12)' : C.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.14s' }}>
                    <Icon size={15} strokeWidth={1.8} style={{ color: audience === id ? '#6366F1' : C.muted }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: audience === id ? '#6366F1' : C.navy }}>{label}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{desc}</div>
                  </div>
                  {audience === id && <CheckCircle size={14} strokeWidth={2} style={{ color: '#6366F1', flexShrink: 0 }} />}
                </button>
              ))}
            </div>

            {/* Project select */}
            {audience === 'project' && (
              <div style={{ position: 'relative', marginTop: 4 }}>
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
              <div style={{ marginTop: 4 }}>
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
                  <input value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="Search employees..."
                    style={{ width: '100%', height: 38, paddingLeft: 30, paddingRight: 10, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
                {empSearch && empList.length > 0 && (
                  <div style={{ marginTop: 4, border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 14px rgba(10,12,28,0.10)' }}>
                    {empList.slice(0,6).map(e => (
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                  <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)}
                    style={{ width: '100%', height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</label>
                  <input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)}
                    style={{ width: '100%', height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      )}

      {/* ── Reward/Poster Form ── */}
      {activeTab !== 'announcement' && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT — Compose ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

            {/* Color bar - Theme Blue */}
            <div style={{ height: 3, background: '#6366F1', transition: 'background 0.2s' }} />

            <div style={{ padding: '28px 32px' }}>
              {/* Tag Name */}
              <input
                value={rewardData.tagName}
                onChange={e => setRewardData({ ...rewardData, tagName: e.target.value })}
                placeholder={activeTab === 'reward' ? 'Recognition tag (e.g., June Month Winners)...' : 'Poster title (e.g., Team Event, Holiday Announcement)...'}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 24, fontWeight: 800, color: C.navy, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 14, boxSizing: 'border-box', caretColor: '#6366F1' }}
              />

              {/* Description */}
              <textarea
                value={rewardData.description}
                onChange={e => setRewardData({ ...rewardData, description: e.target.value })}
                placeholder={activeTab === 'reward' ? 'Write a description about this recognition...' : 'Write a description about this poster...'}
                rows={6}
                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14.5, color: '#3D4266', lineHeight: 1.8, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', caretColor: '#6366F1' }}
              />
            </div>

            {/* File Upload Section */}
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 32px' }}>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleRewardImageUpload} style={{ display: 'none' }} />

              {rewardData.images.length === 0 ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed #D0D3E4`,
                    borderRadius: 12,
                    padding: '28px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: '#F8F9FB',
                    transition: 'all 0.15s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#6366F1'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = '#F8F9FB'
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#D0D3E4'
                  }}
                >
                  <ImageIcon size={32} style={{ color: '#8B90A7', marginBottom: 10 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Drop images here or click to browse</p>
                  <p style={{ fontSize: 11.5, color: C.muted, margin: 0 }}>PNG, JPG, GIF up to 10MB each</p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: 8 }}>Uploaded Images ({rewardData.images.length})</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {rewardData.images.map((img, idx) => (
                      <ImageUploadCard
                        key={idx}
                        name={img.name}
                        size={img.size}
                        preview={img.preview}
                        onDelete={() => setRewardData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                        onView={() => setViewingImages(rewardData.images.map(img => img.preview))}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{ marginTop: 12, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                  >
                    + Add More Images
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Send To */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Send To</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid #6366F1`, background: 'rgba(99,102,241,0.06)', cursor: 'default', fontFamily: 'inherit' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={15} strokeWidth={1.8} style={{ color: '#6366F1' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#6366F1' }}>All Employees</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Entire organization</div>
              </div>
            </div>
          </div>

          {/* Visibility Period */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Visibility</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8 }}>How many days should this be visible?</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={rewardData.visibilityDays}
                    onChange={e => setRewardData({ ...rewardData, visibilityDays: e.target.value })}
                    style={{
                      flex: 1,
                      height: 38,
                      padding: '0 10px',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      fontSize: 13,
                      color: C.navy,
                      background: C.surface,
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>days</span>
                </div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(99,102,241,0.10)', border: `1px solid rgba(99,102,241,0.20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={20} strokeWidth={1.8} style={{ color: '#6366F1' }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
              Will be hidden after {rewardData.visibilityDays} day{rewardData.visibilityDays !== '1' ? 's' : ''}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Schedule</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: rewardData.scheduled ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Schedule Send</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Send at a specific time</div>
              </div>
              <button
                onClick={() => setRewardData(p => ({ ...p, scheduled: !p.scheduled }))}
                style={{
                  width: 42,
                  height: 23,
                  borderRadius: 12,
                  border: 'none',
                  background: rewardData.scheduled ? '#6366F1' : '#D0D3E4',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: rewardData.scheduled ? 22 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
              </button>
            </div>
            {rewardData.scheduled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                  <input
                    type="date"
                    value={rewardData.scheduleDate}
                    onChange={e => setRewardData({ ...rewardData, scheduleDate: e.target.value })}
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 10px',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      fontSize: 13,
                      color: C.navy,
                      background: C.surface,
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</label>
                  <input
                    type="time"
                    value={rewardData.scheduleTime}
                    onChange={e => setRewardData({ ...rewardData, scheduleTime: e.target.value })}
                    style={{
                      width: '100%',
                      height: 38,
                      padding: '0 10px',
                      border: `1px solid ${C.border}`,
                      borderRadius: 9,
                      fontSize: 13,
                      color: C.navy,
                      background: C.surface,
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Images Carousel Modal */}
      {viewingImages && <ImageCarouselModal images={viewingImages} onClose={() => setViewingImages(null)} />}

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
                      <button style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: C.surface, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
export default function AdminAnnouncementsPage() {
  const [view, setView]                   = useState<'list' | 'compose'>('list')
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS)
  const [tab, setTab]                     = useState<AnnStatus>('sent')
  const [search, setSearch]               = useState('')
  const [viewAnn, setViewAnn]             = useState<Announcement | null>(null)
  const [deleteId, setDeleteId]           = useState<number | null>(null)
  const [contentType, setContentType]     = useState<'all' | ContentType>('all')

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentMonth = new Date().getMonth()
  const [selectedMonth, setSelectedMonth] = useState<string>(months[currentMonth])

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
    const matchType = contentType === 'all' || a.contentType === contentType
    return matchSearch && a.status === tab && matchType
  })

  const totalSent = announcements.filter(a => a.status === 'sent').length
  const announcementCount = announcements.filter(a => a.contentType === 'announcement').length
  const rewardCount = announcements.filter(a => a.contentType === 'reward').length
  const posterCount = announcements.filter(a => a.contentType === 'poster').length
  const scheduledCount = announcements.filter(a => a.status === 'scheduled').length

  function handleDelete(id: number) { setAnnouncements(p => p.filter(a => a.id !== id)); setDeleteId(null) }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Announcements</h1>
            {scheduledCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.10)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.20)' }}>
                <Bell size={11} /> {scheduledCount} scheduled
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: '#787878', fontWeight: 500 }}>Create and broadcast announcements to your entire organization, teams, or individuals</p>
        </div>
        <button onClick={() => setView('compose')}
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
          <Plus size={16} strokeWidth={2.5} /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Sent',              value: totalSent,         color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',   hoverBg: 'rgba(14,168,106,0.14)',  icon: Send       },
          { label: 'Announcements',           value: announcementCount, color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  hoverBg: 'rgba(99,102,241,0.14)',  icon: Megaphone  },
          { label: 'Rewards & Recognition',   value: rewardCount,       color: '#D97706', bg: 'rgba(217,119,6,0.08)',   hoverBg: 'rgba(217,119,6,0.14)',   icon: Trophy     },
          { label: 'Posters',                 value: posterCount,       color: '#0891B2', bg: 'rgba(8,145,178,0.08)',   hoverBg: 'rgba(8,145,178,0.14)',   icon: Layers     },
        ].map(({ label, value, color, bg, hoverBg, icon: Icon }) => (
          <div key={label}
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'default', transition: 'box-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '0 4px 18px rgba(28,32,53,0.09)'; el.style.borderColor = '#D4D6E8'; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = hoverBg }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.borderColor = C.border; const ico = el.querySelector('.stat-ico') as HTMLElement; if (ico) ico.style.background = bg }}
          >
            <div className="stat-ico" style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
              <Icon size={19} strokeWidth={1.8} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>{label}</div>
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
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
              style={{ height: 38, paddingLeft: 12, paddingRight: 32, borderRadius: 9, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', appearance: 'none', outline: 'none', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              {months.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select value={contentType} onChange={e => setContentType(e.target.value as 'all' | ContentType)}
              style={{ height: 38, paddingLeft: 12, paddingRight: 32, borderRadius: 9, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', appearance: 'none', outline: 'none', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="reward">Rewards & Recognition</option>
              <option value="poster">Posters</option>
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
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
          const statusConfig = ann.status === 'sent' ? { bg: 'rgba(14,168,106,0.10)', color: '#0A8A58', label: '✓ Sent', border: 'rgba(14,168,106,0.22)' } : ann.status === 'scheduled' ? { bg: 'rgba(99,102,241,0.10)', color: '#6366F1', label: '📅 Scheduled', border: 'rgba(99,102,241,0.22)' } : { bg: 'rgba(139,144,167,0.12)', color: '#8B90A7', label: '📝 Draft', border: 'rgba(139,144,167,0.22)' }

          // ANNOUNCEMENT CARD
          if (ann.contentType === 'announcement') {
            const pc = PRIORITY_CFG[ann.priority]
            const sc = STATUS_CFG[ann.status]
            const StatusIcon = ann.status === 'sent' ? CheckCircle : ann.status === 'scheduled' ? Clock : FileText
            // Light yellow for announcement icons (consistent across all)
            const annIconBg = 'rgba(245,158,11,0.10)'
            const annIconColor = '#D97706'

            return (
              <div key={ann.id}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,32,53,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#D8DAEC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
              >
                <div style={{ height: 1, background: '#F59E0B' }} />
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: annIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Megaphone size={18} strokeWidth={1.8} style={{ color: annIconColor }} />
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
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#3D4266' }}>
                        <Users size={12} strokeWidth={1.8} style={{ color: C.muted }} />
                        {ann.audienceLabel}
                      </span>
                      {ann.attachments && ann.attachments.length > 0 && ann.attachments.map((att, idx) => (
                        <button
                          key={idx}
                          onClick={() => att.url && window.open(att.url, '_blank')}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: 'rgba(139,144,167,0.10)', color: '#6B7280', border: 'none', cursor: att.url ? 'pointer' : 'default', transition: 'all 0.14s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.18)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.10)' }}
                        >
                          {att.type === 'image' && (
                            <>
                              <ImageIcon size={12} strokeWidth={1.8} />
                              Image
                            </>
                          )}
                          {att.type === 'pdf' && (
                            <>
                              <FileText size={12} strokeWidth={1.8} />
                              PDF
                            </>
                          )}
                          {att.type === 'link' && (
                            <>
                              <Link2 size={12} strokeWidth={1.8} />
                              Link
                            </>
                          )}
                          {att.type === 'doc' && (
                            <>
                              <FileText size={12} strokeWidth={1.8} />
                              Document
                            </>
                          )}
                        </button>
                      ))}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
                        <Clock size={11} strokeWidth={1.8} />
                        {ann.timeLabel}
                      </span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                        <button title="View" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(139,144,167,0.10)', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.10)' }}>
                          <Eye size={14} strokeWidth={1.8} />
                        </button>
                        <button onClick={() => setDeleteId(ann.id)} title="Delete" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(139,144,167,0.10)', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.10)' }}>
                          <Trash2 size={14} strokeWidth={1.8} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // REWARD & POSTER CARD (Using Rewards & Recognition design)
          let iconBg, iconColor, topBorderColor

          if (ann.contentType === 'reward') {
            iconBg = statusConfig.bg
            iconColor = statusConfig.color
            topBorderColor = '#0A8A58'
          } else { // poster
            iconBg = 'rgba(8,145,178,0.10)'
            iconColor = '#0891B2'
            topBorderColor = '#0891B2'
          }

          return (
            <div key={ann.id}
              style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,32,53,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#D8DAEC' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
            >
              <div style={{ height: 1, background: topBorderColor }} />
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {ann.contentType === 'reward' && <Trophy size={18} strokeWidth={1.8} style={{ color: iconColor }} />}
                  {ann.contentType === 'poster' && <Layers size={18} strokeWidth={1.8} style={{ color: iconColor }} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{ann.title}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`, flexShrink: 0 }}>{statusConfig.label}</span>
                  </div>

                  <p style={{ fontSize: 12.5, color: '#5A6080', margin: '0 0 10px', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ann.message}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    {/* Sent To for Rewards/Posters */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#3D4266' }}>
                      <Users size={12} strokeWidth={1.8} style={{ color: C.muted }} />
                      {ann.audienceLabel}
                    </span>

                    {/* Images Badge */}
                    {ann.images && ann.images.length > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: 'rgba(139,144,167,0.10)', color: '#6B7280' }}>
                        <ImageIcon size={12} strokeWidth={1.8} />
                        {ann.images.length} image{ann.images.length > 1 ? 's' : ''}
                      </span>
                    )}

                    {/* Date & Time */}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
                      <Clock size={11} strokeWidth={1.8} />
                      {ann.timeLabel}
                    </span>

                    {/* Duration */}
                    {ann.duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
                        <Calendar size={11} strokeWidth={1.8} />
                        {ann.duration}
                      </span>
                    )}

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button title="View" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(139,144,167,0.10)', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.10)' }}>
                        <Eye size={14} strokeWidth={1.8} />
                      </button>
                      <button title="Delete" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(139,144,167,0.10)', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.10)' }} onClick={() => setDeleteId(ann.id)}>
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
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
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24, whiteSpace: 'nowrap' }}>Are you sure you want to delete this announcement?</p>
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
