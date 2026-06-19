import { useState } from 'react'
import {
  Building2, ArrowLeft, MapPin, Phone,
  Shield, Briefcase, Clock, ChevronDown, Plus, Trash2,
  Edit3, Image as ImageIcon,
} from 'lucide-react'
import OrgProfilePage from './OrgProfilePage'

type View = 'empty' | 'create' | 'saving' | 'profile'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC', hover: '#F0F2F8' }

const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  border: `1px solid ${C.border}`, background: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}

const LABEL: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: '#8B90A7', letterSpacing: '0.06em',
  textTransform: 'uppercase', display: 'block', marginBottom: 7,
}

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)'
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'
}

// ── Reusable form atoms ────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={LABEL}>{label}{required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}</label>
      {children}
    </div>
  )
}

function FInput({ label, required, placeholder }: { label: string; required?: boolean; placeholder?: string }) {
  const [value, setValue] = useState('')
  return (
    <Field label={label} required={required}>
      <input value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder}
        style={{ ...inputStyle, background: value ? C.surface : '#fff' }}
        onFocus={onFocus} onBlur={onBlur} />
    </Field>
  )
}

function FSelect({ label, required, options, placeholder = 'Select…' }: { label: string; required?: boolean; options: string[]; placeholder?: string }) {
  const [value, setValue] = useState('')
  return (
    <Field label={label} required={required}>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => setValue(e.target.value)}
          style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer', color: value ? C.navy : C.muted, background: value ? C.surface : '#fff' }}
          onFocus={onFocus} onBlur={onBlur}>
          <option value="">{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
      </div>
    </Field>
  )
}

function FTextarea({ label, placeholder, rows = 3 }: { label: string; placeholder?: string; rows?: number }) {
  const [value, setValue] = useState('')
  return (
    <Field label={label}>
      <textarea value={value} onChange={e => setValue(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: '100%', borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: value ? C.surface : '#fff', resize: 'vertical', lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
        onFocus={onFocus} onBlur={onBlur} />
    </Field>
  )
}

function FLogoUpload({ label }: { label?: string }) {
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

  const handleRemove = () => {
    setLogoFile(null)
    setPreview(null)
  }

  return (
    <div>
      {label && <label style={LABEL}>{label}<span style={{ color: '#E84855', marginLeft: 3 }}>*</span></label>}
      {preview ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: '100%', height: 120, borderRadius: 12, border: `2px solid #6366F1`,
            background: 'rgba(99, 102, 241, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <img src={preview} alt="Logo Preview" style={{ height: '100%', objectFit: 'contain', padding: '8px' }} />
          </div>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 1 }}>{logoFile?.name}</div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{(logoFile!.size / 1024).toFixed(1)} KB</div>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                width: '100%', height: 32, borderRadius: 8, border: `1px solid #FEE2E2`,
                background: '#FFF5F5', color: '#E84855', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.13s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F5' }}
            >
              Remove Logo
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            width: '100%', borderRadius: 12, padding: '24px 16px', textAlign: 'center',
            border: dragActive ? '2px solid #6366F1' : `2px dashed ${C.border}`,
            background: dragActive ? 'rgba(99, 102, 241, 0.06)' : C.surface,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <input
            type="file"
            onChange={handleChange}
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            style={{ display: 'none' }}
            id="logo-upload-field"
          />
          <label htmlFor="logo-upload-field" style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: 26, marginBottom: 8, color: '#6366F1' }}>
              <ImageIcon size={26} style={{ display: 'inline-block' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#6366F1', marginBottom: 2 }}>
              Click or drag
            </div>
            <div style={{ fontSize: 11, color: C.muted }}>
              PNG, JPG, SVG
            </div>
          </label>
        </div>
      )}
    </div>
  )
}

