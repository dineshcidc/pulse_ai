import { useState } from 'react'
import {
  Plus, Upload, Search, Edit2, Trash2, ChevronDown,
  Package, AlertCircle, CheckCircle,
} from 'lucide-react'

/* ── Types ── */
type AllocationStatus = 'Available' | 'Allocated'
type AssetCategory = 'Desktop' | 'Laptop' | 'Tablet' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Headset' | 'Other'

interface Asset {
  id: number
  category: AssetCategory
  code: string
  description: string
  status: AllocationStatus
  allocatedTo?: string
  purchaseDate?: string
}

/* ── Mock Data ── */
const ASSETS: Asset[] = [
  { id: 1, category: 'Laptop', code: 'LAP-001', description: 'Dell XPS 13 - Intel i7, 16GB RAM', status: 'Allocated', allocatedTo: 'Sarah Johnson' },
  { id: 2, category: 'Laptop', code: 'LAP-002', description: 'MacBook Pro 16" - M3 Max', status: 'Available' },
  { id: 3, category: 'Laptop', code: 'LAP-003', description: 'ThinkPad X1 Carbon - Gen 11', status: 'Allocated', allocatedTo: 'Mike Chen' },
  { id: 4, category: 'Laptop', code: 'LAP-004', description: 'ASUS ZenBook 14" - Ryzen 7', status: 'Available' },
  { id: 5, category: 'Laptop', code: 'LAP-005', description: 'HP Pavilion 15" - Intel i5', status: 'Allocated', allocatedTo: 'Emma Wilson' },
  { id: 6, category: 'Laptop', code: 'LAP-006', description: 'Dell Latitude 15" - Business Edition', status: 'Available' },
  { id: 7, category: 'Laptop', code: 'LAP-007', description: 'Lenovo Yoga 9i - 2-in-1 Convertible', status: 'Allocated', allocatedTo: 'David Brown' },
  { id: 8, category: 'Laptop', code: 'LAP-008', description: 'MacBook Air M2 - 13"', status: 'Available' },
  { id: 9, category: 'Desktop', code: 'DSK-001', description: 'iMac 27" - M1 Pro, 32GB RAM', status: 'Available' },
  { id: 10, category: 'Desktop', code: 'DSK-002', description: 'Dell OptiPlex 7090 - Core i9', status: 'Allocated', allocatedTo: 'Lisa Garcia' },
  { id: 11, category: 'Desktop', code: 'DSK-003', description: 'HP EliteDesk 800 - Tower', status: 'Available' },
  { id: 12, category: 'Desktop', code: 'DSK-004', description: 'Lenovo ThinkCentre M90 - SFF', status: 'Allocated', allocatedTo: 'Tom Davis' },
  { id: 13, category: 'Monitor', code: 'MON-001', description: 'Dell UltraWide 34" - 3440x1440', status: 'Allocated', allocatedTo: 'Mike Chen' },
  { id: 14, category: 'Monitor', code: 'MON-002', description: 'LG 32" Curved Gaming Monitor', status: 'Available' },
  { id: 15, category: 'Monitor', code: 'MON-003', description: 'ASUS ProArt 27" - 4K Professional', status: 'Allocated', allocatedTo: 'Priya Sharma' },
  { id: 16, category: 'Monitor', code: 'MON-004', description: 'HP E243i 24" IPS', status: 'Available' },
  { id: 17, category: 'Monitor', code: 'MON-005', description: 'Dell S2721DGF 27" 1440p', status: 'Allocated', allocatedTo: 'Karthik Nair' },
  { id: 18, category: 'Monitor', code: 'MON-006', description: 'BenQ SW240 24" Color Accurate', status: 'Available' },
  { id: 19, category: 'Monitor', code: 'MON-007', description: 'ACER R240HY 24" Basic', status: 'Allocated', allocatedTo: 'Ravi Kumar' },
  { id: 20, category: 'Monitor', code: 'MON-008', description: 'ViewSonic VG2755 27" Business', status: 'Available' },
  { id: 21, category: 'Monitor', code: 'MON-009', description: 'Eizo FlexScan 27" Medical Grade', status: 'Allocated', allocatedTo: 'Nisha Patel' },
  { id: 22, category: 'Monitor', code: 'MON-010', description: 'Gigabyte M28U 28" 4K 120Hz', status: 'Available' },
  { id: 23, category: 'Monitor', code: 'MON-011', description: 'LG UltraFine 32UP550 Professional', status: 'Allocated', allocatedTo: 'Arjun Mehta' },
  { id: 24, category: 'Monitor', code: 'MON-012', description: 'Dell P2423D 24" QHD Office', status: 'Available' },
  { id: 25, category: 'Keyboard', code: 'KEY-001', description: 'Mechanical Keyboard - RGB', status: 'Available' },
  { id: 26, category: 'Keyboard', code: 'KEY-002', description: 'Logitech MX Keys Wireless', status: 'Allocated', allocatedTo: 'Divya Rao' },
  { id: 27, category: 'Keyboard', code: 'KEY-003', description: 'Keychron K3 Pro Mechanical', status: 'Available' },
  { id: 28, category: 'Keyboard', code: 'KEY-004', description: 'Microsoft Surface Keyboard', status: 'Allocated', allocatedTo: 'Sanjay Gupta' },
  { id: 29, category: 'Keyboard', code: 'KEY-005', description: 'Corsair K95 Platinum XT', status: 'Available' },
  { id: 30, category: 'Keyboard', code: 'KEY-006', description: 'SteelSeries Apex Pro TKL', status: 'Allocated', allocatedTo: 'James Wilson' },
  { id: 31, category: 'Keyboard', code: 'KEY-007', description: 'Razer BlackWidow V4', status: 'Available' },
  { id: 32, category: 'Keyboard', code: 'KEY-008', description: 'Leopold FC900R Topre', status: 'Allocated', allocatedTo: 'Anjali Singh' },
  { id: 33, category: 'Keyboard', code: 'KEY-009', description: 'Varmilo VA88M ANSI', status: 'Available' },
  { id: 34, category: 'Keyboard', code: 'KEY-010', description: 'Ducky One 2 RGB', status: 'Allocated', allocatedTo: 'Karthik Nair' },
  { id: 35, category: 'Keyboard', code: 'KEY-011', description: 'Filco Majestouch 2 TKL', status: 'Available' },
  { id: 36, category: 'Keyboard', code: 'KEY-012', description: 'Cherry MX Mechanical Board', status: 'Allocated', allocatedTo: 'Ravi Kumar' },
  { id: 37, category: 'Keyboard', code: 'KEY-013', description: 'Ikbc F108 RGB Mechanical', status: 'Available' },
  { id: 38, category: 'Keyboard', code: 'KEY-014', description: 'Happy Hacking Keyboard', status: 'Allocated', allocatedTo: 'Nisha Patel' },
  { id: 39, category: 'Keyboard', code: 'KEY-015', description: 'Drop CTRL Mechanical Board', status: 'Available' },
  { id: 40, category: 'Mouse', code: 'MOU-001', description: 'Logitech MX Master 3S', status: 'Allocated', allocatedTo: 'Emma Wilson' },
  { id: 41, category: 'Mouse', code: 'MOU-002', description: 'Razer DeathAdder V3', status: 'Available' },
  { id: 42, category: 'Mouse', code: 'MOU-003', description: 'SteelSeries Rival 600', status: 'Allocated', allocatedTo: 'Arjun Mehta' },
  { id: 43, category: 'Tablet', code: 'TAB-001', description: 'iPad Pro 12.9" - M2 Chip', status: 'Allocated', allocatedTo: 'David Brown' },
  { id: 44, category: 'Tablet', code: 'TAB-002', description: 'Samsung Galaxy Tab S8 Ultra', status: 'Available' },
  { id: 45, category: 'Tablet', code: 'TAB-003', description: 'Microsoft Surface Pro 9', status: 'Allocated', allocatedTo: 'Divya Rao' },
  { id: 46, category: 'Tablet', code: 'TAB-004', description: 'Lenovo Tab M10 Plus', status: 'Available' },
  { id: 47, category: 'Tablet', code: 'TAB-005', description: 'Apple iPad Air 5th Gen', status: 'Allocated', allocatedTo: 'Sanjay Gupta' },
  { id: 48, category: 'Headset', code: 'HEAD-001', description: 'Sony WH-1000XM5 Wireless', status: 'Available' },
  { id: 49, category: 'Headset', code: 'HEAD-002', description: 'Bose QuietComfort 45', status: 'Allocated', allocatedTo: 'James Wilson' },
  { id: 50, category: 'Headset', code: 'HEAD-003', description: 'Sennheiser Momentum 4', status: 'Available' },
]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

