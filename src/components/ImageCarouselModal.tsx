import { useState } from 'react'

const C = { border: '#E8EAF2' }

interface ImageCarouselModalProps {
  images: string[]
  initialIndex?: number
  onClose: () => void
}

export default function ImageCarouselModal({ images, initialIndex = 0, onClose }: ImageCarouselModalProps) {
  const [currentIdx, setCurrentIdx] = useState(initialIndex)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(10,12,28,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'relative',
          width: '90vw',
          height: '92vh',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 20px 60px rgba(10,12,28,0.30)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image Container */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            overflow: 'hidden',
            padding: '24px',
          }}
        >
          <img
            src={images[currentIdx]}
            alt={`Image ${currentIdx + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: 10,
              border: 'none',
              background: 'rgba(0,0,0,0.50)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              fontSize: 24,
              fontWeight: 600,
              zIndex: 10,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.50)'
            }}
          >
            ×
          </button>
        </div>

        {/* Dots Navigation */}
        {images.length > 1 && (
          <div
            style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              borderTop: `1px solid ${C.border}`,
              background: '#fff',
              flexShrink: 0,
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                style={{
                  width: currentIdx === idx ? 28 : 10,
                  height: 10,
                  borderRadius: 5,
                  border: 'none',
                  background: currentIdx === idx ? '#6366F1' : '#D0D3E4',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                }}
                title={`Image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
