import { useState } from 'react'
import { Edit2, User2, Briefcase, MapPin, CreditCard, Shield, Users, GraduationCap, Phone, Plus, Star, FileText, Inbox, Download, Trash2, X } from 'lucide-react'

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: '#E4E6EF',
  muted:  '#8B90A7',
  bg:     '#F0F2F8',
}

function SectionCard({
  icon, title, editable = false, children, style,
}: {
  icon: React.ReactNode; title: string; editable?: boolean
  children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '20px 24px', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
        </div>
        {editable && (
          <button
            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            <Edit2 size={13} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, verified }: { label: string; value?: string | null; verified?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: value ? C.navy : '#C8CCE0', display: 'flex', alignItems: 'center', gap: 5 }}>
        {value || '—'}
        {verified && value && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#16A34A" opacity=".12"/><path d="M8 12l3 3 5-5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </span>
    </div>
  )
}

function FieldGrid({ cols = 2, children, gap = 18, rowGap }: { cols?: number; children: React.ReactNode; gap?: number; rowGap?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, columnGap: gap, rowGap: rowGap ?? gap }}>
      {children}
    </div>
  )
}

function ActionBadges() {
  const editColor = '#2563EB'
  const deleteColor = '#EF4444'
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button
        style={{
          width: 28, height: 28, borderRadius: 6,
          border: `1px solid ${editColor}20`, background: `${editColor}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: editColor, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${editColor}22`; e.currentTarget.style.borderColor = `${editColor}40` }}
        onMouseLeave={e => { e.currentTarget.style.background = `${editColor}12`; e.currentTarget.style.borderColor = `${editColor}20` }}
      >
        <Edit2 size={12} strokeWidth={2.5} />
      </button>
      <button
        style={{
          width: 28, height: 28, borderRadius: 6,
          border: `1px solid ${deleteColor}20`, background: `${deleteColor}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: deleteColor, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${deleteColor}22`; e.currentTarget.style.borderColor = `${deleteColor}40` }}
        onMouseLeave={e => { e.currentTarget.style.background = `${deleteColor}12`; e.currentTarget.style.borderColor = `${deleteColor}20` }}
      >
        <Trash2 size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
}

function AddSkillModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    category: '',
    yearsOfExperience: '',
    skillLevel: '',
    description: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Skill form submitted:', formData)
    setFormData({ category: '', yearsOfExperience: '', skillLevel: '', description: '' })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 22, width: 680, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Add Skill</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Add a new skill to your professional profile</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Two columns: Category & Years */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Category */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Skill Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. UI/UX Design, JavaScript"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Years of Experience */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  min="0"
                  step="0.5"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Skill Level
              </label>
              <select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={handleChange}
                required
                style={{
                  width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              >
                <option value="">Select skill level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your proficiency and experience with this skill"
                rows={4}
                style={{
                  width: '100%', borderRadius: 12, padding: '12px 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', transition: 'all 0.15s', resize: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Add Skill
          </button>
        </div>
      </div>
    </div>
  )
}

function AddWorkExperienceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    fromPeriod: '',
    toPeriod: '',
    comments: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Work experience form submitted:', formData)
    setFormData({ company: '', jobTitle: '', fromPeriod: '', toPeriod: '', comments: '' })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 22, width: 680, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Add Work Experience</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Add your work history and experience details</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Company & Job Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Company */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Job Title */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Senior Designer"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* From & To Period */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* From Period */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  From Period
                </label>
                <input
                  type="date"
                  name="fromPeriod"
                  value={formData.fromPeriod}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* To Period */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  To Period
                </label>
                <input
                  type="date"
                  name="toPeriod"
                  value={formData.toPeriod}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Comments */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Comments / Achievements
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Describe your role, responsibilities, and key achievements"
                rows={4}
                style={{
                  width: '100%', borderRadius: 12, padding: '12px 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', transition: 'all 0.15s', resize: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(6,182,212,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Add Experience
          </button>
        </div>
      </div>
    </div>
  )
}

function AddReferenceDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    issueDate: '',
    validTill: '',
    comments: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Reference document form submitted:', formData)
    setFormData({ documentType: '', documentNumber: '', issueDate: '', validTill: '', comments: '' })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 22, width: 680, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Add Reference Document</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Add important documents like passport, license, or certificates</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Document Type & Number */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Document Type */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Document Type
                </label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <option value="">Select document type</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver License</option>
                  <option value="ID Card">ID Card</option>
                  <option value="Visa">Visa</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Document Number */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Document Number
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  placeholder="e.g. K12345678"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Issue Date & Valid Till */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Issue Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Issue Date
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Valid Till */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Valid Till
                </label>
                <input
                  type="date"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Comments */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Add any additional notes or remarks about this document"
                rows={3}
                style={{
                  width: '100%', borderRadius: 12, padding: '12px 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', transition: 'all 0.15s', resize: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(59,130,246,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Add Document
          </button>
        </div>
      </div>
    </div>
  )
}

function AddOtherDocumentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    documentName: '',
    fileName: '',
    fileUpload: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, fileUpload: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Other document form submitted:', formData)
    setFormData({ documentName: '', fileName: '', fileUpload: null })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 22, width: 680, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Add Other Document</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Upload additional documents like certificates, awards, or other files</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Document Name & File Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Document Name */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Document Name
                </label>
                <input
                  type="text"
                  name="documentName"
                  value={formData.documentName}
                  onChange={handleChange}
                  placeholder="e.g. Award Certificate"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* File Name Display */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  File Selected
                </label>
                <input
                  type="text"
                  value={formData.fileUpload ? formData.fileUpload.name : ''}
                  readOnly
                  placeholder="No file selected"
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: formData.fileUpload ? C.navy : '#C5CCDB', outline: 'none',
                    border: `1px solid ${C.border}`, background: C.bg,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'not-allowed',
                  }}
                />
              </div>
            </div>

            {/* File Upload Area */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Upload File
              </label>
              <div style={{
                border: `1px dashed #8B5CF6`,
                borderRadius: 12,
                padding: '32px 24px',
                textAlign: 'center',
                background: 'rgba(139, 92, 246, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)'; e.currentTarget.style.borderColor = '#7C3AED' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.04)'; e.currentTarget.style.borderColor = '#8B5CF6' }}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.png,.txt"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: 32, marginBottom: 8, color: '#8B5CF6' }}>📁</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#8B5CF6', marginBottom: 4 }}>
                    Click to upload or drag and drop
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>
                    PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  )
}

function AddEducationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    level: '',
    institute: '',
    degree: '',
    specialization: '',
    percentage: '',
    fromDate: '',
    toDate: '',
    documents: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Education form submitted:', formData)
    setFormData({ level: '', institute: '', degree: '', specialization: '', percentage: '', fromDate: '', toDate: '', documents: '' })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 22, width: 680, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Add Education Qualification</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Add your educational background and qualifications</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Level */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Education Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                style={{
                  width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              >
                <option value="">Select education level</option>
                <option value="High School">High School / 10th</option>
                <option value="Intermediate">Intermediate / 12th</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate (Bachelor's)</option>
                <option value="Post Graduate">Post Graduate (Master's)</option>
                <option value="PhD">PhD / Doctorate</option>
              </select>
            </div>

            {/* Two columns: Institute & Degree */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* Institute */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Institute / College
                </label>
                <input
                  type="text"
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                  placeholder="Enter university name"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* Degree */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech, B.A, M.S"
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Specialization */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Specialization / Major
              </label>
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Computer Science, Mechanical Engineering"
                required
                style={{
                  width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                  fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', transition: 'all 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {/* Percentage & Dates in one row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
              {/* Percentage */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Percentage / CGPA
                </label>
                <input
                  type="number"
                  name="percentage"
                  value={formData.percentage}
                  onChange={handleChange}
                  placeholder="85.5"
                  min="0"
                  max="100"
                  step="0.01"
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* From Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  From
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>

              {/* To Date */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  To
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%', height: 46, borderRadius: 12, padding: '0 16px',
                    fontSize: 14, fontWeight: 500, color: C.navy, outline: 'none',
                    border: `1px solid ${C.border}`, background: '#fff',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37,99,235,0.10)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Better Document Upload UI */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Upload Documents
              </label>
              <div style={{
                border: `1px dashed #2563EB`,
                borderRadius: 12,
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(37, 99, 235, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.08)'; e.currentTarget.style.borderColor = '#1E40AF' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37, 99, 235, 0.04)'; e.currentTarget.style.borderColor = '#2563EB' }}
              >
                <input
                  type="file"
                  name="documents"
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  id="doc-upload"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <label htmlFor="doc-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <div style={{ fontSize: 28, marginBottom: 8, color: '#2563EB' }}>📎</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#2563EB', marginBottom: 4 }}>
                    Click to upload or drag documents
                  </div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>
                    PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 32px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Add Qualification
          </button>
        </div>
      </div>
    </div>
  )
}

function AddFamilyMemberModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    dob: '',
    dependent: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type } = e.target
    const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setFormData({ name: '', relation: '', dob: '', dependent: false })
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: 460, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(10,12,28,0.24), 0 2px 8px rgba(10,12,28,0.08)',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.navy }}>Add Family Member</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Add a new member to your family details</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg; e.currentTarget.style.color = C.muted }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                style={{
                  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
                  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {/* Relation */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Relation
              </label>
              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                required
                style={{
                  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
                  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              >
                <option value="">Select relation</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={{
                  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
                  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
                  border: `1px solid ${C.border}`, background: '#fff',
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  boxSizing: 'border-box', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            {/* Dependent Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
              <input
                type="checkbox"
                name="dependent"
                checked={formData.dependent}
                onChange={handleChange}
                style={{
                  width: 18, height: 18, borderRadius: 4, border: `1px solid ${C.border}`,
                  cursor: 'pointer', accentColor: '#2563EB',
                }}
              />
              <label style={{ fontSize: 13.5, fontWeight: 500, color: C.navy, cursor: 'pointer' }}>
                Mark as dependent
              </label>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, height: 42, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff',
              color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, height: 42, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)',
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Add Member
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyProfilePage() {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [showAddEducationModal, setShowAddEducationModal] = useState(false)
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [showAddExperienceModal, setShowAddExperienceModal] = useState(false)
  const [showAddReferenceModal, setShowAddReferenceModal] = useState(false)
  const [showAddOtherDocModal, setShowAddOtherDocModal] = useState(false)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <AddFamilyMemberModal open={showAddMemberModal} onClose={() => setShowAddMemberModal(false)} />
      <AddEducationModal open={showAddEducationModal} onClose={() => setShowAddEducationModal(false)} />
      <AddSkillModal open={showAddSkillModal} onClose={() => setShowAddSkillModal(false)} />
      <AddWorkExperienceModal open={showAddExperienceModal} onClose={() => setShowAddExperienceModal(false)} />
      <AddReferenceDocumentModal open={showAddReferenceModal} onClose={() => setShowAddReferenceModal(false)} />
      <AddOtherDocumentModal open={showAddOtherDocModal} onClose={() => setShowAddOtherDocModal(false)} />
      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>My Profile</h1>
        <p className="text-sm mt-0.5" style={{ color: '#787878', fontWeight: 500 }}>View and manage your personal information</p>
      </div>

      {/* ── BENTO GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 18 }}>

        {/* ── 1. PROFILE HERO — col 1-4 ── */}
        <div style={{ gridColumn: 'span 4', display: 'flex' }}>
          <div style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: 18,
            padding: '28px 24px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            flex: 1,
          }}>
            {/* decorative circles */}
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(242,208,0,0.10)' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(242,208,0,0.07)' }} />

            {/* Avatar */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <div style={{
                width: 84, height: 84, borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 4px 20px rgba(28,32,53,0.14)',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="John Doe"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              {/* Online dot */}
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#22C55E', border: '2px solid #fff' }} />
            </div>

            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 4 }}>John Doe</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 16 }}>UI/UX Designer</div>

            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.20)', borderRadius: 20, padding: '4px 12px', marginBottom: 20 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#16A34A' }}>Active Employee</span>
            </div>

            {/* Quick info strips */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <Briefcase size={13} />, label: 'Employee Code', val: 'EMP-0042' },
                { icon: <MapPin size={13} />, label: 'Office Location', val: 'Mumbai' },
                { icon: <Users size={13} />, label: 'Department', val: 'Product Design' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.bg, borderRadius: 10, padding: '9px 13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: C.muted, fontSize: 12 }}>
                    {icon}
                    <span>{label}</span>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Joined */}
            <div style={{ marginTop: 16, fontSize: 11.5, color: C.muted }}>
              Joined 15 Mar 2022 · Senior Executive
            </div>
          </div>
        </div>

        {/* ── 2. OFFICIAL DETAILS — col 5-12 ── */}
        <div style={{ gridColumn: 'span 8' }}>
          <SectionCard icon={<Briefcase size={16} color="#6366F1" />} title="Official Details" style={{ height: '100%' }}>
            <FieldGrid cols={3} gap={20} rowGap={22}>
              <Field label="Employee Type"         value="Regular" />
              <Field label="Employment Status"     value="Working" />
              <Field label="Employee Code"         value="EMP-0042" />
              <Field label="Manager"               value="David Wilson (EMP-0018)" />
              <Field label="Office Location"       value="Mumbai" />
              <Field label="Department"            value="Product Design" />
              <Field label="Work Location"         value="Hybrid" />
              <Field label="Date of Joining"       value="15/03/2022" />
              <Field label="Designation"           value="UI/UX Designer" />
              <Field label="Level"                 value="Senior Executive" />
              <Field label="Notice Period"         value="60 days" />
              <Field label="Shift"                 value="General" />
              <Field label="Attendance Recording"  value="Mobile + Web" />
              <Field label="Confirmation Date"     value="15/09/2022" />
              <Field label="Work Nature"           value="Full-Time" />
              <Field label="Calendar"              value="Calendar-2026" />
              <Field label="Desk Number"           value="D-204" />
              <Field label="Job Description"       value="UI/UX Designer" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 3. PERSONAL DETAILS — col 1-6 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<User2 size={16} color="#EC4899" />} title="Personal Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Full Name"       value="Mr. John Doe" />
              <Field label="Gender"          value="Male" />
              <Field label="Marital Status"  value="Married" />
              <Field label="Date of Birth"   value="12/06/1995" />
              <Field label="Mobile"          value="91-9876543210 (Active)" />
              <Field label="Email"           value="john.doe@concertidc.com" />
              <Field label="National ID"     value="IND-2024-JD-0042" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 4. ADDITIONAL DETAILS — col 7-12 ── */}
        <div style={{ gridColumn: 'span 6' }}>
          <SectionCard icon={<Phone size={16} color="#14B8A6" />} title="Additional Details" editable style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={20} rowGap={20}>
              <Field label="Alternate Email"           value="johndoe.personal@gmail.com" verified />
              <Field label="Blood Group"               value="B+" />
              <Field label="Phone (Residence)"         value="+91-2234567890" />
              <Field label="Phone (Office)"            value={undefined} />
              <Field label="Emergency Contact Person"  value="Jane Doe" />
              <Field label="Emergency Contact Number"  value="+91-9876501234" />
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 5. ADDRESSES — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<MapPin size={16} color="#F59E0B" />} title="Addresses" editable>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Present Address</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: C.navy, background: C.bg, borderRadius: 10, padding: '12px 16px' }}>
                  42 Elm Street, Downtown, Andheri West, Mumbai — 400053, Maharashtra, India
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Permanent Address</div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: C.navy, background: C.bg, borderRadius: 10, padding: '12px 16px' }}>
                  17 Oak Avenue, Sector 12, Baner Road, Pune — 411045, Maharashtra, India
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 6. BANK ACCOUNTS — col 1-7 ── */}
        <div style={{ gridColumn: 'span 7' }}>
          <SectionCard icon={<CreditCard size={16} color="#2563EB" />} title="Bank Accounts" editable style={{ height: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Salary Account */}
              <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Salary Account
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <Field label="Payment Mode"     value="Bank Transfer" />
                  <Field label="Account Number"   value="1234 5678 9012 3456" />
                  <Field label="Bank Name"        value="ICICI BANK" />
                  <Field label="Branch Name"      value="Andheri West" />
                  <Field label="IFSC / Routing"   value="ICIC0001234" />
                </div>
              </div>
              {/* Expense Account */}
              <div style={{ background: C.bg, borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                  Expense Account
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <Field label="Payment Mode"     value="Bank Transfer" />
                  <Field label="Account Number"   value="9876 5432 1098 7654" />
                  <Field label="Bank Name"        value="AXIS BANK" />
                  <Field label="Branch Name"      value="Bandra East" />
                  <Field label="IFSC / Routing"   value="UTIB0001234" />
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── 7. STATUTORY DETAILS — col 8-12 ── */}
        <div style={{ gridColumn: 'span 5' }}>
          <SectionCard icon={<Shield size={16} color="#DC2626" />} title="Statutory Details" style={{ height: '100%' }}>
            <FieldGrid cols={2} gap={14}>
              <Field label="ESI Number"   value={undefined} />
              <Field label="NPR Number"   value={undefined} />
              <Field label="PAN Number"   value="ABCDE1234F" />
              <Field label="PF Number"    value="MH/BAN/12345/001" />
              <Field label="PRAN Number"  value={undefined} />
              <Field label="Tax Option"   value="New regime" />
              <div style={{ gridColumn: 'span 2' }}>
                <Field label="UAN Number" value="100987654321" verified />
              </div>
            </FieldGrid>
          </SectionCard>
        </div>

        {/* ── 8. FAMILY DETAILS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<Users size={16} color="#7C3AED" />} title="Family Details">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 0.8fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Name', 'Relation', 'Date of Birth', 'Dependent', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { name: 'Emily Doe',   relation: 'Spouse', dob: '25/08/1997', dep: false },
              { name: 'Robert Doe', relation: 'Father', dob: '10/02/1965', dep: false },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr 0.8fr 0.8fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{row.name}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.relation}</span>
                <span style={{ fontSize: 13, color: C.navy }}>{row.dob}</span>
                <div>
                  <div style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderRadius: 4, background: '#fff' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <ActionBadges />
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddMemberModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1.5px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Member
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 9. EDUCATION QUALIFICATIONS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<GraduationCap size={16} color="#0EA5E9" />} title="Education Qualifications">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1.5fr 0.6fr 1fr 1fr 0.6fr 0.8fr',
              background: C.bg, borderRadius: 10,
              padding: '10px 16px', marginBottom: 4,
            }}>
              {['Level', 'Institute', 'Degree', 'Specialization', '%', 'From', 'To', 'Docs', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Education row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1.5fr 0.6fr 1fr 1fr 0.6fr 0.8fr',
              padding: '13px 16px', borderBottom: `1px solid ${C.border}`,
              alignItems: 'center',
            }}>
              {/* Level badge */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 600, background: '#EFF6FF', color: '#2563EB', borderRadius: 6, padding: '3px 9px' }}>
                  Graduate
                </span>
              </div>
              <span style={{ fontSize: 13, color: C.navy }}>State University of Technology</span>
              <span style={{ fontSize: 13, color: C.navy }}>B.Tech</span>
              <span style={{ fontSize: 13, color: C.navy }}>Information Technology</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>82.00</span>
              <span style={{ fontSize: 13, color: C.muted }}>Jul-2013</span>
              <span style={{ fontSize: 13, color: C.muted }}>May-2017</span>
              <span style={{ fontSize: 12, color: C.muted }}>—</span>
              <div>
                <ActionBadges />
              </div>
            </div>

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddEducationModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1.5px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0EA5E9'; e.currentTarget.style.color = '#0EA5E9' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add New
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 10. SKILL DETAILS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<Star size={16} color="#F59E0B" />} title="Skill Details">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1.5fr 1fr 2fr 0.8fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Skill Category', 'Years of Experience', 'Skill Level', 'Description', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { category: 'UI/UX Design', years: '5+', level: 'Expert', desc: 'Proficient in Figma, Adobe XD, and design systems' },
              { category: 'JavaScript', years: '4', level: 'Intermediate', desc: 'ES6+, React, and modern web development' },
              { category: 'Project Management', years: '3', level: 'Intermediate', desc: 'Agile methodologies and team coordination' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 2fr 0.8fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{row.category}</span>
                <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{row.years}</span>
                <div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, background: '#FEF3C7', color: '#92400E', borderRadius: 6, padding: '3px 9px' }}>
                    {row.level}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: C.muted }}>{row.desc}</span>
                <div>
                  <ActionBadges />
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddSkillModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#F59E0B'; e.currentTarget.style.color = '#F59E0B' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Skill
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 11. WORK EXPERIENCE — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<Briefcase size={16} color="#06B6D4" />} title="Work Experience">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.8fr 1.8fr 1fr 1fr 1.5fr 0.8fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Company Name', 'Job Title', 'From Period', 'To Period', 'Comments', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { company: 'Design Studio Pro', title: 'Senior UX Designer', from: 'Jan 2021', to: 'Present', comments: 'Led design team of 3' },
              { company: 'Tech Innovations Inc', title: 'UX Designer', from: 'Jun 2019', to: 'Dec 2020', comments: 'Worked on SaaS products' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.8fr 1.8fr 1fr 1fr 1.5fr 0.8fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{row.company}</span>
                <span style={{ fontSize: 13, color: C.navy }}>{row.title}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.from}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.to}</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>{row.comments}</span>
                <div>
                  <ActionBadges />
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddExperienceModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#06B6D4'; e.currentTarget.style.color = '#06B6D4' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Experience
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 12. REFERENCE DOCUMENTS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<FileText size={16} color="#3B82F6" />} title="Reference Documents">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1.2fr 1.5fr 0.8fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Document Type', 'Document Number', 'Issue Date', 'Valid Till', 'Comments', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { type: 'Passport', number: 'K12345678', issued: '15/03/2020', valid: '14/03/2030', comments: 'Verified' },
              { type: 'Driver License', number: 'DL-0042-2021', issued: '22/06/2021', valid: '21/06/2031', comments: 'Active' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1.2fr 1.2fr 1.5fr 0.8fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{row.type}</span>
                <span style={{ fontSize: 13, color: C.navy, fontFamily: 'monospace' }}>{row.number}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.issued}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{row.valid}</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>{row.comments}</span>
                <div>
                  <ActionBadges />
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddReferenceModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1.5px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.color = '#3B82F6' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Document
              </button>
            </div>
          </SectionCard>
        </div>

        {/* ── 13. OTHER DOCUMENTS — full width ── */}
        <div style={{ gridColumn: 'span 12' }}>
          <SectionCard icon={<Inbox size={16} color="#8B5CF6" />} title="Other Documents">
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2.5fr 0.8fr',
              gap: 0,
              background: C.bg,
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 4,
            }}>
              {['Document Name', 'File Name', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {[
              { name: 'Offer Letter', file: 'offer_letter_2022.pdf' },
              { name: 'Certification', file: 'UI-UX_cert_2021.pdf' },
              { name: 'Internship Letter', file: 'internship_completion.pdf' },
            ].map((doc, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 2.5fr 0.8fr',
                gap: 0, padding: '13px 16px',
                borderBottom: `1px solid ${C.border}`, alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{doc.name}</span>
                <span style={{ fontSize: 13, color: C.muted, fontFamily: 'monospace' }}>{doc.file}</span>
                <div>
                  <ActionBadges />
                </div>
              </div>
            ))}

            {/* Add row */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddOtherDocModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 16px', borderRadius: 9,
                  border: `1.5px dashed ${C.border}`, background: '#fff',
                  color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.color = '#8B5CF6' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                <Plus size={13} /> Add Document
              </button>
            </div>
          </SectionCard>
        </div>

      </div>{/* end bento grid */}
    </div>
  )
}
