import { useState, useRef } from 'react'
import { ArrowLeft, Upload, FileText, X } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

export default function AdminUploadBulkAssetsPage({ onBack }: { onBack: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isValid = selectedFile !== null

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setSelectedFile(file)
    }
    e.target.value = ''
  }

  async function handleSubmit() {
    if (!isValid) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))

    console.log('Uploading file:', selectedFile?.name)
    setLoading(false)
    onBack()
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

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
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>Assets List</span>
        <span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/</span>
        <span style={{ fontSize: 13, color: C.navy, fontWeight: 600 }}>Upload Bulk Assets</span>
      </div>

      {/* ── Form Card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 24 }}>

        {/* ── Information Section ── */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: '0 0 8px 0' }}>Bulk Upload Assets</h2>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0, lineHeight: 1.6 }}>
            Import multiple assets at once by uploading an Excel file. Your file should contain columns for Asset Category, Asset Code, Asset Description, and Status (Available/Allocated). Each row will be added as a new asset to the system.
          </p>
        </div>

        {/* ── File Upload Box ── */}
        <div style={{ marginBottom: 32 }}>
          {!selectedFile ? (
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed #D0D3E4`,
                borderRadius: 14,
                padding: '48px 32px',
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
              <Upload size={40} style={{ color: '#8B90A7', marginBottom: 12 }} strokeWidth={1.5} />
              <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: '0 0 4px 0' }}>Drop Excel file here or click to browse</p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Supported formats: .xlsx, .xls, .csv</p>
            </div>
          ) : (
            <div style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} style={{ color: '#6366F1' }} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'rgba(232,72,85,0.10)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s', flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                  title="Remove file"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                style={{ marginTop: 12, width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
              >
                Choose Different File
              </button>
            </div>
          )}
        </div>

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={onBack}
            style={{ padding: '0 24px', height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{ padding: '0 28px', height: 44, borderRadius: 12, border: 'none', background: isValid && !loading ? '#6366F1' : 'rgba(99,102,241,0.35)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: isValid && !loading ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { if (isValid && !loading) e.currentTarget.style.background = '#4F52C8' }}
            onMouseLeave={e => { if (isValid && !loading) e.currentTarget.style.background = '#6366F1' }}
          >
            {loading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} strokeWidth={2} />
                Submit
              </>
            )}
          </button>
        </div>

        <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFileSelect} accept=".xlsx,.xls,.csv" />
      </div>

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