function SectionCard({ icon: Icon, title, sub, accent, accentBg, gridArea, onEdit, children }: {
  icon: React.ElementType; title: string; sub: string
  accent: string; accentBg: string; gridArea?: string; onEdit?: () => void; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', gridArea }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: accentBg, border: `1px solid ${accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={17} style={{ color: accent }} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{title}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{sub}</div>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9,
              border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <Edit3 size={14} strokeWidth={2} style={{ color: C.muted }} />
          </button>
        )}
      </div>
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
      </div>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Organization Profile</h1>
        <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Company information, registration details and platform configuration</p>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #1C2035 0%, #F2D000 50%, #E84855 100%)' }} />
        <div style={{ padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          {/* Illustration */}
          <div style={{ position: 'relative', marginBottom: 32 }}>
            <div style={{ width: 100, height: 100, borderRadius: 28, background: 'rgba(99,102,241,0.08)', border: '2px dashed rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={46} strokeWidth={1.2} style={{ color: '#6366F1' }} />
            </div>
            <div style={{ position: 'absolute', top: -10, right: -14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', border: '1.5px solid rgba(245,158,11,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={14} style={{ color: '#D97706' }} strokeWidth={2} />
            </div>
            <div style={{ position: 'absolute', bottom: -8, left: -16, width: 30, height: 30, borderRadius: '50%', background: 'rgba(14,168,106,0.12)', border: '1.5px solid rgba(14,168,106,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={13} style={{ color: '#0EA86A' }} strokeWidth={2} />
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, margin: '0 0 12px', letterSpacing: '-0.4px' }}>
            Set Up Your Company Profile
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, maxWidth: 480, margin: '0 0 20px' }}>
            Your organization profile is not configured yet. Add your company's identity, registration details, office locations and platform settings to get started.
          </p>

          <button onClick={onStart}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 50, padding: '0 36px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            <Building2 size={18} strokeWidth={2} />
            Create Profile
          </button>

          <p style={{ fontSize: 12, color: '#B0B4C8', marginTop: 16 }}>You can update all information later at any time</p>
        </div>
      </div>
    </div>
  )
}

// ── Create Profile Form ────────────────────────────────────────────────────────
function OfficeCard({ label, onDelete }: { label: string; onDelete?: () => void }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: '#F8F9FF', marginTop: 14 }}>
      <div style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{label}</span>
          {onDelete && (
            <button onClick={onDelete}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, border: `1px solid #FEE2E2`, background: '#FFF5F5', cursor: 'pointer', transition: 'all 0.13s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#FFF5F5' }}>
              <Trash2 size={13} style={{ color: '#E84855' }} strokeWidth={2} />
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <FInput label="Office Name" placeholder="e.g. Branch Office" />
          <FTextarea label="Street Address" placeholder="Full street address…" rows={2} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
          <FInput label="City"     placeholder="e.g. Mumbai" />
          <FInput label="State"    placeholder="e.g. Maharashtra" />
          <FInput label="Country"  placeholder="e.g. India" />
          <FInput label="PIN Code" placeholder="e.g. 400001" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <FInput label="Phone" placeholder="+91 22 0000 0000" />
          <FInput label="Email" placeholder="office@company.com" />
        </div>
      </div>
    </div>
  )
}