export default function AdminAssetsListPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [assets, setAssets] = useState(ASSETS)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  // Calculate category counts
  const categories = ['Desktop', 'Laptop', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Other'] as AssetCategory[]
  const categoryCounts = categories.map(cat => ({
    category: cat,
    count: assets.filter(a => a.category === cat).length,
  }))

  // Filter assets
  const filtered = assets.filter(a => {
    const matchSearch = !search || a.code.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'All' || a.category === selectedCategory
    const matchStatus = statusFilter === 'All Status' || a.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const totalAssets = assets.length

  function handleDelete(id: number) {
    setAssets(p => p.filter(a => a.id !== id))
    setDeleteId(null)
  }

  const getStatusConfig = (status: AllocationStatus) => {
    return status === 'Available'
      ? { color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.22)', icon: CheckCircle }
      : { color: '#D97706', bg: 'rgba(217,119,6,0.08)', border: 'rgba(217,119,6,0.22)', icon: AlertCircle }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between" style={{ padding: '0 0 16px 0' }}>
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Assets List</h1>
          </div>
          <p className="text-sm" style={{ color: '#787878', fontWeight: 500 }}>Manage and track all company assets including desktops, laptops, and equipment</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate?.('upload-bulk-assets')}
            style={{ height: 40, padding: '0 16px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <Upload size={16} strokeWidth={2} /> Upload Bulk
          </button>
          <button
            onClick={() => onNavigate?.('add-asset')}
            style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add Asset
          </button>
        </div>
      </div>

      {/* ── Search Bar & Filters ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by asset code or description..."
            style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ position: 'relative', flexShrink: 0, minWidth: 180 }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ width: '100%', height: 38, paddingLeft: 12, paddingRight: 32, borderRadius: 9, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", cursor: 'pointer', appearance: 'none', outline: 'none', transition: 'border-color 0.15s, background 0.15s' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.background = '#fff' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
          >
            <option value="All Status">All Status</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── 2:10 Grid Layout (Scrollable) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 5fr', gap: 16, height: 'auto', overflow: 'visible', marginTop: 8 }}>

        {/* ── LEFT: Category Card (2 columns) ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px', display: 'flex', flexDirection: 'column', gap: 6, height: 'fit-content' }}>
          {/* All Categories Button */}
          <button
            onClick={() => setSelectedCategory('All')}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: selectedCategory === 'All' ? '1.5px solid #6366F1' : '1.5px solid transparent',
              background: selectedCategory === 'All' ? 'rgba(99,102,241,0.10)' : 'transparent',
              color: selectedCategory === 'All' ? '#6366F1' : C.navy,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.14s',
              fontFamily: 'inherit',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onMouseEnter={e => {
              if (selectedCategory !== 'All') {
                e.currentTarget.style.background = C.surface
              }
            }}
            onMouseLeave={e => {
              if (selectedCategory !== 'All') {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <span>All Categories</span>
            <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>{totalAssets}</span>
          </button>

          {/* Category List */}
          {categoryCounts.filter(c => c.count > 0).map(({ category, count }) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: selectedCategory === category ? '1.5px solid #6366F1' : '1.5px solid transparent',
                background: selectedCategory === category ? 'rgba(99,102,241,0.10)' : 'transparent',
                color: selectedCategory === category ? '#6366F1' : C.navy,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.14s',
                fontFamily: 'inherit',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={e => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = C.surface
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span>{category}</span>
              <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>({count})</span>
            </button>
          ))}
        </div>

        {/* ── RIGHT: Assets Table (Scrollable) ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'auto', display: 'flex', flexDirection: 'column', height: 'auto' }}>
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, padding: 40 }}>
              <Package size={40} strokeWidth={1.2} style={{ color: '#D0D3E4', marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>No assets found</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try adjusting your search or category filter</div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.9fr 2.2fr 1fr 0.7fr', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</div>
              </div>

              {/* Table Rows */}
              {filtered.map(asset => {
                const statusConfig = getStatusConfig(asset.status)
                return (
                  <div
                    key={asset.id}
                    style={{ display: 'grid', gridTemplateColumns: '0.8fr 0.9fr 2.2fr 1fr 0.7fr', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${C.border}`, alignItems: 'center', transition: 'background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Category */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{asset.category}</div>

                    {/* Code */}
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#6366F1', fontFamily: 'monospace' }}>{asset.code}</div>

                    {/* Description */}
                    <div style={{ fontSize: 12.5, color: '#5A6080', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.description}</div>

                    {/* Status Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '5px 12px', borderRadius: 8, background: statusConfig.bg, color: statusConfig.color, fontSize: 12, fontWeight: 600, width: 'fit-content' }}>
                      {asset.status}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        title="Edit"
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                      >
                        <Edit2 size={14} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => setDeleteId(asset.id)}
                        title="Delete"
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px 24px', width: 380, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete Asset</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>Are you sure you want to delete this asset?<br />This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: '#E84855', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.background = '#D43F4B' }} onMouseLeave={e => { e.currentTarget.style.background = '#E84855' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
