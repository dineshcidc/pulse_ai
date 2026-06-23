import { useState } from 'react'
import { Trophy, Plus, Search, Send, Clock, FileText, Trash2, Image as ImageIcon, Edit2, ChevronDown } from 'lucide-react'
import NewRecognitionPage from './NewRecognitionPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

interface RecognitionItem {
  id: number
  tagName: string
  title: string
  description: string
  status: 'sent' | 'scheduled' | 'draft'
  date: string
  recipients: number
  imageCount: number
  images: string[]
}

const SAMPLE_IMAGES = [
  '/Rewardimage-1.png',
  '/Rewardimage-2.png',
  '/Rewardimage-3.png',
  '/Rewardimage-4.png',
  '/Rewardimage-5.png',
]

export default function RewardsAndRecognitionPage() {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const [view, setView] = useState<'list' | 'compose'>('list')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('sent')
  const [selectedMonth, setSelectedMonth] = useState<string>(months[currentMonth])
  const [viewingImages, setViewingImages] = useState<{ id: number; count: number; images: string[] } | null>(null)
  const [currentImageIdx, setCurrentImageIdx] = useState(0)

  if (view === 'compose') {
    return <NewRecognitionPage onBack={() => setView('list')} />
  }

  // Sample recognition data with images
  const recognitions: RecognitionItem[] = [
    {
      id: 1,
      tagName: 'June Month Winners',
      title: 'Congratulations to our Rising Stars!',
      description: 'Recognition for outstanding performance in June 2026. Celebrating employees who exceeded expectations.',
      status: 'sent',
      date: 'Jun 15, 2026 · 10:30 AM',
      recipients: 42,
      imageCount: 2,
      images: [SAMPLE_IMAGES[0], SAMPLE_IMAGES[1]],
    },
    {
      id: 2,
      tagName: 'Employee Excellence Awards',
      title: 'Quarter Excellence Recognition',
      description: 'Honoring top performers who demonstrated excellence in their roles during Q2 2026.',
      status: 'sent',
      date: 'Jun 10, 2026 · 02:15 PM',
      recipients: 38,
      imageCount: 3,
      images: [SAMPLE_IMAGES[2], SAMPLE_IMAGES[3], SAMPLE_IMAGES[4]],
    },
    {
      id: 3,
      tagName: 'Mid-Year Recognition',
      title: 'Happy Mid-Year Milestone!',
      description: 'Celebrating the first half of 2026 with recognition for outstanding contributions.',
      status: 'scheduled',
      date: 'Scheduled: Jun 30, 2026 · 09:00 AM',
      recipients: 0,
      imageCount: 2,
      images: [SAMPLE_IMAGES[1], SAMPLE_IMAGES[2]],
    },
    {
      id: 4,
      tagName: 'Draft Recognition',
      title: 'Team Appreciation',
      description: 'Recognizing the amazing teamwork and collaboration across departments.',
      status: 'draft',
      date: 'Draft saved: Jun 18, 2026',
      recipients: 0,
      imageCount: 3,
      images: [SAMPLE_IMAGES[3], SAMPLE_IMAGES[4], SAMPLE_IMAGES[0]],
    },
  ]

  const sentCount = recognitions.filter(r => r.status === 'sent').length
  const scheduledCount = recognitions.filter(r => r.status === 'scheduled').length
  const draftCount = recognitions.filter(r => r.status === 'draft').length

  const TABS = [
    { id: 'sent', label: 'Sent' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'draft', label: 'Drafts' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Rewards and Recognition</h1>
            {scheduledCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(99,102,241,0.10)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.20)' }}>
                <Trophy size={11} /> {scheduledCount} scheduled
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: '#787878', fontWeight: 500 }}>Create and manage recognition programs for your organization</p>
        </div>
        <button
          type="button"
          onClick={() => setView('compose')}
          style={{
            height: 40,
            padding: '0 18px',
            borderRadius: 11,
            border: 'none',
            background: C.navy,
            color: '#fff',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            transition: 'background 0.15s',
            flexShrink: 0
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
          onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
        >
          <Plus size={16} strokeWidth={2.5} /> New Recognition
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Sent',   value: sentCount,        color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',   hoverBg: 'rgba(14,168,106,0.14)',  icon: Send       },
          { label: 'Scheduled',    value: scheduledCount,   color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  hoverBg: 'rgba(99,102,241,0.14)',  icon: Clock      },
          { label: 'Drafts',       value: draftCount,       color: '#8B90A7', bg: 'rgba(139,144,167,0.10)', hoverBg: 'rgba(139,144,167,0.18)', icon: FileText   },
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search rewards..."
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
          <div className="flex items-center gap-1.5 ml-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? C.navy : C.hover, color: tab === t.id ? '#fff' : C.muted, transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Recognition Cards List - Full Width */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recognitions
          .filter(r => r.status === tab && (!search || r.tagName.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase())))
          .length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            <Trophy size={32} strokeWidth={1.2} style={{ color: '#D0D3E4', marginBottom: 12 }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No recognitions found</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try a different filter or create a new recognition</div>
          </div>
        ) : recognitions
          .filter(r => r.status === tab && (!search || r.tagName.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase())))
          .map(recognition => {
            const statusConfig = recognition.status === 'sent' ? { bg: 'rgba(14,168,106,0.10)', color: '#0A8A58', label: '✓ Sent', border: 'rgba(14,168,106,0.22)' } : recognition.status === 'scheduled' ? { bg: 'rgba(99,102,241,0.10)', color: '#6366F1', label: '📅 Scheduled', border: 'rgba(99,102,241,0.22)' } : { bg: 'rgba(139,144,167,0.12)', color: '#8B90A7', label: '📝 Draft', border: 'rgba(139,144,167,0.22)' }
            return (
              <div key={recognition.id}
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', transition: 'box-shadow 0.15s, border-color 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(28,32,53,0.08)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#D8DAEC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}
              >
                <div style={{ height: 1, background: '#6366F1' }} />
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  {/* Icon */}
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: statusConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Trophy size={18} strokeWidth={1.8} style={{ color: statusConfig.color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{recognition.tagName}</div>
                        <div style={{ fontSize: 14.5, fontWeight: 800, color: C.navy, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recognition.title}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: statusConfig.bg, color: statusConfig.color, border: `1px solid ${statusConfig.border}`, flexShrink: 0 }}>{statusConfig.label}</span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: 12.5, color: '#5A6080', margin: '0 0 10px', lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{recognition.description}</p>

                    {/* Info Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => { setViewingImages({ id: recognition.id, count: recognition.imageCount, images: recognition.images }); setCurrentImageIdx(0) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: 'rgba(99,102,241,0.10)', color: '#6366F1', border: 'none', cursor: 'pointer', transition: 'all 0.14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                      >
                        <ImageIcon size={12} strokeWidth={1.8} />
                        {recognition.imageCount} image{recognition.imageCount > 1 ? 's' : ''}
                      </button>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.muted }}>
                        <Clock size={11} strokeWidth={1.8} />
                        {recognition.date}
                      </span>

                      {/* Action Buttons - Right Side */}
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexShrink: 0 }}>
                        {(recognition.status === 'scheduled' || recognition.status === 'draft') && (
                          <button title="Edit" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(124,58,237,0.09)', color: '#7C3AED', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.09)' }}>
                            <Edit2 size={14} strokeWidth={1.8} />
                          </button>
                        )}
                        <button title="Delete" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}>
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

      {/* Images Carousel Modal - Full Image Display */}
      {viewingImages && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(10,12,28,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => { setViewingImages(null); setCurrentImageIdx(0) }}
        >
          <div
            style={{
              position: 'relative',
              width: '90vw',
              height: '92vh',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#fff',
              boxShadow: '0 20px 60px rgba(10,12,28,0.30)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Image Container - Fixed Size with Padding */}
            <div style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f5f5f5',
              overflow: 'hidden',
              padding: '24px',
            }}>
              <img
                src={viewingImages.images[currentImageIdx]}
                alt={`Image ${currentImageIdx + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />

              {/* Close Button - Overlay */}
              <button
                onClick={() => { setViewingImages(null); setCurrentImageIdx(0) }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: 'none',
                  background: 'rgba(0,0,0,0.50)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  fontSize: 24,
                  fontWeight: 600,
                  zIndex: 10,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.50)' }}
              >
                ×
              </button>
            </div>

            {/* Dots Navigation - Bottom */}
            {viewingImages.count > 1 && (
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderTop: `1px solid ${C.border}`, background: '#fff', flexShrink: 0 }}>
                {Array.from({ length: viewingImages.count }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    style={{
                      width: currentImageIdx === idx ? 28 : 10,
                      height: 10,
                      borderRadius: 5,
                      border: 'none',
                      background: currentImageIdx === idx ? '#6366F1' : '#D0D3E4',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                    }}
                    title={`Image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
