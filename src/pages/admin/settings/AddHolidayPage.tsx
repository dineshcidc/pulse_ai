import { useState } from 'react'
import { ArrowLeft, CalendarDays, ChevronDown, CheckCircle2, RefreshCw } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

type HolidayType = 'national' | 'company' | 'optional'

const TYPE_CFG: Record<HolidayType, { label: string; desc: string; color: string; bg: string; border: string }> = {
  national: { label: 'National',  desc: 'Government-declared public holiday', color: '#DC2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.22)'   },
  company:  { label: 'Company',   desc: 'Organisation-wide paid holiday',      color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.22)'   },
  optional: { label: 'Optional',  desc: 'Employee can choose up to 2/year',    color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.22)'  },
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

interface HolidayForm {
  name: string; type: HolidayType | ''
  day: string; month: string; year: string
  description: string; recurring: boolean
}

const EMPTY: HolidayForm = { name: '', type: '', day: '', month: '', year: '2026', description: '', recurring: true }

function daysInMonth(month: string, year: string) {
  const m = parseInt(month), y = parseInt(year)
  if (isNaN(m) || isNaN(y)) return 31
  return new Date(y, m + 1, 0).getDate()
}

function computeDayOfWeek(day: string, month: string, year: string) {
  const d = parseInt(day), m = parseInt(month), y = parseInt(year)
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null
  const date = new Date(y, m, d)
  if (date.getMonth() !== m) return null
  return DAY_NAMES[date.getDay()]
}

function iStyle(hasError?: boolean): React.CSSProperties {
  return {
    width: '100%', height: 40, padding: '0 12px',
    border: `1px solid ${hasError ? '#E84855' : C.border}`, borderRadius: 10,
    fontSize: 13.5, color: C.navy, background: '#fff',
    outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s, background 0.15s',
    appearance: 'none' as const,
  }
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 7 }}>
        {label}{required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 11.5, color: '#E84855', margin: '5px 0 0', fontWeight: 500 }}>{error}</p>}
    </div>
  )
}

export interface NewHoliday {
  date: string; name: string; type: HolidayType; day: string; month: number; year: number
}

