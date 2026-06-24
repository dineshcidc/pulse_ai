import { Eye } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

interface ImageUploadCardProps {
  name: string
  size: string
  preview: string
  onDelete: () => void
  onView: () => void
}

export default function ImageUploadCard({ name, size, preview, onDelete, onView }: ImageUploadCardProps) {
  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, background: '#fff' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden', background: C.hover }}>
        <img src={preview} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

        {/* Overlay on Hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(28,32,53,0.50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.opacity = '1'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = '0'
          }}
          onClick={onView}
        >
          <Eye size={28} style={{ color: '#fff' }} />
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: '10px' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: C.navy, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </p>
        <p style={{ fontSize: 9, color: C.muted, margin: 0 }}>{size}</p>
      </div>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 28,
          height: 28,
          borderRadius: 6,
          border: 'none',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s',
          fontSize: 14,
          zIndex: 10,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.85)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)'
        }}
      >
        ×
      </button>
    </div>
  )
}
