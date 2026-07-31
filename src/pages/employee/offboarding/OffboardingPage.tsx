import { useState } from 'react'
import { BookOpen, Eye, X } from 'lucide-react'
import ResignationRequestPage from './ResignationRequestPage'
import MyOffboardingPage from './MyOffboardingPage'
import ExitInterviewPage from './ExitInterviewPage'
import AssetReturnPage from './AssetReturnPage'
import ExitDocumentsPage from './ExitDocumentsPage'
import OffboardingGuideDrawer from './OffboardingGuideDrawer'
import type { ReviewState, OffboardingTabProps } from './offboardingShared'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
}

type TabId =
  | 'resignation'
  | 'my'
  | 'exit-interview'
  | 'assets'
  | 'documents'

const TABS: { id: TabId; label: string; Panel: React.ComponentType<OffboardingTabProps> }[] = [
  { id: 'resignation',    label: 'Resignation Request', Panel: ResignationRequestPage },
  { id: 'my',             label: 'My Offboarding',      Panel: MyOffboardingPage      },
  { id: 'exit-interview', label: 'Exit Interview',      Panel: ExitInterviewPage      },
  { id: 'assets',         label: 'Asset Return',        Panel: AssetReturnPage        },
  { id: 'documents',      label: 'Exit Documents',      Panel: ExitDocumentsPage      },
]

export default function OffboardingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resignation')
  const [guideOpen, setGuideOpen] = useState(false)
  const [infoVisible, setInfoVisible] = useState(true)
  const [reviewState, setReviewState] = useState<ReviewState>('pending')
  const ActivePanel = TABS.find(t => t.id === activeTab)!.Panel

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Info banner (first section, full width, dismissible) ── */}
      {infoVisible && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            background: 'linear-gradient(120deg, rgba(99,102,241,0.10), rgba(99,102,241,0.03))',
            border: '1px solid rgba(99,102,241,0.22)',
            borderRadius: 11,
            padding: '12px 12px',
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: 'rgba(99,102,241,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <BookOpen size={16} strokeWidth={1.9} style={{ color: '#6366F1' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
              New to offboarding?
            </span>
            <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500, marginLeft: 6 }}>
              See the complete process step by step.
            </span>
          </div>

          <button
            onClick={() => setGuideOpen(true)}
            title="View process"
            style={{
              width: 30, height: 30, flexShrink: 0, borderRadius: 8,
              background: 'rgba(99,102,241,0.12)', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
          >
            <Eye size={15} strokeWidth={2} style={{ color: '#6366F1' }} />
          </button>

          <button
            onClick={() => setInfoVisible(false)}
            title="Dismiss"
            style={{
              width: 30, height: 30, flexShrink: 0, borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,144,167,0.14)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <X size={15} strokeWidth={2} style={{ color: C.muted }} />
          </button>
        </div>
      )}

      {/* ── 2 / 10 grid: vertical tabs + active panel ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 10fr',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {/* Left (2): vertical tabs */}
        <div
          style={{
            background: '#fff',
            border: `1px solid ${C.border}`,
            borderRadius: 14,
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            position: 'sticky',
            top: 0,
          }}
        >
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 14px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  color: active ? '#4F46E5' : C.navy,
                  background: active ? '#EEF2FF' : 'transparent',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F5F6FA' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 18,
                      borderRadius: '0 3px 3px 0',
                      background: '#6366F1',
                    }}
                  />
                )}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Right (10): active tab panel (title + subtext + white card) */}
        <div style={{ minWidth: 0 }}>
          <ActivePanel reviewState={reviewState} onReviewChange={setReviewState} />
        </div>
      </div>

      {/* ── Step-by-step guide drawer (half screen) ── */}
      <OffboardingGuideDrawer open={guideOpen} onClose={() => setGuideOpen(false)} />
    </div>
  )
}
