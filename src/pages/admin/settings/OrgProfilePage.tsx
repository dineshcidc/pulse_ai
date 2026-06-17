import { useState } from 'react'
import {
  Building2, MapPin, Phone, Globe,
  Shield, Briefcase,
  Clock, Edit3, CheckCircle2, Mail,
  Upload, X, Image as ImageIcon,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

/* ── Static org data ── */
const ORG = {
  name:        'Concert IDC Private Limited',
  shortName:   'Concert IDC',
  industry:    'IT Services & Consulting',
  type:        'Private Limited Company',
  founded:     '2018',
  website:     'www.concertidc.com',
  tagline:     'Building intelligent workforce management solutions for modern enterprises',
  about:       'Concert IDC is a Bangalore-based technology company specialising in enterprise software development, digital transformation consulting, and SaaS workforce management platforms. We serve clients across BFSI, healthcare, and e-commerce sectors.',
  headcount:   78,
  departments: 9,
  activeProj:  12,
}

const CONTACT = [
  { label: 'Primary Contact',  value: 'Kavitha Reddy'           },
  { label: 'Designation',      value: 'HR Manager'               },
  { label: 'Office Email',     value: 'hr@concertidc.com'        },
  { label: 'Support Email',    value: 'support@concertidc.com'   },
  { label: 'Phone',            value: '+91 80 4567 8900'         },
  { label: 'LinkedIn',         value: 'linkedin.com/company/concertidc' },
]

const OFFICES = [
  {
    type:    'Registered Office',
    badge:   { label: 'Primary', color: '#0A8A58', bg: 'rgba(14,168,106,0.09)', border: 'rgba(14,168,106,0.20)' },
    name:    'Concert IDC — Head Office',
    street:  '#45, 2nd Floor, Prestige Tech Park, Kadubeesanahalli, Outer Ring Road',
    city:    'Bangalore',
    state:   'Karnataka',
    country: 'India',
    pin:     '560 103',
    phone:   '+91 80 4567 8900',
    email:   'contact@concertidc.com',
    color:   '#6366F1',
  },
  {
    type:    'Branch Office',
    badge:   { label: 'Branch', color: '#5B5FDE', bg: 'rgba(99,102,241,0.09)', border: 'rgba(99,102,241,0.20)' },
    name:    'Concert IDC — Mumbai Branch',
    street:  '301, WeWork, Bandra Kurla Complex, BKC Road',
    city:    'Mumbai',
    state:   'Maharashtra',
    country: 'India',
    pin:     '400 051',
    phone:   '+91 22 6789 1234',
    email:   'mumbai@concertidc.com',
    color:   '#F59E0B',
  },
]

const REGISTRATION = [
  { label: 'CIN',               value: 'U72900KA2018PTC112345', mono: true },
  { label: 'PAN',               value: 'AABCC1234D',             mono: true },
  { label: 'GST Number',        value: '29AABCC1234D1Z5',        mono: true },
  { label: 'MSME Registration', value: 'UDYAM-KR-01-0012345',    mono: true },
  { label: 'ISO Certification', value: 'ISO 9001:2015',          mono: false },
]

const PLATFORM = [
  { label: 'Timezone',         value: 'Asia/Kolkata (IST +5:30)' },
  { label: 'Date Format',      value: 'DD / MM / YYYY'            },
  { label: 'Currency',         value: 'Indian Rupee (₹ INR)'      },
  { label: 'Financial Year',   value: 'April – March'             },
  { label: 'Working Days',     value: 'Monday – Friday'           },
  { label: 'Work Hours',       value: '9:00 AM – 6:00 PM'         },
  { label: 'Leave Policy',     value: 'Indian Labour Law Compliant'},
]

/* ── Reusable components ── */
function InfoRow({ label, value, mono = false, last = false }: {
  label: string; value: string; mono?: boolean; last?: boolean
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24,
      padding: '14px 0', borderBottom: last ? 'none' : '1px solid #F0F1F7',
    }}>
      <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, flexShrink: 0, minWidth: 148, lineHeight: 1.4 }}>{label}</span>
      <span style={{ fontSize: 13, color: C.navy, fontWeight: 600, textAlign: 'right' as const, lineHeight: 1.5, fontFamily: mono ? "'JetBrains Mono', 'Courier New', monospace" : 'inherit', letterSpacing: mono ? '0.04em' : 'normal' }}>{value}</span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, accent = '#8B90A7', accentBg = C.surface, onEdit, children }: {
  title: string; icon: React.ElementType; accent?: string; accentBg?: string; onEdit?: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={15} style={{ color: accent }} strokeWidth={1.8} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8,
              border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <Edit3 size={12} strokeWidth={2} style={{ color: C.muted }} />
          </button>
        )}
      </div>
      <div style={{ padding: '4px 22px 8px' }}>{children}</div>
    </div>
  )
}


