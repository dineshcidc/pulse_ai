import { useRef } from 'react'
import { Upload, Info, FileSpreadsheet } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

interface Props {
  file: string | null
  onFile: (name: string | null) => void
  /* Bulk (designation-wise) upload shows a leading Designation column */
  withDesignation?: boolean
}

/* Shared Excel-import UI: format info message + dashed upload box */
export default function KpiExcelUpload({ file, onFile, withDesignation = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const columns = withDesignation
    ? ['Designation', 'Criteria Name', 'Stage', 'Weightage', 'Description']
    : ['Criteria Name', 'Stage', 'Weightage', 'Description']

  return (
    <>
      {/* Info message: required column order */}
      <div style={{ display: 'flex', gap: 11, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 12, padding: '13px 15px', marginBottom: 18 }}>
        <Info size={17} strokeWidth={2} style={{ color: C.indigo, flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            Keep the Excel columns in this exact order
          </div>
          <div className="flex items-center gap-2" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
            {columns.map((col, i, arr) => (
              <div key={col} className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#5A6080', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#8B90A7', background: '#EDEFF5', borderRadius: 5, padding: '1px 6px' }}>{i + 1}</span>
                  {col}
                </span>
                {i < arr.length - 1 && <span style={{ color: '#B8BCD0', fontSize: 13 }}>→</span>}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 9, lineHeight: 1.5 }}>
            First row must be the header. <strong style={{ color: '#5A6080' }}>Stage</strong> must be one of Q1, Q2, Q3, Annual. Supported formats: <strong style={{ color: '#5A6080' }}>.xlsx, .xls</strong>
          </div>
        </div>
      </div>

      {/* Upload box */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={e => onFile(e.target.files?.[0]?.name ?? null)}
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center cursor-pointer transition-all duration-150"
        style={{
          border: `1.5px dashed ${file ? 'rgba(14,168,106,0.5)' : '#C8CCE0'}`,
          borderRadius: 14, padding: '30px 20px', textAlign: 'center',
          background: file ? 'rgba(14,168,106,0.05)' : C.surface,
        }}
        onMouseEnter={e => { if (!file) e.currentTarget.style.borderColor = C.indigo }}
        onMouseLeave={e => { if (!file) e.currentTarget.style.borderColor = '#C8CCE0' }}
      >
        <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 13, background: file ? 'rgba(14,168,106,0.12)' : 'rgba(99,102,241,0.10)', marginBottom: 12 }}>
          {file
            ? <FileSpreadsheet size={24} strokeWidth={1.8} style={{ color: '#0A7040' }} />
            : <Upload size={22} strokeWidth={1.9} style={{ color: C.indigo }} />}
        </div>
        {file ? (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{file}</div>
            <div style={{ fontSize: 12, color: C.indigo, fontWeight: 600, marginTop: 4 }}>Click to choose a different file</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Click to upload or drag &amp; drop</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Excel file (.xlsx, .xls)</div>
          </>
        )}
      </div>
    </>
  )
}
