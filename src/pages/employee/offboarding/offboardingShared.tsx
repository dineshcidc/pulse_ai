/* Shared types + controls for the employee Offboarding tabs.
 * The Preview state (pending / approved / rejected) is owned by the Offboarding
 * container and passed to every tab, so all tabs reflect one shared case status. */

export type ReviewState = 'pending' | 'approved' | 'rejected'

export interface OffboardingTabProps {
  reviewState: ReviewState
  onReviewChange: (v: ReviewState) => void
}

const C = { navy: '#1C2035', muted: '#8B90A7', border: '#E4E6EF', surface: '#F7F8FC' }

export function PreviewSwitcher({ value, onChange }: { value: ReviewState; onChange: (v: ReviewState) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
      <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Preview</span>
      <div style={{ display: 'flex', gap: 3, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
        {(['pending', 'approved', 'rejected'] as const).map(s => {
          const on = value === s
          return (
            <button key={s} onClick={() => onChange(s)}
              style={{ padding: '5px 11px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize', fontFamily: 'inherit', background: on ? '#fff' : 'transparent', color: on ? C.navy : C.muted, boxShadow: on ? '0 1px 3px rgba(28,32,53,0.10)' : 'none', transition: 'all 0.12s' }}>
              {s}
            </button>
          )
        })}
      </div>
    </div>
  )
}
