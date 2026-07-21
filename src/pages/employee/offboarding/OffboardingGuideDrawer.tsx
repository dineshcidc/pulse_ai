import { X, DoorOpen, UserCheck, CalendarClock, ClipboardList, Wallet, FileText, CheckCircle2 } from 'lucide-react'
import type { ElementType } from 'react'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  indigo: '#6366F1',
}

interface Step {
  Icon: ElementType
  title: string
  desc: string
  points: string[]
}

const STEPS: Step[] = [
  {
    Icon: DoorOpen,
    title: 'Raise Your Resignation',
    desc: 'You start the process from the Resignation Request tab.',
    points: [
      'Submit your resignation with a reason and your intended Last Working Day (LWD).',
      'Your request is sent to your Manager for review.',
      'You can withdraw the request anytime before it is accepted.',
    ],
  },
  {
    Icon: UserCheck,
    title: 'Manager Review & Acceptance',
    desc: 'Your manager reviews and responds to your request.',
    points: [
      'Your manager accepts the resignation and confirms your Last Working Day.',
      'The LWD is based on your notice period (typically 30, 60, or 90 days).',
      'Your manager may discuss and adjust the date with you if needed.',
    ],
  },
  {
    Icon: CalendarClock,
    title: 'Notice Period',
    desc: 'You continue working until your Last Working Day.',
    points: [
      'Your notice period begins once the resignation is accepted.',
      'Use this time to wrap up and hand over your work.',
      'Most exit tasks happen in the last 1–2 weeks before your LWD.',
    ],
  },
  {
    Icon: ClipboardList,
    title: 'Complete Your Clearances',
    desc: 'HR opens your case and a clearance checklist is created. Track it all from My Offboarding.',
    points: [
      'Knowledge Transfer — document your work and hand it over to your team.',
      'Manager Clearance — your manager confirms the handover is complete.',
      'Asset Return — return your laptop, ID card, and accessories.',
      'IT Access — your access (email, VPN, tools) is revoked on your last day.',
      'Exit Interview — share your feedback about your time with us.',
    ],
  },
  {
    Icon: Wallet,
    title: 'Full & Final Settlement (F&F)',
    desc: 'Finance calculates and pays your final settlement after your last day.',
    points: [
      'Includes pending salary, leave encashment, and any deductions or recoveries.',
      'Usually settled within 30–45 days of your Last Working Day.',
    ],
  },
  {
    Icon: FileText,
    title: 'Exit Documents',
    desc: 'Once cleared, your documents are issued in the Exit Documents tab.',
    points: [
      'Relieving Letter and Experience Letter.',
      'Full & Final Settlement Statement and Payslips.',
      'Form 16 (if applicable).',
    ],
  },
  {
    Icon: CheckCircle2,
    title: 'Offboarding Complete',
    desc: 'Your exit is finalised and your case is closed.',
    points: [
      'Your access is deactivated and your status becomes “Offboarded”.',
      'You can still download your exit documents anytime.',
    ],
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function OffboardingGuideDrawer({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(10,12,28,0.45)',
        backdropFilter: 'blur(3px)',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes offbDrawerIn { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>

      {/* ── Half-screen canvas panel ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          width: '50vw',
          minWidth: 460,
          background: '#fff',
          boxShadow: '-24px 0 64px rgba(10,12,28,0.20)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'offbDrawerIn 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            flexShrink: 0,
            padding: '22px 28px',
            borderBottom: `1px solid ${C.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            background: 'linear-gradient(180deg, rgba(99,102,241,0.06), rgba(99,102,241,0))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: 'rgba(99,102,241,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <DoorOpen size={22} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: 0 }}>
                How Your Offboarding Works
              </h2>
              <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>
                A step-by-step guide to your exit journey — from resignation to final settlement.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            style={{
              width: 34, height: 34, flexShrink: 0, borderRadius: 9,
              background: C.bg, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.bg }}
          >
            <X size={17} strokeWidth={2} style={{ color: C.muted }} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 40px' }}>
          {/* Intro */}
          <p style={{ fontSize: 13.5, color: '#5A6080', fontWeight: 500, lineHeight: 1.7, margin: '0 0 26px' }}>
            Offboarding is the process we follow when you leave the company. It makes sure your exit
            is smooth — your work is handed over, company assets are returned, your dues are settled,
            and you receive all your exit documents. Here is exactly what happens, step by step.
          </p>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div
              style={{
                position: 'absolute', left: 21, top: 8, bottom: 8, width: 2,
                background: C.border,
              }}
            />

            {STEPS.map((step, i) => {
              const { Icon } = step
              return (
                <div key={i} style={{ display: 'flex', gap: 18, marginBottom: i < STEPS.length - 1 ? 40 : 0 }}>
                  {/* node */}
                  <div style={{ flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: C.bg, border: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} strokeWidth={1.8} style={{ color: C.muted }} />
                    </div>
                  </div>

                  {/* content */}
                  <div style={{ flex: 1, paddingTop: 3 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: 10.5, fontWeight: 700, color: C.muted,
                          background: C.bg, padding: '2px 7px', borderRadius: 5,
                          letterSpacing: '0.03em',
                        }}
                      >
                        STEP {i + 1}
                      </span>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>{step.title}</h3>
                    </div>
                    <p style={{ fontSize: 12.8, color: C.muted, fontWeight: 500, margin: '0 0 14px', lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {step.points.map((pt, j) => (
                        <li
                          key={j}
                          style={{
                            display: 'flex', gap: 10, alignItems: 'flex-start',
                            background: '#F7F8FC', border: `1px solid ${C.border}`,
                            borderRadius: 9, padding: '10px 12px',
                          }}
                        >
                          <span
                            style={{
                              width: 5, height: 5, borderRadius: '50%', background: '#B0B4C8',
                              flexShrink: 0, marginTop: 8,
                            }}
                          />
                          <span style={{ fontSize: 13, color: C.navy, fontWeight: 500, lineHeight: 1.65 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tip note */}
          <div
            style={{
              marginTop: 30, padding: '14px 16px', borderRadius: 12,
              background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                background: 'rgba(99,102,241,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo }}>i</span>
            </div>
            <p style={{ fontSize: 12.8, color: '#4F46E5', fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 700 }}>Tip:</strong> Track your live progress and pending
              tasks anytime from the <strong style={{ fontWeight: 700 }}>My Offboarding</strong> tab.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
