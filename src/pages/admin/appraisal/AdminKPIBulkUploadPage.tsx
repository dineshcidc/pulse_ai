import { useState } from 'react'
import { ArrowLeft, Table2, Check, ChevronDown } from 'lucide-react'
import KpiExcelUpload from './KpiExcelUpload'

interface Props {
  onBack: () => void
  onSaved?: (msg: string) => void
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

/* Per-stage chip palette (kept in sync with the template detail page) */
const STAGE_META: Record<string, { color: string; bg: string }> = {
  Q1:     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  Q2:     { color: '#6366F1', bg: 'rgba(99,102,241,0.10)' },
  Q3:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)' },
  Annual: { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)' },
}

/* Sample structure — how the Excel should be organised, designation-wise */
const SAMPLE: { designation: string; rows: { name: string; stage: string; wt: number; desc: string }[] }[] = [
  {
    designation: 'UI/UX Designer',
    rows: [
      { name: 'AI Enabled Productivity', stage: 'Q1', wt: 20, desc: 'Use of AI tools to improve daily productivity.' },
      { name: 'Quality & Consistency',   stage: 'Q1', wt: 20, desc: 'Accuracy and consistency of work delivered.' },
    ],
  },
  {
    designation: 'Developer',
    rows: [
      { name: 'Technical Expertise', stage: 'Q1', wt: 20, desc: 'Depth of role-specific technical knowledge.' },
      { name: 'Timely Delivery',     stage: 'Q2', wt: 20, desc: 'Delivering work within the planned timeline.' },
    ],
  },
]

export default function AdminKPIBulkUploadPage({ onBack, onSaved }: Props) {
  const [file, setFile] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sampleOpen, setSampleOpen] = useState(true)

  function handleSave() {
    if (!file || saving) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onSaved?.('Bulk KPI templates uploaded successfully')
      onBack()
    }, 900)
  }

  const SGRID = '26px 1.5fr 52px 62px 1.7fr'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes kbuSpin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          title="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
        >
          KPI Templates
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Bulk Upload</span>
      </div>

      {/* ── Title + subtitle ── */}
      <div style={{ marginBottom: 18 }}>
        <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Bulk Upload</h1>
        <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
          Upload KPI criteria for multiple designations at once through a single Excel file
        </p>
      </div>

      {/* ── 3 : 9 layout ── */}
      <div className="kbu-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap: 20, alignItems: 'start' }}>
        {/* Left (3) — sample structure */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <button
            onClick={() => setSampleOpen(o => !o)}
            className="flex items-center justify-between w-full cursor-pointer transition-colors duration-150"
            style={{ padding: '14px 18px', borderBottom: sampleOpen ? `1px solid ${C.border}` : 'none', background: '#fff', border: 'none', fontFamily: 'inherit', textAlign: 'left' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <span className="flex items-center gap-2">
              <Table2 size={16} strokeWidth={2.2} style={{ color: C.indigo }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Sample File Structure</span>
            </span>
            <ChevronDown size={17} strokeWidth={2.2} style={{ color: C.muted, transform: sampleOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {sampleOpen && (
          <div style={{ padding: 14 }}>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflowX: 'auto' }}>
              <div style={{ minWidth: 420 }}>
                {/* spreadsheet header */}
                <div className="grid" style={{ gridTemplateColumns: SGRID, background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                  {['#', 'Criteria Name', 'Stage', 'Weightage', 'Description'].map((h, i) => (
                    <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.04em', padding: '8px 10px', borderRight: i < 4 ? `1px solid ${C.border}` : 'none' }}>{h}</span>
                  ))}
                </div>

                {SAMPLE.map((group, gi) => {
                  // running row number across the whole sheet
                  const startNo = SAMPLE.slice(0, gi).reduce((a, g) => a + g.rows.length, 0)
                  return (
                    <div key={group.designation}>
                      {/* designation group header (spans full width) */}
                      <div style={{ background: 'rgba(99,102,241,0.07)', borderTop: gi === 0 ? 'none' : `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '7px 10px', fontSize: 11.5, fontWeight: 800, color: C.indigo }}>
                        {group.designation}
                      </div>
                      {group.rows.map((r, ri) => {
                        const sm = STAGE_META[r.stage]
                        return (
                          <div key={r.name} className="grid" style={{ gridTemplateColumns: SGRID, borderTop: ri === 0 ? 'none' : `1px solid ${C.border}` }}>
                            <span style={{ fontSize: 10.5, color: '#B0B4C8', fontWeight: 600, padding: '8px 10px', borderRight: `1px solid ${C.border}`, background: C.surface }}>{startNo + ri + 1}</span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: C.navy, padding: '8px 10px', borderRight: `1px solid ${C.border}`, lineHeight: 1.35 }}>{r.name}</span>
                            <span style={{ padding: '8px 10px', borderRight: `1px solid ${C.border}` }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: sm.color, background: sm.bg, borderRadius: 999, padding: '2px 7px', whiteSpace: 'nowrap' }}>{r.stage}</span>
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#5A6080', padding: '8px 10px', borderRight: `1px solid ${C.border}` }}>{r.wt}</span>
                            <span style={{ fontSize: 10.5, color: '#8B90A7', padding: '8px 10px', lineHeight: 1.35 }}>{r.desc}</span>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
              Group rows under each designation, keeping the column order <strong style={{ color: '#5A6080' }}>Designation → Criteria Name → Stage → Weightage → Description</strong>.
            </p>
          </div>
          )}
        </div>

        {/* Right (9) — excel upload */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div className="flex items-center gap-2" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Excel Upload</span>
          </div>

          <div style={{ padding: 20 }}>
            <KpiExcelUpload file={file} onFile={setFile} withDesignation />
          </div>

          {/* Save / Cancel */}
          <div className="flex items-center justify-end gap-3" style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}` }}>
            <button
              onClick={onBack}
              className="cursor-pointer transition-all duration-150"
              style={{ height: 42, padding: '0 20px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!file || saving}
              className="inline-flex items-center gap-2 border-none transition-all duration-150"
              style={{
                height: 42, padding: '0 24px', borderRadius: 11, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                background: file ? C.indigo : '#E4E6EF',
                color: file ? '#fff' : '#B0B4C8',
                cursor: file && !saving ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (file && !saving) e.currentTarget.style.background = '#4F46E5' }}
              onMouseLeave={e => { if (file && !saving) e.currentTarget.style.background = C.indigo }}
            >
              {saving
                ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'kbuSpin 0.8s linear infinite' }} /> Saving…</>
                : <><Check size={16} strokeWidth={2.4} /> Save</>}
            </button>
          </div>
        </div>
      </div>

      {/* stack the 3:9 grid on narrow screens */}
      <style>{`@media (max-width: 900px){ .kbu-grid{ grid-template-columns: 1fr !important } }`}</style>
    </div>
  )
}