export default function AddHolidayPage({ onBack, onSave }: {
  onBack: () => void
  onSave: (h: NewHoliday) => void
}) {
  const [form, setForm]     = useState<HolidayForm>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof HolidayForm, string>>>({})

  const dayOfWeek   = computeDayOfWeek(form.day, form.month, form.year)
  const maxDays     = daysInMonth(form.month, form.year)
  const previewDate = form.day && form.month !== ''
    ? `${String(parseInt(form.day)).padStart(2, '0')} ${MONTH_SHORT[parseInt(form.month)]}`
    : null
  const typeCfg = form.type ? TYPE_CFG[form.type] : null

  function validate() {
    const e: Partial<Record<keyof HolidayForm, string>> = {}
    if (!form.name.trim())  e.name  = 'Holiday name is required'
    if (!form.type)         e.type  = 'Select a holiday type'
    if (form.month === '')  e.month = 'Select a month'
    if (!form.day)          e.day   = 'Select a day'
    if (!form.year)         e.year  = 'Select a year'
    if (form.day && form.month !== '' && !computeDayOfWeek(form.day, form.month, form.year))
      e.day = 'Invalid date'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return
    onSave({
      date: previewDate!,
      name: form.name.trim(),
      type: form.type as HolidayType,
      day: dayOfWeek!,
      month: parseInt(form.month),
      year: parseInt(form.year),
    })
  }

  const selectStyle = (hasError?: boolean): React.CSSProperties => ({
    ...iStyle(hasError),
    cursor: 'pointer',
    paddingRight: 32,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B90A7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
  })

  const fi = (field: keyof HolidayForm) => ({
    onFocus:  (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = '#6366F1'
      if (e.currentTarget.value) e.currentTarget.style.background = '#F0F4FF'
      else e.currentTarget.style.background = '#fff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = errors[field] ? '#E84855' : C.border
      e.currentTarget.style.background = e.currentTarget.value ? '#F0F4FF' : '#fff'
    },
  })

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px', borderRadius: 10,
          border: `1.5px solid ${C.border}`, background: '#fff',
          fontSize: 13, fontWeight: 600, color: C.muted,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#A5B4FC'; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Working Hours & Holidays</span>
        <span style={{ color: '#C8CCDC', fontSize: 14 }}>/</span>
        <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Add Holiday</span>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Add Holiday</h1>
        <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Add a new holiday to the organisation's annual calendar</p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 22, alignItems: 'start' }}>

        {/* ── Left: Form ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>

          {/* Section: Holiday Details */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.surface}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarDays size={16} style={{ color: '#F59E0B' }} strokeWidth={1.8} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Holiday Details</span>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>Name, type and description</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>

              {/* Name */}
              <Field label="Holiday Name" required error={errors.name}>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Diwali, Christmas Day"
                  style={{ ...iStyle(!!errors.name), background: form.name ? '#F0F4FF' : '#fff' }}
                  {...fi('name')}
                />
              </Field>

              {/* Type */}
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, display: 'block', marginBottom: 10 }}>
                  Holiday Type <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {(Object.entries(TYPE_CFG) as [HolidayType, typeof TYPE_CFG[HolidayType]][]).map(([key, cfg]) => {
                    const active = form.type === key
                    return (
                      <button key={key} onClick={() => { setForm(f => ({ ...f, type: key })); setErrors(er => ({ ...er, type: undefined })) }} style={{
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                        border: `1.5px solid ${active ? cfg.color : errors.type ? '#E84855' : C.border}`,
                        background: active ? cfg.bg : '#fff',
                        fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left' as const,
                      }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.background = cfg.bg + '60' } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = errors.type ? '#E84855' : C.border; e.currentTarget.style.background = '#fff' } }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: active ? cfg.color : '#D8DBE8', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: active ? cfg.color : C.muted }}>{cfg.label}</span>
                          {active && <CheckCircle2 size={13} style={{ color: cfg.color, marginLeft: 'auto' }} strokeWidth={2.5} />}
                        </div>
                        <p style={{ fontSize: 11, color: C.muted, margin: 0, lineHeight: 1.4 }}>{cfg.desc}</p>
                      </button>
                    )
                  })}
                </div>
                {errors.type && <p style={{ fontSize: 11.5, color: '#E84855', margin: '6px 0 0', fontWeight: 500 }}>{errors.type}</p>}
              </div>

              {/* Description */}
              <Field label="Description" error={errors.description}>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Optional note about this holiday…"
                  rows={2}
                  style={{
                    ...iStyle(), height: 'auto', resize: 'none' as const,
                    paddingTop: 10, lineHeight: 1.6,
                    background: form.description ? '#F0F4FF' : '#fff',
                  }}
                  {...fi('description')}
                />
              </Field>
            </div>
          </div>

          {/* Section: Date & Schedule */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, paddingBottom: 16, borderBottom: `1px solid ${C.surface}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChevronDown size={16} style={{ color: '#6366F1' }} strokeWidth={1.8} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Date & Schedule</span>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>When this holiday falls</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 18 }}>

              {/* Month + Day + Year row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr', gap: 14 }}>
                <Field label="Month" required error={errors.month}>
                  <select value={form.month} onChange={e => { setForm(f => ({ ...f, month: e.target.value, day: '' })); setErrors(er => ({ ...er, month: undefined })) }}
                    style={selectStyle(!!errors.month)} {...fi('month')}>
                    <option value="">Select month…</option>
                    {MONTH_NAMES.map((m, i) => <option key={i} value={String(i)}>{m}</option>)}
                  </select>
                </Field>

                <Field label="Day" required error={errors.day}>
                  <select value={form.day} onChange={e => { setForm(f => ({ ...f, day: e.target.value })); setErrors(er => ({ ...er, day: undefined })) }}
                    style={selectStyle(!!errors.day)} {...fi('day')} disabled={form.month === ''}>
                    <option value="">Day</option>
                    {Array.from({ length: maxDays }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d)}>{String(d).padStart(2, '0')}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Year" required error={errors.year}>
                  <select value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                    style={selectStyle(!!errors.year)} {...fi('year')}>
                    {[2024, 2025, 2026, 2027, 2028].map(y => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                </Field>
              </div>

              {/* Day of week (computed) */}
              {dayOfWeek && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#F0F4FF', borderRadius: 10, border: '1px solid #C7D2FE' }}>
                  <CalendarDays size={13} style={{ color: '#4338CA' }} strokeWidth={1.8} />
                  <span style={{ fontSize: 13, color: '#3730A3', fontWeight: 600 }}>
                    Falls on a <strong>{dayOfWeek}</strong>
                  </span>
                </div>
              )}

              {/* Recurring toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <RefreshCw size={14} style={{ color: C.muted }} strokeWidth={1.8} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>Repeat Every Year</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Automatically add this holiday to future years</div>
                  </div>
                </div>
                {/* Toggle */}
                <button onClick={() => setForm(f => ({ ...f, recurring: !f.recurring }))} style={{
                  width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                  background: form.recurring ? '#1C2035' : '#D8DBE8',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                }}>
                  <div style={{
                    position: 'absolute', top: 3, borderRadius: '50%',
                    width: 18, height: 18, background: '#fff',
                    left: form.recurring ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingBottom: 8 }}>
            <button onClick={onBack} style={{
              height: 42, padding: '0 22px', borderRadius: 11,
              border: `1.5px solid ${C.border}`, background: '#fff',
              fontSize: 14, fontWeight: 600, color: C.muted,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Cancel
            </button>
            <button onClick={handleSave} style={{
              height: 42, padding: '0 28px', borderRadius: 11, border: 'none',
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', fontSize: 14, fontWeight: 700, color: '#fff',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              <CalendarDays size={15} strokeWidth={2} /> Add to Calendar
            </button>
          </div>
        </div>

        {/* ── Right: Preview ── */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 16, position: 'sticky' as const, top: 16 }}>

          {/* Preview card */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }}>Preview</p>
            </div>

            {/* Holiday row preview */}
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Date block */}
                <div style={{
                  flexShrink: 0, width: 52, height: 52, borderRadius: 12,
                  background: previewDate && typeCfg ? typeCfg.bg : '#ECEEF5',
                  border: `1px solid ${previewDate && typeCfg ? typeCfg.border : C.border}`,
                  display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', gap: 1,
                }}>
                  {previewDate ? (
                    <>
                      <span style={{ fontSize: 16, fontWeight: 800, color: typeCfg ? typeCfg.color : C.navy, lineHeight: 1 }}>{previewDate.split(' ')[0]}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: typeCfg ? typeCfg.color : C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>{previewDate.split(' ')[1]}</span>
                    </>
                  ) : (
                    <CalendarDays size={18} style={{ color: '#C0C4D8' }} strokeWidth={1.4} />
                  )}
                </div>

                {/* Name + day */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: form.name ? C.navy : C.muted, marginBottom: 3 }}>
                    {form.name || 'Holiday Name'}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>
                    {dayOfWeek ?? (form.day && form.month !== '' ? 'Invalid date' : 'Day of week')}
                  </div>
                </div>

                {/* Type badge */}
                {typeCfg ? (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px',
                    borderRadius: 99, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    color: typeCfg.color, background: typeCfg.bg, border: `1px solid ${typeCfg.border}`,
                  }}>
                    {typeCfg.label}
                  </span>
                ) : (
                  <span style={{ fontSize: 11.5, color: '#C0C4D8', fontStyle: 'italic', flexShrink: 0 }}>No type</span>
                )}
              </div>

              {form.description && (
                <p style={{ fontSize: 12.5, color: C.muted, margin: '14px 0 0', lineHeight: 1.5, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
                  {form.description}
                </p>
              )}
            </div>

            {/* Recurring indicator */}
            {form.recurring && (
              <div style={{ padding: '10px 20px', background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={11} style={{ color: C.muted }} strokeWidth={1.8} />
                <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Repeats every year</span>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '18px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 14px' }}>Summary</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 0 }}>
              {[
                { label: 'Name',        val: form.name        || '—' },
                { label: 'Type',        val: form.type ? TYPE_CFG[form.type].label : '—' },
                { label: 'Date',        val: previewDate ? `${previewDate}, ${form.year}` : '—' },
                { label: 'Day',         val: dayOfWeek        || '—' },
                { label: 'Recurring',   val: form.recurring ? 'Yes, every year' : 'One-time' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #F0F1F7' : 'none',
                }}>
                  <span style={{ fontSize: 12.5, color: C.muted }}>{row.label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