function CreateProfileForm({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  const [extraOffices, setExtraOffices] = useState<number[]>([])

  function addOffice() { setExtraOffices(prev => [...prev, Date.now()]) }
  function removeOffice(id: number) { setExtraOffices(prev => prev.filter(o => o !== id)) }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
          Organization Profile
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Create Profile</span>
      </div>

      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 4px', letterSpacing: '-0.3px' }}>Create Company Profile</h1>
        <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Fill in your organisation's details to complete the setup</p>
      </div>

      {/* ── Main layout: 3-col logo + 9-col sections ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap: 18 }}>

        {/* ── LEFT: Brand Logo (3 cols) ── */}
        <div style={{ height: 'fit-content' }}>
          <SectionCard icon={ImageIcon} title="Brand Logo" sub="Upload company logo" accent="#6366F1" accentBg="rgba(99,102,241,0.09)" gridArea="">
            <FLogoUpload label="" />
          </SectionCard>
        </div>

        {/* ── RIGHT: All sections (9 cols) — nested grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

          {/* ── Company Identity — full width ── */}
          <div style={{ gridColumn: '1 / -1' }}>
            <SectionCard icon={Building2} title="Company Identity" sub="Core company information" accent="#6366F1" accentBg="rgba(99,102,241,0.09)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <FInput label="Company Name"       required placeholder="e.g. Concert IDC Private Limited" />
                <FInput label="Short Name / Brand" placeholder="e.g. Concert IDC" />
                <FSelect label="Industry"          required options={['IT Services & Consulting', 'Banking & Finance', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Education', 'Real Estate']} placeholder="Select industry…" />
                <FSelect label="Company Type"      required options={['Private Limited Company', 'Public Limited Company', 'LLP', 'Partnership', 'Proprietorship', 'OPC']} placeholder="Select type…" />
                <FInput label="Founded Year"       placeholder="e.g. 2018" />
                <FInput label="Website"            placeholder="e.g. www.concertidc.com" />
              </div>
              <FInput label="Tagline" placeholder="e.g. Building intelligent workforce solutions…" />
              <FTextarea label="About the Company" placeholder="Brief description of what your company does, sectors served, and key highlights…" rows={3} />
            </SectionCard>
          </div>

          {/* ── Contact Information ── */}
          <SectionCard icon={Phone} title="Contact Information" sub="Primary contacts and communication" accent="#6366F1" accentBg="rgba(99,102,241,0.09)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              <FInput label="Primary Contact Name" required placeholder="e.g. Kavitha Reddy" />
              <FInput label="Designation"          placeholder="e.g. HR Manager" />
              <FInput label="Office Email"         required placeholder="e.g. hr@concertidc.com" />
              <FInput label="Support Email"        placeholder="e.g. support@concertidc.com" />
              <FInput label="Phone Number"         required placeholder="e.g. +91 80 4567 8900" />
              <FInput label="LinkedIn Profile"     placeholder="e.g. linkedin.com/company/concertidc" />
            </div>
          </SectionCard>

          {/* ── Business Registration ── */}
          <SectionCard icon={Shield} title="Business Registration" sub="Legal numbers and certifications" accent="#0EA86A" accentBg="rgba(14,168,106,0.09)">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
              <FInput label="CIN"               placeholder="e.g. U72900KA2018PTC112345" />
              <FInput label="PAN"               placeholder="e.g. AABCC1234D" />
              <FInput label="GST Number"        placeholder="e.g. 29AABCC1234D1Z5" />
              <FInput label="MSME Registration" placeholder="e.g. UDYAM-KR-01-0012345" />
              <FInput label="ISO Certification" placeholder="e.g. ISO 9001:2015" />
              <FInput label="Other Licence"     placeholder="e.g. STPI Registration" />
            </div>
          </SectionCard>

          {/* ── Platform Configuration — full width ── */}
          <div style={{ gridColumn: '1 / -1' }}>
            <SectionCard icon={Clock} title="Platform Configuration" sub="Localisation and working schedule settings" accent="#E84855" accentBg="rgba(232,72,85,0.09)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
                <FSelect label="Timezone"       options={['Asia/Kolkata (IST +5:30)', 'UTC', 'America/New_York', 'Europe/London', 'Asia/Dubai']} placeholder="Select timezone…" />
                <FSelect label="Date Format"    options={['DD / MM / YYYY', 'MM / DD / YYYY', 'YYYY-MM-DD']} placeholder="Select format…" />
                <FSelect label="Currency"       options={['Indian Rupee (₹ INR)', 'US Dollar ($ USD)', 'Euro (€ EUR)', 'British Pound (£ GBP)']} placeholder="Select currency…" />
                <FSelect label="Financial Year" options={['April – March', 'January – December', 'July – June']} placeholder="Select period…" />
                <FSelect label="Working Days"   options={['Monday – Friday', 'Monday – Saturday', 'Custom']} placeholder="Select days…" />
                <FInput  label="Work Hours"     placeholder="e.g. 9:00 AM – 6:00 PM" />
                <FSelect label="Leave Policy"   options={['Indian Labour Law Compliant', 'Custom Policy', 'Global Standard']} placeholder="Select policy…" />
              </div>
            </SectionCard>
          </div>

          {/* ── Office Locations — full width ── */}
          <div style={{ gridColumn: '1 / -1', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(245,158,11,0.09)', border: '1px solid rgba(245,158,11,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={17} style={{ color: '#D97706' }} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Office Locations</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Registered and branch office addresses</div>
                </div>
              </div>
              <button onClick={addOffice} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface, color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                <Plus size={12} strokeWidth={2.5} /> Add Office
              </button>
            </div>

            <div style={{ padding: '22px 24px' }}>
              {/* Registered Office — full width */}
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: '#F8F9FF' }}>
                <div style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Registered Office</span>
                    <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(14,168,106,0.09)', color: '#0A8A58' }}>
                      Primary
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <FInput label="Office Name"  placeholder="e.g. Head Office" />
                    <FTextarea label="Street Address" placeholder="Full street address…" rows={2} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
                    <FInput label="City"     placeholder="e.g. Bangalore" />
                    <FInput label="State"    placeholder="e.g. Karnataka" />
                    <FInput label="Country"  placeholder="e.g. India" />
                    <FInput label="PIN Code" placeholder="e.g. 560103" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <FInput label="Phone" placeholder="+91 80 0000 0000" />
                    <FInput label="Email" placeholder="office@company.com" />
                  </div>
                </div>
              </div>

              {extraOffices.map((id, i) => (
                <OfficeCard key={id} label={`Branch Office ${i + 1}`} onDelete={() => removeOffice(id)} />
              ))}
            </div>
          </div>

        </div>{/* end nested 9-col grid */}

      </div>{/* end main 3-9 col grid */}

      {/* ── Footer ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '20px 0 8px', marginTop: 4, borderTop: `1px solid ${C.border}` }}>
        <button onClick={onBack}
          style={{ height: 44, padding: '0 22px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
          Cancel
        </button>
        <button onClick={onSave}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 44, padding: '0 28px', borderRadius: 11, border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', outline: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          <Briefcase size={15} strokeWidth={2} /> Save Profile
        </button>
      </div>
    </div>
  )
}

// ── Saving overlay ─────────────────────────────────────────────────────────────
function SavingOverlay() {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 4px' }}>Organization Profile</h1>
        <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Setting up your company profile…</p>
      </div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 20, padding: '80px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 68, height: 68, borderRadius: 20, background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round"
            style={{ animation: 'cpSpin 0.9s linear infinite' }}>
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Saving your profile…</div>
          <div style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Please wait while we set up your organisation</div>
        </div>
        <div style={{ width: 280, height: 4, borderRadius: 99, background: '#E8EAF2', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #6366F1, #818CF8)', animation: 'progressFill 1.5s ease-out forwards' }} />
        </div>
        <style>{`
          @keyframes progressFill { from { width: 0% } to { width: 100% } }
          @keyframes cpSpin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        `}</style>
      </div>
    </div>
  )
}

// ── Wrapper ────────────────────────────────────────────────────────────────────
export default function OrgProfileWrapperPage() {
  const [view, setView] = useState<View>('empty')

  function handleSave() {
    setView('saving')
    setTimeout(() => setView('profile'), 1800)
  }

  if (view === 'profile') return <OrgProfilePage />
  if (view === 'saving')  return <SavingOverlay />
  if (view === 'create')  return <CreateProfileForm onBack={() => setView('empty')} onSave={handleSave} />
  return <EmptyState onStart={() => setView('create')} />
}