function BrandLogoModal({ open, onClose, onUpload }: { open: boolean; onClose: () => void; onUpload: (file: File) => void }) {
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) setPreview(e.target.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (logoFile) {
      onUpload(logoFile)
      setLogoFile(null)
      setPreview(null)
      onClose()
    }
  }

  const handleReset = () => {
    setLogoFile(null)
    setPreview(null)
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
        background: '#fff', borderRadius: 22, width: 580, maxHeight: '90vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(10,12,28,0.28), 0 4px 12px rgba(10,12,28,0.10)',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 6, letterSpacing: '-0.3px' }}>Brand Logo Upload</div>
            <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Update your organization's brand logo (PNG, JPG, SVG)</div>
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

            {/* Current Logo Preview */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Current Logo
              </label>
              <div style={{
                width: '100%', height: 140, borderRadius: 14, border: `1px solid ${C.border}`,
                background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                <img src="/logo.png" alt="Current Logo" style={{ height: '100%', objectFit: 'contain', padding: '8px' }} />
              </div>
            </div>

            {/* New Logo Upload Area */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                New Logo
              </label>

              {preview ? (
                <div style={{
                  width: '100%', height: 140, borderRadius: 14, border: `2px solid #6366F1`,
                  background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <img src={preview} alt="Logo Preview" style={{ height: '100%', objectFit: 'contain', padding: '8px' }} />
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  style={{
                    width: '100%', borderRadius: 14, padding: '40px 24px', textAlign: 'center',
                    border: dragActive ? '2px solid #6366F1' : `2px dashed ${C.border}`,
                    background: dragActive ? 'rgba(99, 102, 241, 0.08)' : C.surface,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="file"
                    onChange={handleChange}
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    style={{ display: 'none' }}
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" style={{ cursor: 'pointer', display: 'block' }}>
                    <div style={{ fontSize: 32, marginBottom: 12, color: '#6366F1' }}>
                      <ImageIcon size={32} style={{ display: 'inline-block' }} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#6366F1', marginBottom: 4 }}>
                      Click to upload logo
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>
                      or drag and drop
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                      PNG, JPG, SVG or WebP (Recommended: 1:1 aspect ratio, min 256×256px)
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* File Info */}
            {logoFile && (
              <div style={{
                background: C.surface, borderRadius: 12, padding: '16px',
                border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: '#6366F1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                  }}>
                    <Upload size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{logoFile.name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(139, 144, 167, 0.08)',
                    color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139, 144, 167, 0.15)'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139, 144, 167, 0.08)'; e.currentTarget.style.color = C.muted }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

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
            disabled={!logoFile}
            style={{
              flex: 1, height: 44, borderRadius: 12, border: 'none',
              background: logoFile ? 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%)' : '#D1D5E0',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: logoFile ? 'pointer' : 'not-allowed',
              fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (logoFile) e.currentTarget.style.opacity = '0.9' }}
            onMouseLeave={e => { if (logoFile) e.currentTarget.style.opacity = '1' }}
          >
            Upload Logo
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function OrgProfilePage() {
  const [showLogoModal, setShowLogoModal] = useState(false)

  const handleLogoUpload = (file: File) => {
    console.log('Logo uploaded:', file.name)
    // Handle logo upload logic here
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <BrandLogoModal open={showLogoModal} onClose={() => setShowLogoModal(false)} onUpload={handleLogoUpload} />

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Organization Profile</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Company information, registration details and platform configuration</p>
        </div>
        <button
          onClick={() => setShowLogoModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            height: 38, padding: '0 18px', borderRadius: 10,
            border: `1px solid ${C.border}`, background: '#fff',
            fontSize: 13, fontWeight: 600, color: C.navy,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = C.border }}
        >
          <Edit3 size={14} strokeWidth={2} /> Edit Logo
        </button>
      </div>

      {/* ── Hero card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>

        {/* Top accent bar */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #1C2035 0%, #F2D000 50%, #E84855 100%)' }} />

        <div style={{ padding: '28px 28px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 22 }}>

            {/* Logo */}
            <div style={{
              width: 80, height: 80, borderRadius: 18, flexShrink: 0, overflow: 'hidden',
              border: `1.5px solid ${C.border}`, background: C.surface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src="/logo.png" alt="Concert IDC" style={{ width: 64, height: 64, objectFit: 'contain' }} />
            </div>

            {/* Company info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' as const }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: '-0.3px' }}>{ORG.name}</h2>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 99,
                  background: 'rgba(14,168,106,0.09)', color: '#0A8A58', border: '1px solid rgba(14,168,106,0.2)',
                }}>
                  <CheckCircle2 size={10} strokeWidth={2.5} /> Active
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' as const }}>
                {[
                  { icon: Briefcase, text: ORG.industry },
                  { icon: Building2, text: ORG.type     },
                  { icon: MapPin,    text: 'Bangalore, India' },
                  { icon: Globe,     text: ORG.website  },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                    <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.65, margin: 0, maxWidth: 680 }}>
                {ORG.about}
              </p>
            </div>

            {/* Founded badge */}
            <div style={{ flexShrink: 0, textAlign: 'center', padding: '14px 20px', background: C.surface, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1 }}>{ORG.founded}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Established</div>
            </div>
          </div>
        </div>

        <div style={{ height: 28 }} />
      </div>

      {/* ── Info sections — 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Contact Information */}
        <SectionCard title="Contact Information" icon={Phone} accent="#6366F1" accentBg="rgba(99,102,241,0.09)" onEdit={() => console.log('Edit contact')}>
          {CONTACT.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === CONTACT.length - 1} />)}
        </SectionCard>

        {/* Business Registration */}
        <SectionCard title="Business Registration" icon={Shield} accent="#0EA86A" accentBg="rgba(14,168,106,0.09)" onEdit={() => console.log('Edit business')}>
          {REGISTRATION.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} mono={r.mono} last={i === REGISTRATION.length - 1} />)}
        </SectionCard>

        {/* Office Locations — full width */}
        <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(245,158,11,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={15} style={{ color: '#D97706' }} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Office Locations</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: '3px 10px' }}>
              {OFFICES.length} offices
            </span>
          </div>

          {/* Address cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18, padding: '20px 22px' }}>
            {OFFICES.map(office => (
              <div key={office.name} style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', background: C.surface }}>
                {/* Card top accent */}
                <div style={{ height: 3, background: `linear-gradient(90deg, ${office.color}, ${office.color}88)` }} />

                <div style={{ padding: '18px 20px' }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${office.color}12`, border: `1px solid ${office.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Building2 size={17} style={{ color: office.color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, lineHeight: 1.3 }}>{office.name}</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{office.type}</div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: office.badge.bg, color: office.badge.color, border: `1px solid ${office.badge.border}`, flexShrink: 0 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: office.badge.color, display: 'inline-block' }} />
                      {office.badge.label}
                    </span>
                  </div>

                  {/* Address block */}
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, padding: '12px 14px', background: '#fff', borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <MapPin size={14} style={{ color: C.muted, flexShrink: 0, marginTop: 2 }} strokeWidth={1.8} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#3D4266', lineHeight: 1.65 }}>
                        {office.street}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 3 }}>
                        {office.city}, {office.state} – {office.pin}
                      </div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{office.country}</div>
                    </div>
                  </div>

                  {/* Contact strip */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${office.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Phone size={11} style={{ color: office.color }} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#3D4266' }}>{office.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: `${office.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Mail size={11} style={{ color: office.color }} strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#3D4266' }}>{office.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Configuration */}
        <SectionCard title="Platform Configuration" icon={Clock} accent="#E84855" accentBg="rgba(232,72,85,0.09)" onEdit={() => console.log('Edit platform')}>
          {PLATFORM.map((r, i) => <InfoRow key={r.label} label={r.label} value={r.value} last={i === PLATFORM.length - 1} />)}
        </SectionCard>

      </div>
    </div>
  )
}
