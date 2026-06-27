import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'

/* ── Types ── */
type AssetCategory = 'Desktop' | 'Laptop' | 'Tablet' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Headset' | 'Other'
type AssetStatus = 'Available' | 'Allocated'

interface FormData {
  category: AssetCategory | 'New'
  newCategory: string
  code: string
  description: string
  status: AssetStatus
}

const EXISTING_CATEGORIES: AssetCategory[] = ['Desktop', 'Laptop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Other']
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

export default function AdminAddAssetPage({ onBack, onSave }: { onBack: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState<FormData>({
    category: 'Desktop',
    newCategory: '',
    code: '',
    description: '',
    status: 'Available',
  })
  const [loading, setLoading] = useState(false)
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)

  const isValid = formData.code.trim() && formData.description.trim() && (formData.category !== 'New' || formData.newCategory.trim())

  async function handleSave() {
    if (!isValid) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    const finalCategory = formData.category === 'New' ? formData.newCategory : formData.category

    onSave({
      category: finalCategory,
      code: formData.code,
      description: formData.description,
      status: formData.status,
    })

    setLoading(false)
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
        <span style={{ fontSize: 13, color: C.navy, fontWeight: 600 }}>Add Asset</span>
      </div>

      {/* ── Form Card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: 24 }}>

        {/* ── Category & Code Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

          {/* ── Asset Category ── */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Category</label>
            <select
              value={formData.category}
              onChange={e => {
                setFormData(p => ({ ...p, category: e.target.value as AssetCategory | 'New' }))
                if (e.target.value === 'New') setShowNewCategoryInput(true)
                else setShowNewCategoryInput(false)
              }}
              style={{ width: '100%', height: 40, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            >
              {EXISTING_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              <option value="New">+ Create New Category</option>
            </select>

            {showNewCategoryInput && (
              <div style={{ marginTop: 12, position: 'relative' }}>
                <input
                  type="text"
                  value={formData.newCategory}
                  onChange={e => setFormData(p => ({ ...p, newCategory: e.target.value }))}
                  placeholder="Enter new category name..."
                  style={{ width: '100%', height: 40, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
                />
              </div>
            )}
          </div>

          {/* ── Asset Code ── */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData(p => ({ ...p, code: e.target.value }))}
              placeholder="e.g., LAP-001, DSK-002"
              style={{ width: '100%', height: 40, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
            />
          </div>
        </div>

        {/* ── Asset Description ── */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Enter detailed description of the asset..."
            rows={5}
            style={{ width: '100%', padding: '12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', resize: 'none', transition: 'border-color 0.15s, background 0.15s' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          />
        </div>

        {/* ── Asset Status ── */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Status</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['Available', 'Allocated'] as AssetStatus[]).map(status => {
              const isSelected = formData.status === status
              const statusColor = status === 'Available' ? '#0A8A58' : '#D97706'
              const statusBg = status === 'Available' ? 'rgba(14,168,106,0.10)' : 'rgba(217,119,6,0.08)'

              return (
                <button
                  key={status}
                  onClick={() => setFormData(p => ({ ...p, status }))}
                  style={{
                    padding: '8px 16px',
                    height: 'auto',
                    borderRadius: 8,
                    border: isSelected ? `1.5px solid ${statusColor}` : `1px solid ${C.border}`,
                    background: isSelected ? statusBg : '#fff',
                    color: isSelected ? statusColor : C.navy,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.14s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = C.surface
                      e.currentTarget.style.borderColor = '#C8CCE0'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = '#fff'
                      e.currentTarget.style.borderColor = C.border
                    }
                  }}
                >
                  {status}
                </button>
              )
            })}
          </div>
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
            onClick={handleSave}
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
                Saving...
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2} />
                Save Asset
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
