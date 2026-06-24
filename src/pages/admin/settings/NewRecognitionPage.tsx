import React, { useState, useRef } from 'react'
import { ArrowLeft, FileText, Send, Calendar, Users, Image as ImageIcon, Clock } from 'lucide-react'
import ImageUploadCard from '../../../components/ImageUploadCard'
import ImageCarouselModal from '../../../components/ImageCarouselModal'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

interface RecognitionData {
  tagName: string
  description: string
  images: { name: string; size: string; preview: string }[]
  audience: 'all'
  visibilityDays: string
  scheduled: boolean
  scheduleDate: string
  scheduleTime: string
}

export default function NewRecognitionPage({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<RecognitionData>({
    tagName: '',
    description: '',
    images: [],
    audience: 'all',
    visibilityDays: '7',
    scheduled: false,
    scheduleDate: '',
    scheduleTime: '',
  })
  const [sending, setSending] = useState(false)
  const [viewingImages, setViewingImages] = useState<string[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const canSend = data.tagName.trim().length > 0 && data.images.length > 0

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setData(p => ({
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
    setSending(false)
    alert(`Recognition ${asDraft ? 'saved as draft' : 'sent'} successfully!`)
    onBack()
  }

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
            <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginBottom: 2 }}>System Settings · Rewards and Recognition</div>
            <h1 style={{ fontSize: 19, fontWeight: 800, color: C.navy, margin: 0 }}>New Recognition</h1>
          </div>
        </div>

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
              <>{data.scheduled ? <Calendar size={14} strokeWidth={1.8} /> : <Send size={14} strokeWidth={1.8} />} {data.scheduled ? 'Schedule Send' : 'Send Now'}</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>

      {/* ── Two-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT — Compose ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

            {/* Color bar - Theme Blue */}
            <div style={{ height: 3, background: '#6366F1', transition: 'background 0.2s' }} />

            <div style={{ padding: '28px 32px' }}>
              {/* Tag Name */}
              <input
                value={data.tagName}
                onChange={e => setData({ ...data, tagName: e.target.value })}
                placeholder="Recognition tag (e.g., June Month Winners, Mother's Day 2026)..."
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 24, fontWeight: 800, color: C.navy, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: 14, boxSizing: 'border-box', caretColor: '#6366F1' }}
              />


              {/* Description */}
              <textarea
                value={data.description}
                onChange={e => setData({ ...data, description: e.target.value })}
                placeholder="Write a description about this recognition..."
                rows={6}
                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: 14.5, color: '#3D4266', lineHeight: 1.8, background: 'transparent', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', caretColor: '#6366F1' }}
              />
            </div>

            {/* File Upload Section */}
            <div style={{ borderTop: `1px solid ${C.border}`, padding: '20px 32px' }}>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

              {data.images.length === 0 ? (
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
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, marginBottom: 8 }}>Uploaded Images ({data.images.length})</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {data.images.map((img, idx) => (
                      <ImageUploadCard
                        key={idx}
                        name={img.name}
                        size={img.size}
                        preview={img.preview}
                        onDelete={() => setData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))}
                        onView={() => setViewingImages(data.images.map(img => img.preview))}
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
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8 }}>How many days should this reward be visible?</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={data.visibilityDays}
                    onChange={e => setData({ ...data, visibilityDays: e.target.value })}
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
              Recognition will be hidden after {data.visibilityDays} day{data.visibilityDays !== '1' ? 's' : ''}
            </div>
          </div>

          {/* Schedule */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Schedule</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.scheduled ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Schedule Send</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>Send at a specific time</div>
              </div>
              <button
                onClick={() => setData(p => ({ ...p, scheduled: !p.scheduled }))}
                style={{
                  width: 42,
                  height: 23,
                  borderRadius: 12,
                  border: 'none',
                  background: data.scheduled ? '#6366F1' : '#D0D3E4',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 17, height: 17, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: data.scheduled ? 22 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
              </button>
            </div>
            {data.scheduled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
                  <input
                    type="date"
                    value={data.scheduleDate}
                    onChange={e => setData({ ...data, scheduleDate: e.target.value })}
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
                    value={data.scheduleTime}
                    onChange={e => setData({ ...data, scheduleTime: e.target.value })}
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

      {/* Images Carousel Modal */}
      {viewingImages && <ImageCarouselModal images={viewingImages} onClose={() => setViewingImages(null)} />}
    </div>
  )
}
