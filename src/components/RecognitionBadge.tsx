import { useState, useEffect } from 'react'
import { Trophy, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Recognition {
  id: number
  tagName: string
  title: string
  description: string
  recipients: number
  date: string
  images?: string[]
  wishingMessage?: string
}

interface RecognitionBadgeProps {
  recognition?: Recognition
  onClick?: () => void
}

// Sample poster images
const SAMPLE_POSTERS = [
  '/Rewardimage-1.png',
  '/Rewardimage-5.png',
  '/Rewardimage-2.png',
]

export default function RecognitionBadge({ recognition, onClick }: RecognitionBadgeProps) {
  const [showHover, setShowHover] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!showPanel || !isAutoPlay) return

    const interval = setInterval(() => {
      setCurrentImageIdx(prev =>
        prev === SAMPLE_POSTERS.length - 1 ? 0 : prev + 1
      )
    }, 4000) // Auto-play every 4 seconds

    return () => clearInterval(interval)
  }, [showPanel, isAutoPlay])

  if (!recognition) return null

  return (
    <>
    <div
      onClick={() => {
        onClick?.()
        setShowPanel(true)
      }}
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 24,
        marginLeft: 100,
        background: showHover
          ? 'linear-gradient(135deg, rgba(242,208,0,0.14) 0%, rgba(212,168,0,0.10) 100%)'
          : 'linear-gradient(135deg, rgba(242,208,0,0.10) 0%, rgba(212,168,0,0.06) 100%)',
        border: showHover
          ? '1.2px solid rgba(212,168,0,0.4)'
          : '1.2px solid rgba(212,168,0,0.25)',
        cursor: 'pointer',
        transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: showHover
          ? '0 4px 12px rgba(212,168,0,0.10), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(254,243,199,0.5)'
          : '0 2px 6px rgba(212,168,0,0.06), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 12px rgba(254,243,199,0.35)',
        backdropFilter: 'blur(4px)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: 500,
        animation: 'borderGlow 3s ease-in-out infinite',
      }}
    >
      {/* Animated background shimmer effect */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
          transform: showHover ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.6s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Trophy Icon Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: 7,
          background: showHover
            ? 'linear-gradient(135deg, rgba(212,168,0,0.22) 0%, rgba(242,208,0,0.12) 100%)'
            : 'linear-gradient(135deg, rgba(212,168,0,0.15) 0%, rgba(242,208,0,0.08) 100%)',
          border: '1px solid rgba(212,168,0,0.25)',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: showHover
            ? '0 3px 10px rgba(212,168,0,0.14)'
            : '0 1px 4px rgba(212,168,0,0.08)',
        }}
      >
        <Trophy
          size={16}
          strokeWidth={1.8}
          style={{
            color: '#A07800',
            animation: showHover ? 'badgePulse 0.6s ease' : 'none',
          }}
        />
      </div>

      {/* Text Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          position: 'relative',
          zIndex: 1,
          minWidth: 0,
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: '#D4A500',
            lineHeight: 1.1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.3px',
          }}
        >
          "{recognition.tagName}"
        </div>
      </div>

      {/* Eye Icon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 6,
          background: showHover ? 'rgba(212,168,0,0.18)' : 'transparent',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
          marginLeft: 2,
        }}
      >
        <Eye
          size={12}
          strokeWidth={2.3}
          style={{
            color: '#A07800',
            opacity: showHover ? 1 : 0.7,
            transition: 'all 0.24s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes borderGlow {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(212,168,0,0.10), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 16px rgba(254,243,199,0.3);
            border-color: rgba(212,168,0,0.25);
          }
          50% {
            box-shadow: 0 4px 12px rgba(212,168,0,0.12), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 28px rgba(254,243,199,0.5);
            border-color: rgba(212,168,0,0.4);
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>

    {/* Recognition Panel */}
    {showPanel && (
      <>
        {/* Backdrop */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9000,
            background: 'rgba(10,12,28,0.4)',
            backdropFilter: 'blur(4px)',
            opacity: isClosing ? 0 : 1,
            transition: 'opacity 0.3s ease',
          }}
          onClick={() => {
            setIsClosing(true)
            setTimeout(() => {
              setShowPanel(false)
              setIsClosing(false)
            }, 300)
          }}
        />

        {/* Slide Panel */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 42,
            zIndex: 9001,
            background: '#fff',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            padding: 24,
            overflow: 'auto',
            animation: isClosing ? 'slideUp 0.36s cubic-bezier(0.4,0,0.2,1)' : 'slideDown 0.36s cubic-bezier(0.4,0,0.2,1)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {/* Top Section - Welcome Card (Compact) */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(242,208,0,0.12) 0%, rgba(212,168,0,0.08) 100%)',
              border: '1px solid rgba(212,168,0,0.15)',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(212,168,0,0.25) 0%, rgba(242,208,0,0.15) 100%)',
                border: '1.5px solid rgba(212,168,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Trophy size={22} strokeWidth={1.8} color="#A07800" />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#1C2035',
                  marginBottom: 3,
                  lineHeight: 1.2,
                }}
              >
                {recognition?.tagName || 'Achievement Unlocked!'}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: '#8B90A7',
                  fontWeight: 500,
                  lineHeight: 1.3,
                }}
              >
                {recognition?.wishingMessage || 'You have been recognized for your outstanding contributions!'}
              </div>
            </div>

            {/* Close Button - Centered in Card */}
            <button
              onClick={() => {
                setIsClosing(true)
                setTimeout(() => {
                  setShowPanel(false)
                  setIsClosing(false)
                }, 300)
              }}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 36,
                height: 36,
                borderRadius: 10,
                border: 'none',
                background: 'rgba(254,243,199,0.4)',
                color: '#A07800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(254,243,199,0.6)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(254,243,199,0.4)'
              }}
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Recognition Posters Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            {/* Carousel Container */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 20,
              }}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {/* Left Arrow */}
              <button
                onClick={() => setCurrentImageIdx(Math.max(0, currentImageIdx - 1))}
                disabled={currentImageIdx === 0}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: currentImageIdx === 0 ? '#F7F8FC' : '#FAFBFC',
                  color: currentImageIdx === 0 ? '#C0C4D6' : '#1C2035',
                  cursor: currentImageIdx === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (currentImageIdx > 0) {
                    e.currentTarget.style.background = '#F0F2F8'
                  }
                }}
                onMouseLeave={e => {
                  if (currentImageIdx > 0) {
                    e.currentTarget.style.background = '#FAFBFC'
                  }
                }}
              >
                <ChevronLeft size={20} strokeWidth={2.2} />
              </button>

              {/* Image Container - Fixed Height */}
              <div
                style={{
                  width: '100%',
                  height: 700,
                  borderRadius: 16,
                  border: '2px dotted rgba(212,168,0,0.2)',
                  overflow: 'hidden',
                  background: '#FAFBFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  key={currentImageIdx}
                  src={SAMPLE_POSTERS[currentImageIdx]}
                  alt={`Poster ${currentImageIdx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: '20px',
                    animation: 'smoothFadeIn 0.4s ease-in-out',
                  }}
                />
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => setCurrentImageIdx(Math.min(SAMPLE_POSTERS.length - 1, currentImageIdx + 1))}
                disabled={currentImageIdx === SAMPLE_POSTERS.length - 1}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: 'none',
                  background: currentImageIdx === SAMPLE_POSTERS.length - 1 ? '#F7F8FC' : '#FAFBFC',
                  color: currentImageIdx === SAMPLE_POSTERS.length - 1 ? '#C0C4D6' : '#1C2035',
                  cursor: currentImageIdx === SAMPLE_POSTERS.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (currentImageIdx < SAMPLE_POSTERS.length - 1) {
                    e.currentTarget.style.background = '#F0F2F8'
                  }
                }}
                onMouseLeave={e => {
                  if (currentImageIdx < SAMPLE_POSTERS.length - 1) {
                    e.currentTarget.style.background = '#FAFBFC'
                  }
                }}
              >
                <ChevronRight size={20} strokeWidth={2.2} />
              </button>
            </div>

            {/* Dots Navigation */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {SAMPLE_POSTERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIdx(idx)}
                  style={{
                    width: currentImageIdx === idx ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    border: 'none',
                    background: currentImageIdx === idx ? '#A07800' : '#D0D3E4',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </>
    )}

    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `}</style>
    </>
  )
}
