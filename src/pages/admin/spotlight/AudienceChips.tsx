import { UserSquare2, Users } from 'lucide-react'
import { AUDIENCE_META, AUDIENCE_ORDER, type Audience } from './nominationTemplatesData'

/* One tinted chip per audience. A template (and so a round) may target
   Managers, Employees, or both — hence a list rather than a single chip. */

export const AUDIENCE_ICON: Record<Audience, typeof Users> = {
  Managers:  UserSquare2,
  Employees: Users,
}

export default function AudienceChips({
  audiences, prefix = '', compact = false,
}: {
  audiences: Audience[]
  /** Prefix inside each chip, e.g. "For " on the template cards. */
  prefix?: string
  /** Tighter padding for dense rows. */
  compact?: boolean
}) {
  const ordered = AUDIENCE_ORDER.filter(a => audiences.includes(a))

  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: compact ? '3px 9px' : '4px 10px', borderRadius: 8,
    fontSize: compact ? 11 : 11.5, fontWeight: 700, whiteSpace: 'nowrap',
  }

  if (ordered.length === 0) {
    return (
      <span style={{ ...base, color: '#8B90A7', background: 'rgba(139,144,167,0.12)', border: '1px solid rgba(139,144,167,0.24)' }}>
        No audience
      </span>
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', minWidth: 0 }}>
      {ordered.map(a => {
        const meta = AUDIENCE_META[a]
        const Icon = AUDIENCE_ICON[a]
        return (
          <span
            key={a}
            style={{ ...base, color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
          >
            <Icon size={compact ? 12 : 13} strokeWidth={2} /> {prefix}{a}
          </span>
        )
      })}
    </span>
  )
}
