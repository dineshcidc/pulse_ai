import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { C } from '../admin/spotlight/nominationTemplatesData'
import MyNominationPage from './MyNominationPage'
import NominationFormPage from './NominationFormPage'
import { nominationInboxFor, type NominatorRole } from './nominationInboxData'

/* ══════════════════════════════════════════
   Spotlight — nominator route (`spotlight-nominate`)
   Owns which nominator screen is showing:
     · nothing submitted yet → the form
     · submitted             → the read-only recap
   Submitting re-reads the inbox, so the recap (and
   the dashboard card behind it) reflect it at once.
══════════════════════════════════════════ */

interface Props {
  role: NominatorRole
  onBack: () => void
}

export default function NominationModule({ role, onBack }: Props) {
  /* Set when a partially-done nominator asks for the form again from the recap. */
  const [forceForm, setForceForm] = useState(false)

  const inbox = nominationInboxFor(role)

  if (!inbox) return <NoCampaign onBack={onBack} />

  const pending  = inbox.tasks.filter(t => !t.submission)
  const showForm = pending.length > 0 && (inbox.submittedCount === 0 || forceForm)

  return showForm ? (
    <NominationFormPage
      inbox={inbox}
      role={role}
      onBack={onBack}
      /* Submitting goes straight back to the dashboard, where the card now
         shows the submitted state. The recap lives behind `View Nomination`. */
      onSubmitted={onBack}
    />
  ) : (
    <MyNominationPage
      inbox={inbox}
      onBack={onBack}
      onSubmitOutstanding={() => setForceForm(true)}
    />
  )
}

/* Nothing open for this user — they reached the route directly. */
function NoCampaign({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ background: '#fff', border: `1px solid ${C.border}`, minHeight: 320 }}
      >
        <div className="text-center" style={{ maxWidth: 380, padding: 24 }}>
          <div
            className="flex items-center justify-center mx-auto"
            style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.22)', marginBottom: 14 }}
          >
            <Trophy size={22} strokeWidth={1.7} style={{ color: '#7C3AED' }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>No nomination form is open</p>
          <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: '8px 0 0' }}>
            There is no Rewards &amp; Recognition campaign running for you right now. You will see a
            card on your dashboard as soon as one opens.
          </p>
          <button
            onClick={onBack}
            className="rounded-lg border-none cursor-pointer font-semibold transition-all duration-150"
            style={{ marginTop: 16, height: 36, padding: '0 16px', fontSize: 12.5, background: 'rgba(99,102,241,0.12)', color: '#6366F1', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
